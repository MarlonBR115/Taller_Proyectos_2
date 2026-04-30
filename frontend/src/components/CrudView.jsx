import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const CrudView = ({ config }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    fetchData();
  }, [config.endpoint]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${config.endpoint}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const result = await res.json();
      // Handle array or wrapped response
      setData(Array.isArray(result) ? result : (result.data || []));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    try {
      await fetch(`${API_BASE}/${config.endpoint}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    
    // Initialize form data
    const initialData = {};
    config.columns.forEach(col => {
      if (col.key !== 'id') {
        if (item) {
          // Handle JSON arrays for checkboxes
          if (col.type === 'checkboxes' && typeof item[col.key] === 'string') {
            try {
              let parsed = JSON.parse(item[col.key]);
              if (typeof parsed === 'string') parsed = JSON.parse(parsed);
              initialData[col.key] = parsed || [];
            } catch { initialData[col.key] = []; }
          } else {
            initialData[col.key] = item[col.key] || '';
          }
        } else {
          initialData[col.key] = col.type === 'checkboxes' ? [] : '';
        }
      }
    });
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleInputChange = (e, col) => {
    if (col.type === 'checkboxes') {
      const value = e.target.value;
      const currentArr = formData[col.key] || [];
      const newArr = e.target.checked 
        ? [...currentArr, value]
        : currentArr.filter(v => v !== value);
      setFormData({ ...formData, [col.key]: newArr });
    } else {
      setFormData({ ...formData, [col.key]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format payload
    const payload = { ...formData };
    config.columns.forEach(col => {
      if (col.type === 'checkboxes') {
        payload[col.key] = JSON.stringify(payload[col.key]); // Backend expects JSON string
      }
    });

    const url = editingItem 
      ? `${API_BASE}/${config.endpoint}/${editingItem.id}` 
      : `${API_BASE}/${config.endpoint}`;
    
    const method = editingItem ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const renderCellValue = (item, col) => {
    let val = item[col.key];
    if (col.type === 'checkboxes') {
      try {
        let parsed = val;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) return parsed.join(', ');
      } catch {}
      return val;
    }
    return val;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Gestión de {config.title}</h2>
        <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Añadir {config.singular}
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'auto', padding: '1px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando datos...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                {config.columns.map(col => (
                  <th key={col.key} style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{col.label}</th>
                ))}
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {config.columns.map(col => (
                    <td key={col.key} style={{ padding: '1rem' }}>
                      {renderCellValue(item, col)}
                    </td>
                  ))}
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '1rem' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Editar' : 'Añadir'} {config.singular}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {config.columns.filter(c => c.key !== 'id').map(col => (
                <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }}>{col.label}</label>
                  
                  {col.type === 'checkboxes' ? (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      {col.options.map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            value={opt}
                            checked={(formData[col.key] || []).includes(opt)}
                            onChange={(e) => handleInputChange(e, col)}
                          /> {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input 
                      type={col.type || 'text'}
                      value={formData[col.key] || ''}
                      onChange={(e) => handleInputChange(e, col)}
                      required
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}
                    />
                  )}
                </div>
              ))}
              
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)} style={{ background: '#f3f4f6' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudView;
