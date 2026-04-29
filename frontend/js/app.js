import { api } from './api.js';

// Estado global de la aplicación
const state = {
    currentView: 'dashboard',
    currentEntity: null, // 'teachers', 'courses', 'rooms'
    editingId: null
};

// Configuración de las entidades para renderizar tablas y formularios
const entitiesConfig = {
    teachers: {
        title: 'Profesores',
        singular: 'Profesor',
        columns: ['ID', 'Nombre', 'Email', 'Turnos'],
        renderRow: (item) => {
            let shifts = 'Todos';
            if (item.availability) {
                try {
                    let parsed = item.availability;
                    if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                    if (typeof parsed === 'string') parsed = JSON.parse(parsed); // Handle double encoding just in case
                    if (Array.isArray(parsed) && parsed.length > 0) shifts = parsed.join(', ');
                } catch(e) {}
            }
            return `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td><span class="badge" style="background:var(--primary-color); padding: 4px 8px; border-radius:12px; font-size: 12px; color: white;">${shifts}</span></td>
            `;
        },
        formHTML: `
            <div class="form-group">
                <label for="name">Nombre Completo</label>
                <input type="text" id="name" required placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" required placeholder="Ej: juan@universidad.edu">
            </div>
            <div class="form-group">
                <label>Disponibilidad de Turnos</label>
                <div style="display:flex; gap:15px; margin-top:8px;">
                    <label><input type="checkbox" class="shift-cb" value="Mañana" checked> Mañana</label>
                    <label><input type="checkbox" class="shift-cb" value="Tarde" checked> Tarde</label>
                    <label><input type="checkbox" class="shift-cb" value="Noche" checked> Noche</label>
                </div>
            </div>
        `,
        getFormData: () => {
            const shifts = Array.from(document.querySelectorAll('.shift-cb:checked')).map(cb => cb.value);
            return {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                availability: shifts
            };
        },
        setFormData: (item) => {
            document.getElementById('name').value = item.name;
            document.getElementById('email').value = item.email;
            
            document.querySelectorAll('.shift-cb').forEach(cb => cb.checked = false);
            
            if (item.availability) {
                try {
                    let shifts = item.availability;
                    if (typeof shifts === 'string') shifts = JSON.parse(shifts);
                    if (typeof shifts === 'string') shifts = JSON.parse(shifts);

                    if (Array.isArray(shifts)) {
                        shifts.forEach(s => {
                            const cb = document.querySelector(`.shift-cb[value="${s}"]`);
                            if(cb) cb.checked = true;
                        });
                    }
                } catch(e) {}
            }
        }
    },
    courses: {
        title: 'Materias',
        singular: 'Materia',
        columns: ['ID', 'Nombre', 'Créditos', 'Horas Semanales'],
        renderRow: (item) => `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.credits}</td>
            <td>${item.weekly_hours}</td>
        `,
        formHTML: `
            <div class="form-group">
                <label for="name">Nombre de la Materia</label>
                <input type="text" id="name" required placeholder="Ej: Cálculo I">
            </div>
            <div class="form-group">
                <label for="credits">Créditos</label>
                <input type="number" id="credits" required value="3" min="1">
            </div>
            <div class="form-group">
                <label for="weekly_hours">Horas Semanales</label>
                <input type="number" id="weekly_hours" required value="4" min="1">
            </div>
        `,
        getFormData: () => ({
            name: document.getElementById('name').value,
            credits: parseInt(document.getElementById('credits').value),
            weekly_hours: parseInt(document.getElementById('weekly_hours').value)
        }),
        setFormData: (item) => {
            document.getElementById('name').value = item.name;
            document.getElementById('credits').value = item.credits;
            document.getElementById('weekly_hours').value = item.weekly_hours;
        }
    },
    rooms: {
        title: 'Aulas',
        singular: 'Aula',
        columns: ['ID', 'Nombre', 'Capacidad', 'Tipo'],
        renderRow: (item) => `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.capacity} estudiantes</td>
            <td>${item.room_type === 'theory' ? 'Teoría' : 'Laboratorio'}</td>
        `,
        formHTML: `
            <div class="form-group">
                <label for="name">Nombre / Código de Aula</label>
                <input type="text" id="name" required placeholder="Ej: A-101">
            </div>
            <div class="form-group">
                <label for="capacity">Capacidad (Estudiantes)</label>
                <input type="number" id="capacity" required value="30" min="1">
            </div>
            <div class="form-group">
                <label for="room_type">Tipo de Aula</label>
                <select id="room_type">
                    <option value="theory">Teoría (Normal)</option>
                    <option value="lab">Laboratorio</option>
                </select>
            </div>
        `,
        getFormData: () => ({
            name: document.getElementById('name').value,
            capacity: parseInt(document.getElementById('capacity').value),
            room_type: document.getElementById('room_type').value
        }),
        setFormData: (item) => {
            document.getElementById('name').value = item.name;
            document.getElementById('capacity').value = item.capacity;
            document.getElementById('room_type').value = item.room_type;
        }
    },
    groups: {
        title: 'Grupos',
        singular: 'Grupo',
        columns: ['ID', 'Materia', 'Profesor', 'Cupo'],
        renderRow: (item) => `
            <td>${item.id}</td>
            <td>${item.course_name || `ID: ${item.course_id}`}</td>
            <td>${item.teacher_name || `ID: ${item.teacher_id}`}</td>
            <td>${item.quota} estudiantes</td>
        `,
        formHTML: `
            <div class="form-group">
                <label for="course_id">Materia</label>
                <select id="course_id" required>
                    <option value="">Cargando materias...</option>
                </select>
            </div>
            <div class="form-group">
                <label for="teacher_id">Profesor</label>
                <select id="teacher_id" required>
                    <option value="">Cargando profesores...</option>
                </select>
            </div>
            <div class="form-group">
                <label for="quota">Cupo (Estudiantes)</label>
                <input type="number" id="quota" required value="30">
            </div>
        `,
        getFormData: () => ({
            course_id: parseInt(document.getElementById('course_id').value),
            teacher_id: parseInt(document.getElementById('teacher_id').value),
            quota: parseInt(document.getElementById('quota').value)
        }),
        setFormData: (item) => {
            document.getElementById('course_id').value = item.course_id;
            document.getElementById('teacher_id').value = item.teacher_id;
            document.getElementById('quota').value = item.quota;
        }
    },
    terms: {
        title: 'Periodos Académicos',
        singular: 'Periodo',
        columns: ['ID', 'Nombre', 'Estado'],
        renderRow: (item) => `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.is_active ? '<span style="color:#10b981; font-weight:bold;">ACTIVO</span>' : 'Inactivo'}</td>
        `,
        formHTML: `
            <div class="form-group">
                <label for="name">Nombre del Periodo</label>
                <input type="text" id="name" required placeholder="Ej: Semestre 2026-I">
            </div>
            <div class="form-group">
                <label for="is_active">Estado</label>
                <select id="is_active">
                    <option value="0">Inactivo</option>
                    <option value="1">Activo (Predeterminado)</option>
                </select>
            </div>
            <p style="font-size: 12px; color: var(--text-muted);">* Si marcas como Activo, los demás se desactivarán automáticamente.</p>
        `,
        getFormData: () => ({
            name: document.getElementById('name').value,
            is_active: parseInt(document.getElementById('is_active').value)
        }),
        setFormData: (item) => {
            document.getElementById('name').value = item.name;
            document.getElementById('is_active').value = item.is_active ? 1 : 0;
        }
    }
};

