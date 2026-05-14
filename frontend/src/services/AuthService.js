import BaseService from './BaseService';

/**
 * AuthService — handles authentication-related API calls.
 * Extends BaseService to use the shared Axios instance and error handling.
 */
class AuthService extends BaseService {
    constructor() {
        super('/auth');
    }

    /**
     * Log in with email and password.
     * @param {{ email: string, password: string }} data
     */
    async login(data) {
        return this.post('/login', data);
    }

    /**
     * Register a new client account.
     * @param {{ nama: string, email: string, password: string, nomorTelepon: string }} data
     */
    async register(data) {
        return this.post('/register', data);
    }

    /**
     * Request a password-reset email.
     * @param {string} email
     */
    async forgotPassword(email) {
        return this.post('/forgot-password', { email });
    }

    /**
     * Complete a password reset using the one-time token.
     * @param {{ token: string, passwordBaru: string }} data
     */
    async resetPassword(data) {
        return this.post('/reset-password', data);
    }
}

export const authService = new AuthService();
