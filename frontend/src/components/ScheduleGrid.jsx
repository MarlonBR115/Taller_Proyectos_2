import React, { useState, useMemo, useEffect } from 'react';
import { Play, Filter, X } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
const START_HOUR = 8;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

// Función auxiliar para generar un color a partir de un string
const stringToColor = (str) => {
  if (!str) return '#ccc';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 65%)`;
};

const API_BASE = 'http://localhost:3000/api';

const ScheduleGrid = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('course'); // 'course', 'teacher', 'room'
  const [filterValue, setFilterValue] = useState('');
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch(`${API_BASE}/schedule/all`);
      const data = await res.json();
      if (data.success) {
        // Parse time from "08:00:00" to 8
        const formatted = data.data.map(s => ({
          ...s,
          day: s.day_of_week,
          start_time: parseInt(s.start_time.split(':')[0]),
          end_time: parseInt(s.end_time.split(':')[0])
        }));
        setSchedules(formatted);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/schedule/generate`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message || 'Horario generado exitosamente.');
        fetchSchedules(); // Refrescar grid
      } else {
        alert('Error: ' + data.message + '\n' + (data.errors ? data.errors.join('\n') : ''));
      }
    } catch (err) {
      alert('Error de conexión con el backend.');
    } finally {
      setLoading(false);
    }
  };

  // Opciones únicas para el dropdown de filtro
  const filterOptions = useMemo(() => {
    const options = new Set();
    schedules.forEach(s => {
      if (filterType === 'course') options.add(s.course_name);
      if (filterType === 'teacher') options.add(s.teacher_name);
      if (filterType === 'room') options.add(s.room_name);
    });
    const opts = Array.from(options).filter(Boolean);
    if (!opts.includes(filterValue) && opts.length > 0) setFilterValue(opts[0]);
    return opts;
  }, [schedules, filterType]);

  // Bloques filtrados para mostrar en el grid
  const visibleSchedules = useMemo(() => {
    return schedules.filter(s => {
      if (filterType === 'course') return s.course_name === filterValue;
      if (filterType === 'teacher') return s.teacher_name === filterValue;
      if (filterType === 'room') return s.room_name === filterValue;
      return true;
    });
  }, [schedules, filterType, filterValue]);

  return (
    <div className="schedule-container">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Motor de Generación CSP</h2>
            <p className="text-muted">Visualiza e interactúa con el horario real desde la Base de Datos.</p>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {loading ? <div className="spinner" style={{width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div> : <Play size={18} />}
            {loading ? 'Generando...' : 'Generar Horario'}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="filters-bar">
          <Filter size={18} color="var(--text-muted)" />
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="course">Filtrar por Materia</option>
            <option value="teacher">Filtrar por Profesor</option>
            <option value="room">Filtrar por Aula</option>
          </select>
          
          <select 
            className="filter-select"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            {filterOptions.length === 0 ? <option>No hay datos</option> : filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="grid-wrapper">
          <div className="schedule-grid">
            {/* Header: Días */}
            <div className="grid-header">
              <div className="grid-header-cell" style={{ zIndex: 3 }}>Hora</div>
              {DAYS.map(day => (
                <div key={day} className="grid-header-cell">{day}</div>
              ))}
            </div>

            {/* Body: Horas y Celdas */}
            {HOURS.map(hour => (
              <React.Fragment key={`row-${hour}`}>
                <div className="grid-time-column">{`${hour}:00`}</div>
                {DAYS.map(day => {
                  // Buscar si hay una clase en este bloque exacto (hora de inicio)
                  const block = visibleSchedules.find(s => s.day === day && s.start_time === hour);
                  
                  return (
                    <div key={`${day}-${hour}`} className="grid-cell">
                      {block && (
                        <div 
                          className="schedule-block"
                          style={{ 
                            height: `calc(${block.end_time - block.start_time} * 100% + ${(block.end_time - block.start_time - 1)} * 8px)`,
                            position: 'absolute',
                            top: 4, left: 4, right: 4,
                            zIndex: 2,
                            backgroundColor: stringToColor(block.course_name)
                          }}
                          onClick={() => setSelectedBlock(block)}
                        >
                          <div className="block-title">{block.course_name}</div>
                          <div className="block-subtitle">{filterType !== 'teacher' ? block.teacher_name : block.room_name}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {selectedBlock && (
        <div className="modal-overlay" onClick={() => setSelectedBlock(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles de la Clase</h3>
              <button className="close-btn" onClick={() => setSelectedBlock(null)}><X size={20}/></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Materia</label>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{selectedBlock.course_name}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Profesor</label>
                  <div>{selectedBlock.teacher_name}</div>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aula</label>
                  <div>{selectedBlock.room_name}</div>
                </div>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Horario</label>
                  <div>{selectedBlock.day}, {selectedBlock.start_time}:00 - {selectedBlock.end_time}:00</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setSelectedBlock(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;