// Cargar estado inicial
window.addEventListener('DOMContentLoaded', async () => {
    const termReq = await api.request('/terms/active', 'GET');
    const termName = termReq.success && termReq.data ? termReq.data.name : 'Ninguno';
    document.querySelector('.user-profile span').innerText = `Periodo Activo: ${termName}`;
});

// Elementos del DOM
const viewTitle = document.getElementById('view-title');
const contentArea = document.getElementById('content-area');
const modalOverlay = document.getElementById('crud-modal');
const modalTitle = document.getElementById('modal-title');
const crudForm = document.getElementById('crud-form');
const navLinks = document.querySelectorAll('.nav-links li');

// Navegación
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const view = e.currentTarget.dataset.view;
        state.currentView = view;
        
        if (view === 'dashboard' || view === 'generate') {
            renderStaticView(view);
        } else {
            state.currentEntity = view;
            renderEntityView(view);
        }
    });
});

function renderStaticView(view) {
    if (view === 'dashboard') {
        viewTitle.innerText = 'Panel Principal';
        contentArea.innerHTML = `
            <div class="welcome-card glass-panel">
                <h2>Bienvenido a OptiClass</h2>
                <p>Selecciona una opción del menú lateral para gestionar los datos base antes de generar horarios.</p>
            </div>
        `;
    } else if (view === 'generate') {
        viewTitle.innerText = 'Generador de Horarios';
        contentArea.innerHTML = `
            <div class="welcome-card glass-panel" style="margin-bottom: 20px;">
                <h2>Motor de Generación</h2>
                <p>Haz clic en el botón para ejecutar el algoritmo heurístico de asignación.</p>
                <br>
                <button class="btn btn-primary" id="btn-generate"><i class="fa-solid fa-play"></i> Iniciar Generación</button>
                <div id="generate-messages" style="margin-top:15px; color:var(--text-muted);"></div>
            </div>
            <div id="schedule-results" class="glass-panel" style="display:none; overflow-x: auto;">
                <h3 style="padding:20px; border-bottom:1px solid var(--border-color);">Horario Resultante</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Día</th>
                            <th>Hora</th>
                            <th>Materia</th>
                            <th>Profesor</th>
                            <th>Aula</th>
                        </tr>
                    </thead>
                    <tbody id="schedule-tbody">
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('btn-generate').addEventListener('click', async () => {
            const msgDiv = document.getElementById('generate-messages');
            msgDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando algoritmo...';
            
            const res = await api.request('/schedule/generate', 'POST');
            if(res.success) {
                msgDiv.innerHTML = `<span style="color: #10b981;">¡Generación exitosa! Se asignaron ${res.total_assigned} bloques.</span>`;
                loadSchedules();
            } else {
                msgDiv.innerHTML = `<span style="color: var(--danger);">Generación completada con advertencias.</span><br>
                                    <small>${res.errors.join('<br>')}</small>`;
                loadSchedules();
            }
        });

        // Cargar horarios al entrar a la vista si existen
        loadSchedules();
    }
}

async function loadSchedules() {
    const res = await api.request('/schedule/all', 'GET');
    const tbody = document.getElementById('schedule-tbody');
    const container = document.getElementById('schedule-results');
    
    if (res.success && res.data.length > 0) {
        container.style.display = 'block';
        let html = '';
        
        // Consolidar bloques continuos
        const consolidated = [];
        res.data.forEach(s => {
            // Buscar si ya existe un bloque de la misma materia y día donde start_time encaje con el end_time actual
            const existing = consolidated.find(c => c.group_id === s.group_id && c.day_of_week === s.day_of_week && c.end_time === s.start_time);
            if (existing) {
                existing.end_time = s.end_time; // Extender el bloque
            } else {
                consolidated.push({...s});
            }
        });

        // Ordenar el arreglo consolidado (Día, Hora)
        const daysOrder = { 'Lunes': 1, 'Martes': 2, 'Miercoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sabado': 6 };
        consolidated.sort((a, b) => {
            if (daysOrder[a.day_of_week] !== daysOrder[b.day_of_week]) {
                return daysOrder[a.day_of_week] - daysOrder[b.day_of_week];
            }
            return a.start_time.localeCompare(b.start_time);
        });

        consolidated.forEach(s => {
            html += `
                <tr>
                    <td style="font-weight:600; color:var(--primary-color)">${s.day_of_week}</td>
                    <td>${s.start_time.substring(0,5)} - ${s.end_time.substring(0,5)}</td>
                    <td>${s.course_name}</td>
                    <td>${s.teacher_name}</td>
                    <td>${s.room_name}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } else {
        container.style.display = 'none';
    }
}

