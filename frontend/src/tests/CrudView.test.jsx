import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CrudView from '../components/CrudView';

const mockConfig = {
  title: 'Profesores',
  singular: 'Profesor',
  endpoint: 'teachers',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre Completo', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'availability', label: 'Turnos', type: 'checkboxes', options: ['Mañana', 'Tarde', 'Noche'] },
  ],
};

const mockData = {
  success: true,
  data: [
    { id: 1, name: 'Dr. Carlos Mendoza', email: 'carlos@test.com', availability: '["Mañana","Tarde"]' },
    { id: 2, name: 'Mg. Laura Castillo', email: 'laura@test.com', availability: '["Mañana","Noche"]' },
  ],
};

const makeFetch = (data) => () =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) });

describe('CrudView', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn(makeFetch(mockData));
  });

  it('renderiza el título con Gestión de', async () => {
    render(<CrudView config={mockConfig} />);
    expect(screen.getByText('Gestión de Profesores')).toBeInTheDocument();
  });

  it('muestra el botón Añadir Profesor', () => {
    render(<CrudView config={mockConfig} />);
    expect(screen.getByText('Añadir Profesor')).toBeInTheDocument();
  });

  it('carga datos desde la API al montar', async () => {
    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/teachers');
    });
  });

  it('muestra los registros después de cargar', async () => {
    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Carlos Mendoza')).toBeInTheDocument();
      expect(screen.getByText('Mg. Laura Castillo')).toBeInTheDocument();
    });
  });

  it('abre modal al hacer clic en Añadir', async () => {
    render(<CrudView config={mockConfig} />);
    fireEvent.click(screen.getByText('Añadir Profesor'));
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/Añadir/);
    });
  });

  it('renderiza los checkboxes de disponibilidad en el modal', async () => {
    render(<CrudView config={mockConfig} />);
    fireEvent.click(screen.getByText('Añadir Profesor'));
    await waitFor(() => {
      expect(screen.getByText('Mañana')).toBeInTheDocument();
      expect(screen.getByText('Tarde')).toBeInTheDocument();
      expect(screen.getByText('Noche')).toBeInTheDocument();
    });
  });

  it('abre modal en modo edición al hacer clic en editar', async () => {
    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Carlos Mendoza')).toBeInTheDocument();
    });
    const addButton = screen.getByText('Añadir Profesor');
    const allButtons = screen.getAllByRole('button');
    const editBtn = allButtons.find(b =>
      b !== addButton && !b.textContent.includes('Añadir') && b.querySelector('svg')
    );
    if (editBtn) fireEvent.click(editBtn);
    await waitFor(() => {
      expect(screen.getByText('Editar Profesor')).toBeInTheDocument();
    });
  });

  it('envía DELETE al hacer clic en eliminar', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) });

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Carlos Mendoza')).toBeInTheDocument();
    });

    const allButtons = screen.getAllByRole('button');
    const addBtn = screen.getByText('Añadir Profesor');
    const deleteBtn = allButtons.find(b =>
      b !== addBtn && b.style.color === 'rgb(239, 68, 68)'
    );
    if (deleteBtn) fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/teachers/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    confirmSpy.mockRestore();
  });

  it('muestra "No hay registros" cuando no hay datos', async () => {
    global.fetch = vi.fn(makeFetch({ success: true, data: [] }));
    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(screen.getByText('No hay registros.')).toBeInTheDocument();
    });
  });

  it('renderiza las columnas del encabezado', async () => {
    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Turnos')).toBeInTheDocument();
    });
  });

  it('muestra los turnos formateados en la tabla', async () => {
    render(<CrudView config={mockConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Mañana, Tarde')).toBeInTheDocument();
      expect(screen.getByText('Mañana, Noche')).toBeInTheDocument();
    });
  });
});
