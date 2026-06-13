import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScheduleGrid from '../components/ScheduleGrid';

const mockSchedules = {
  success: true,
  data: [
    { id: 1, day_of_week: 'Lunes', start_time: '08:00:00', end_time: '10:00:00',
      course_name: 'Programación I', teacher_name: 'Dr. Mendoza', room_name: 'Aula 301' },
    { id: 2, day_of_week: 'Martes', start_time: '14:00:00', end_time: '16:00:00',
      course_name: 'Base de Datos', teacher_name: 'Mg. Castillo', room_name: 'Lab A' },
  ],
};

const makeFetch = (data) => () =>
  Promise.resolve({ json: () => Promise.resolve(data) });

describe('ScheduleGrid', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn(makeFetch(mockSchedules));
  });

  it('renderiza el título del motor CSP', async () => {
    render(<ScheduleGrid />);
    expect(screen.getByText('Motor de Generación CSP')).toBeInTheDocument();
  });

  it('renderiza los días de la semana', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Lunes')).toBeInTheDocument();
      expect(screen.getByText('Viernes')).toBeInTheDocument();
    });
  });

  it('renderiza el botón Generar Horario', () => {
    render(<ScheduleGrid />);
    expect(screen.getByText('Generar Horario')).toBeInTheDocument();
  });

  it('carga horarios desde la API al montar', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/schedule/all');
    });
  });

  it('muestra bloques de horario después de cargar datos', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Mendoza')).toBeInTheDocument();
    });
  });

  it('abre modal al hacer clic en un bloque', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getAllByText('Programación I').length).toBeGreaterThan(0);
    });
    const blocks = screen.getAllByText('Programación I');
    const blockDiv = blocks.find(el => el.closest('.schedule-block') !== null);
    fireEvent.click(blockDiv);
    expect(screen.getByText('Detalles de la Clase')).toBeInTheDocument();
  });

  it('cierra modal al hacer clic en Cerrar', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getAllByText('Programación I').length).toBeGreaterThan(0);
    });
    const blocks = screen.getAllByText('Programación I');
    const blockDiv = blocks.find(el => el.closest('.schedule-block') !== null);
    fireEvent.click(blockDiv);
    expect(screen.getByText('Detalles de la Clase')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.queryByText('Detalles de la Clase')).not.toBeInTheDocument();
  });

  it('renderiza filtros de tipo', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('Filtrar por Materia')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByDisplayValue('Filtrar por Materia'), {
      target: { value: 'teacher' },
    });
    expect(screen.getByDisplayValue('Filtrar por Profesor')).toBeInTheDocument();
  });

  it('llama a la API de generación al hacer clic en Generar', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockSchedules) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ success: true, message: 'Horario generado' }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockSchedules) });

    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Generar Horario')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Generar Horario'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/schedule/generate',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
