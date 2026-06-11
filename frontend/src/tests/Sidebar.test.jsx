import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../components/Sidebar';

describe('Sidebar', () => {
  const menuItems = [
    'Panel Principal', 'Profesores', 'Materias',
    'Aulas', 'Grupos', 'Periodos', 'Generar Horario',
  ];

  it('renderiza todos los items del menú', () => {
    render(<Sidebar currentView="dashboard" setCurrentView={() => {}} />);
    menuItems.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('resalta el item activo', () => {
    render(<Sidebar currentView="teachers" setCurrentView={() => {}} />);
    const activeItem = screen.getByText('Profesores').closest('li');
    expect(activeItem.classList.contains('active')).toBe(true);
  });

  it('no resalta items no activos', () => {
    render(<Sidebar currentView="dashboard" setCurrentView={() => {}} />);
    const inactiveItem = screen.getByText('Profesores').closest('li');
    expect(inactiveItem.classList.contains('active')).toBe(false);
  });

  it('llama setCurrentView con el id correcto al hacer clic', () => {
    const setView = vi.fn();
    render(<Sidebar currentView="dashboard" setCurrentView={setView} />);
    fireEvent.click(screen.getByText('Aulas'));
    expect(setView).toHaveBeenCalledWith('rooms');
  });

  it('llama setCurrentView con "generate" al hacer clic en Generar Horario', () => {
    const setView = vi.fn();
    render(<Sidebar currentView="dashboard" setCurrentView={setView} />);
    fireEvent.click(screen.getByText('Generar Horario'));
    expect(setView).toHaveBeenCalledWith('generate');
  });

  it('renderiza el logo OptiClass', () => {
    render(<Sidebar currentView="dashboard" setCurrentView={() => {}} />);
    expect(screen.getByText('OptiClass')).toBeInTheDocument();
  });
});
