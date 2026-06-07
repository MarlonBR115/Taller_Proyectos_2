import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ScheduleGrid from './components/ScheduleGrid';
import CrudView from './components/CrudView';

const ENTITY_CONFIG = {
  teachers: {
    title: 'Profesores', singular: 'Profesor', endpoint: 'teachers',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre Completo', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'availability', label: 'Turnos', type: 'checkboxes', options: ['Mañana', 'Tarde', 'Noche'] }
    ]
  },
  courses: {
    title: 'Materias', singular: 'Materia', endpoint: 'courses',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'code', label: 'Código', type: 'text' },
      { key: 'name', label: 'Nombre de Materia', type: 'text' },
      { key: 'weekly_hours', label: 'Horas Semanales', type: 'number' }
    ]
  },
  rooms: {
    title: 'Aulas', singular: 'Aula', endpoint: 'rooms',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre/Código', type: 'text' },
      { key: 'capacity', label: 'Capacidad', type: 'number' },
      { key: 'type', label: 'Tipo', type: 'text' }
    ]
  },
  groups: {
    title: 'Grupos', singular: 'Grupo', endpoint: 'groups',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre del Grupo', type: 'text' },
      { key: 'course_id', label: 'ID Materia', type: 'number' },
      { key: 'teacher_id', label: 'ID Profesor', type: 'number' },
      { key: 'quota', label: 'Cupo Alumnos', type: 'number' }
    ]
  },
  terms: {
    title: 'Periodos', singular: 'Periodo', endpoint: 'terms',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre (Ej: 2026-1)', type: 'text' },
      { key: 'start_date', label: 'Fecha Inicio', type: 'date' },
      { key: 'end_date', label: 'Fecha Fin', type: 'date' },
      { key: 'is_active', label: 'Activo (1/0)', type: 'number' }
    ]
  }
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Bienvenido a OptiClass</h2>
          <p className="text-muted">Navega por el menú para gestionar las entidades base antes de generar horarios.</p>
        </div>
      );
    }
    
    if (currentView === 'generate') {
      return <ScheduleGrid />;
    }

    if (ENTITY_CONFIG[currentView]) {
      return <CrudView key={currentView} config={ENTITY_CONFIG[currentView]} />;
    }

    return (
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Sección No Encontrada</h2>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        <header className="topbar">
          <h1 style={{ textTransform: 'capitalize' }}>
            {currentView === 'generate' ? 'Generador de Horarios' : 
             (ENTITY_CONFIG[currentView] ? ENTITY_CONFIG[currentView].title : currentView)}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 35, height: 35, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              A
            </div>
            <span style={{ fontWeight: 500 }}>Administrador</span>
          </div>
        </header>
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
