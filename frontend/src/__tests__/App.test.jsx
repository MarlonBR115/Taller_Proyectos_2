import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../test/mocks/server';
import App from '../App';

describe('App', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renderiza la aplicación completa', () => {
    render(<App />);
    expect(screen.getByText('OptiClass')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('muestra el dashboard por defecto', () => {
    render(<App />);
    expect(screen.getByText('Bienvenido a OptiClass')).toBeInTheDocument();
  });

  it('navega a Profesores al hacer click en el sidebar', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Profesores'));
    expect(screen.getByText('Gestión de Profesores')).toBeInTheDocument();
  });

  it('navega a Materias al hacer click en el sidebar', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Materias'));
    expect(screen.getByText('Gestión de Materias')).toBeInTheDocument();
  });

  it('navega a Aulas al hacer click en el sidebar', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Aulas'));
    expect(screen.getByText('Gestión de Aulas')).toBeInTheDocument();
  });

  it('navega a Grupos al hacer click en el sidebar', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Grupos'));
    expect(screen.getByText('Gestión de Grupos')).toBeInTheDocument();
  });

  it('navega a Periodos al hacer click en el sidebar', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Periodos'));
    expect(screen.getByText('Gestión de Periodos')).toBeInTheDocument();
  });

  it('navega al generador de horarios', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Generar Horario'));
    expect(screen.getByText('Generador de Horarios')).toBeInTheDocument();
  });

  it('actualiza el título del topbar según la vista', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Profesores'));
    const profHeaders = screen.getAllByText('Profesores');
    expect(profHeaders.length).toBeGreaterThanOrEqual(2);
    await userEvent.click(screen.getByText('Materias'));
    const matHeaders = screen.getAllByText('Materias');
    expect(matHeaders.length).toBeGreaterThanOrEqual(2);
  });

  it('el item activo del sidebar cambia al navegar', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Profesores'));
    const activeProf = screen.getAllByText('Profesores')[0].closest('li');
    expect(activeProf).toHaveClass('active');
    await userEvent.click(screen.getByText('Materias'));
    const activeMat = screen.getAllByText('Materias')[0].closest('li');
    const inactiveProf = screen.getAllByText('Profesores')[0].closest('li');
    expect(activeMat).toHaveClass('active');
    expect(inactiveProf).not.toHaveClass('active');
  });
});
