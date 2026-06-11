import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { cleanup } from '@testing-library/react';
import CrudView from '../CrudView';

const teachersConfig = {
  title: 'Profesores',
  singular: 'Profesor',
  endpoint: 'teachers',
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre Completo', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
  ],
};

describe('CrudView', () => {
  const originalConfirm = window.confirm;
  const originalAlert = window.alert;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' });
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    window.confirm = originalConfirm;
    window.alert = originalAlert;
    server.close();
  });

  it('renderiza el título y botón de añadir', async () => {
    render(<CrudView config={teachersConfig} />);
    expect(screen.getByText('Gestión de Profesores')).toBeInTheDocument();
    expect(screen.getByText('Añadir Profesor')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });
  });

  it('muestra estado loading inicialmente', async () => {
    render(<CrudView config={teachersConfig} />);
    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });
  });

  it('renderiza datos de la API al cargar', async () => {
    render(<CrudView config={teachersConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    });
    expect(screen.getByText('perez@test.com')).toBeInTheDocument();
    expect(screen.getByText('Ing. López')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay registros', async () => {
    server.use(
      http.get('http://localhost:3000/api/teachers', () =>
        HttpResponse.json({ success: true, data: [] })
      )
    );
    render(<CrudView config={teachersConfig} />);
    await waitFor(() => {
      expect(screen.getByText('No hay registros.')).toBeInTheDocument();
    });
  });

  it('abre modal al hacer click en Añadir', async () => {
    render(<CrudView config={teachersConfig} />);
    await userEvent.click(screen.getByText('Añadir Profesor'));
    const modalTitle = screen.getAllByText('Añadir Profesor');
    expect(modalTitle.length).toBe(2);
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('abre modal con datos al hacer click en editar', async () => {
    render(<CrudView config={teachersConfig} />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    });
    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    const editBtn = within(firstDataRow).getAllByRole('button')[0];
    await userEvent.click(editBtn);
    await waitFor(() => {
      expect(screen.getByText('Editar Profesor')).toBeInTheDocument();
    });
  });

  it('envía formulario correctamente', async () => {
    render(<CrudView config={teachersConfig} />);
    await userEvent.click(screen.getByText('Añadir Profesor'));
    await userEvent.type(screen.getByLabelText('Nombre Completo'), 'Nuevo Profesor');
    await userEvent.type(screen.getByLabelText('Email'), 'nuevo@test.com');
    await userEvent.click(screen.getByText('Guardar'));
    await waitFor(() => {
      expect(screen.getByText('Añadir Profesor')).toBeInTheDocument();
    });
  });

  it('cierra modal al hacer click en Cancelar', async () => {
    render(<CrudView config={teachersConfig} />);
    await userEvent.click(screen.getByText('Añadir Profesor'));
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Cancelar'));
    await waitFor(() => {
      expect(screen.queryByLabelText('Nombre Completo')).not.toBeInTheDocument();
    });
  });

  it('maneja error de red', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    server.use(
      http.get('http://localhost:3000/api/teachers', () =>
        HttpResponse.error()
      )
    );
    render(<CrudView config={teachersConfig} />);
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    errorSpy.mockRestore();
  });
});
