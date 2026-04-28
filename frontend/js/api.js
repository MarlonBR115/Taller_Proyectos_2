// Wrapper para las llamadas a la API
const API_BASE_URL = 'http://localhost/Generador_horarios/backend/public/api';

export const api = {
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(`Error en API Request a ${endpoint}:`, error);
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    },

    // Métodos Genéricos CRUD
    async getAll(entity) {
        return this.request(`/${entity}`);
    },

    async create(entity, data) {
        return this.request(`/${entity}`, 'POST', data);
    },

    async update(entity, id, data) {
        return this.request(`/${entity}/${id}`, 'PUT', data);
    },

    async delete(entity, id) {
        return this.request(`/${entity}/${id}`, 'DELETE');
    }
};
