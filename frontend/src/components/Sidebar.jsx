import React from 'react';
import { LayoutDashboard, Users, BookOpen, Building, UsersIcon, CalendarDays, Wand2 } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'teachers', label: 'Profesores', icon: Users },
    { id: 'courses', label: 'Materias', icon: BookOpen },
    { id: 'rooms', label: 'Aulas', icon: Building },
    { id: 'groups', label: 'Grupos', icon: UsersIcon },
    { id: 'terms', label: 'Periodos', icon: CalendarDays },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <CalendarDays size={28} />
        <h2>OptiClass</h2>
      </div>
      <ul className="nav-links">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon size={20} />
              {item.label}
            </li>
          );
        })}
        <li style={{ margin: '1rem 0', height: '1px', background: 'rgba(0,0,0,0.1)' }}></li>
        <li
          className={`nav-item action ${currentView === 'generate' ? 'active' : ''}`}
          onClick={() => setCurrentView('generate')}
        >
          <Wand2 size={20} />
          Generar Horario
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
