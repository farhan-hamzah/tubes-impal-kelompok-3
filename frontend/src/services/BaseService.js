import API from '../api/axios';

/**
 * BaseService — OOP base class for all service modules.
 * Provides CRUD helpers with centralized error handling.
 */
export default class BaseService {
    constructor(basePath = '') {
        this.basePath = basePath;
        this.api = API;
    }

    async get(url = '') {
        try {
            const res = await this.api.get(`${this.basePath}${url}`);
            return res.data;
        } catch (err) {
            this._handleError(err);
        }
    }

    async post(url = '', data = {}) {
        try {
            const res = await this.api.post(`${this.basePath}${url}`, data);
            return res.data;
        } catch (err) {
            this._handleError(err);
        }
    }

    async put(url = '', data = {}) {
        try {
            const res = await this.api.put(`${this.basePath}${url}`, data);
            return res.data;
        } catch (err) {
            this._handleError(err);
        }
    }

    async delete(url = '') {
        try {
            const res = await this.api.delete(`${this.basePath}${url}`);
            return res.data;
        } catch (err) {
            this._handleError(err);
        }
    }

    _handleError(err) {
        const msg = err.response?.data?.message
            || err.response?.data
            || err.message
            || 'Terjadi kesalahan pada server';
        throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
}
