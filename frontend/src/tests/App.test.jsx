import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

vi.mock('../components/Sidebar', () => ({
  default: ({ currentView, setCurrentView }) => (
    <div data-testid="sidebar">{currentView}</div>
  ),
}));

vi.mock('../components/ScheduleGrid', () => ({
  default: () => <div data-testid="schedule-grid">Grid</div>,
}));

vi.mock('../components/CrudView', () => ({
  default: ({ config }) => <div data-testid={`crud-${config.endpoint}`}>{config.title}</div>,
}));

describe('App', () => {
  it('renderiza el sidebar', () => {
    render(<App />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renderiza el dashboard por defecto', () => {
    render(<App />);
    expect(screen.getByText('Bienvenido a OptiClass')).toBeInTheDocument();
  });

  it('renderiza "Administrador" en el topbar', () => {
    render(<App />);
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('muestra "dashboard" como título por defecto en el topbar', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('dashboard');
  });
});