// Renderizar Vista CRUD (Tabla)
async function renderEntityView(entityKey) {
    const config = entitiesConfig[entityKey];
    viewTitle.innerText = config.title;
    
    // Skeleton Loader / Cargando
    contentArea.innerHTML = `<p style="color:var(--text-muted)">Cargando ${config.title.toLowerCase()}...</p>`;

    const response = await api.getAll(entityKey);
    
    let html = `
        <div class="view-header">
            <h3>Gestión de ${config.title}</h3>
            <button class="btn btn-primary" onclick="window.openModal()"><i class="fa-solid fa-plus"></i> Agregar ${config.singular}</button>
        </div>
        <div class="glass-panel" style="overflow-x: auto;">
            <table class="data-table">
                <thead>
                    <tr>
                        ${config.columns.map(col => `<th>${col}</th>`).join('')}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    if (response.success && response.data.length > 0) {
        response.data.forEach(item => {
            html += `
                <tr>
                    ${config.renderRow(item)}
                    <td>
                        <div class="action-btns">
                            <button onclick='window.editItem(${JSON.stringify(item).replace(/'/g, "&#39;")})'><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="delete-btn" onclick="window.deleteItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } else {
        html += `<tr><td colspan="${config.columns.length + 1}" class="empty-state">No hay registros de ${config.title.toLowerCase()}.</td></tr>`;
    }

    html += `</tbody></table></div>`;
    contentArea.innerHTML = html;
}

