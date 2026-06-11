import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import ScheduleGrid from '../ScheduleGrid';

describe('ScheduleGrid', () => {
  const originalAlert = window.alert;
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'bypass' });
    window.alert = jest.fn();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => {
    window.alert = originalAlert;
    server.close();
  });

  it('renderiza el título y botón de generar', () => {
    render(<ScheduleGrid />);
    expect(screen.getByText('Motor de Generación CSP')).toBeInTheDocument();
    expect(screen.getByText('Generar Horario')).toBeInTheDocument();
  });

  it('muestra los días de la semana', () => {
    render(<ScheduleGrid />);
    expect(screen.getByText('Lunes')).toBeInTheDocument();
    expect(screen.getByText('Martes')).toBeInTheDocument();
    expect(screen.getByText('Miercoles')).toBeInTheDocument();
    expect(screen.getByText('Jueves')).toBeInTheDocument();
    expect(screen.getByText('Viernes')).toBeInTheDocument();
  });

  it('renderiza horarios desde la API', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    });
    expect(screen.getByText('Física I')).toBeInTheDocument();
  });

  it('permite filtrar por materia', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    });
    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[1], 'Matemáticas I');
    expect(screen.getAllByText('Matemáticas I').length).toBe(2);
  });

  it('abre modal al hacer click en un bloque de horario', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Dr. Pérez'));
    expect(screen.getByText('Detalles de la Clase')).toBeInTheDocument();
    expect(screen.getAllByText('Dr. Pérez').length).toBe(2);
  });

  it('cierra modal al hacer click en Cerrar', async () => {
    render(<ScheduleGrid />);
    await waitFor(() => {
      expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText('Dr. Pérez'));
    await userEvent.click(screen.getByText('Cerrar'));
    await waitFor(() => {
      expect(screen.queryByText('Detalles de la Clase')).not.toBeInTheDocument();
    });
  });

  it('envía petición de generación de horario', async () => {
    render(<ScheduleGrid />);
    await userEvent.click(screen.getByText('Generar Horario'));
    await waitFor(() => {
      expect(screen.queryByText('Generando...')).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('muestra mensaje de error cuando la API falla', async () => {
    server.use(
      http.post('http://localhost:3000/api/schedule/generate', () =>
        HttpResponse.json({ success: false, message: 'Error al generar' })
      )
    );
    render(<ScheduleGrid />);
    await userEvent.click(screen.getByText('Generar Horario'));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
