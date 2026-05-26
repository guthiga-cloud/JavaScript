// 6. userAuth.js - User authentication system
const crypto = require('crypto');

class UserAuth {
    constructor() {
        this.users = new Map(); // email -> user data
        this.sessions = new Map(); // token -> email
    }

    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return { salt, hash };
    }

    verifyPassword(password, salt, hash) {
        const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === verifyHash;
    }

    registerUser(email, password, username) {
        if (this.users.has(email)) {
            throw new Error("User already exists");
        }

        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        const { salt, hash } = this.hashPassword(password);
        
        const user = {
            email,
            username,
            passwordHash: hash,
            passwordSalt: salt,
            createdAt: new Date(),
            lastLogin: null,
            isActive: true
        };
        
        this.users.set(email, user);
        return { email, username, createdAt: user.createdAt };
    }

    login(email, password) {
        const user = this.users.get(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.isActive) {
            throw new Error("Account is deactivated");
        }

        const isValid = this.verifyPassword(password, user.passwordSalt, user.passwordHash);
        if (!isValid) {
            throw new Error("Invalid password");
        }

        // Generate session token
        const token = crypto.randomBytes(32).toString('hex');
        user.lastLogin = new Date();
        this.sessions.set(token, email);
        
        return { token, user: { email: user.email, username: user.username } };
    }

    logout(token) {
        return this.sessions.delete(token);
    }

    validateSession(token) {
        return this.sessions.has(token);
    }

    getUserByEmail(email) {
        const user = this.users.get(email);
        if (!user) return null;
        
        // Return user data without sensitive information
        return {
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            isActive: user.isActive
        };
    }

    deactivateUser(email) {
        const user = this.users.get(email);
        if (user) {
            user.isActive = false;
            return true;
        }
        return false;
    }
}

module.exports = UserAuth;
