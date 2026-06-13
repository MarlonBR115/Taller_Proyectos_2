import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  const defaultProps = {
    currentView: 'dashboard',
    setCurrentView: jest.fn(),
  };

  it('renderiza todos los items del menú', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('OptiClass')).toBeInTheDocument();
    expect(screen.getByText('Panel Principal')).toBeInTheDocument();
    expect(screen.getByText('Profesores')).toBeInTheDocument();
    expect(screen.getByText('Materias')).toBeInTheDocument();
    expect(screen.getByText('Aulas')).toBeInTheDocument();
    expect(screen.getByText('Grupos')).toBeInTheDocument();
    expect(screen.getByText('Periodos')).toBeInTheDocument();
    expect(screen.getByText('Generar Horario')).toBeInTheDocument();
  });

  it('resalta el item activo', () => {
    render(<Sidebar currentView="teachers" setCurrentView={jest.fn()} />);
    expect(screen.getByText('Profesores').closest('li')).toHaveClass('active');
  });

  it('llama a setCurrentView al hacer click en un item', async () => {
    const setCurrentView = jest.fn();
    render(<Sidebar currentView="dashboard" setCurrentView={setCurrentView} />);
    await userEvent.click(screen.getByText('Profesores'));
    expect(setCurrentView).toHaveBeenCalledWith('teachers');
  });

  it('navega a generate al hacer click en Generar Horario', async () => {
    const setCurrentView = jest.fn();
    render(<Sidebar currentView="dashboard" setCurrentView={setCurrentView} />);
    await userEvent.click(screen.getByText('Generar Horario'));
    expect(setCurrentView).toHaveBeenCalledWith('generate');
  });

  it('tiene clase action en el item Generar Horario', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Generar Horario').closest('li')).toHaveClass('action');
  });
});