// Funciones del Modal Expuestas a Window
window.openModal = async (item = null) => {
    const config = entitiesConfig[state.currentEntity];
    crudForm.innerHTML = config.formHTML;
    
    if (state.currentEntity === 'groups') {
        // Cargar listas dinámicas
        const coursesReq = await api.getAll('courses');
        const teachersReq = await api.getAll('teachers');
        
        const courseSelect = document.getElementById('course_id');
        const teacherSelect = document.getElementById('teacher_id');
        
        if(coursesReq.success) {
            courseSelect.innerHTML = coursesReq.data.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
        if(teachersReq.success) {
            teacherSelect.innerHTML = teachersReq.data.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }
    }

    if (item) {
        state.editingId = item.id;
        modalTitle.innerText = `Editar ${config.singular}`;
        config.setFormData(item);
    } else {
        state.editingId = null;
        modalTitle.innerText = `Nuevo ${config.singular}`;
    }
    
    modalOverlay.classList.add('active');
};

document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('cancel-modal').addEventListener('click', closeModal);

function closeModal() {
    modalOverlay.classList.remove('active');
    crudForm.reset();
    state.editingId = null;
}

// Enviar Formulario (Crear/Editar)
crudForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const config = entitiesConfig[state.currentEntity];
    const data = config.getFormData();
    
    let res;
    if (state.editingId) {
        res = await api.update(state.currentEntity, state.editingId, data);
    } else {
        res = await api.create(state.currentEntity, data);
    }

    if (res.success) {
        closeModal();
        renderEntityView(state.currentEntity);
    } else {
        alert("Error: " + (res.message || "Ocurrió un error inesperado"));
    }
});

// Editar Elemento
window.editItem = (item) => {
    window.openModal(item);
};

// Eliminar Elemento
window.deleteItem = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        const res = await api.delete(state.currentEntity, id);
        if (res.success) {
            renderEntityView(state.currentEntity);
        } else {
            alert("Error al eliminar.");
        }
    }
};
