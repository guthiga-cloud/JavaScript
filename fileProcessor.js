// 7. fileProcessor.js - File handling and processing
const fs = require('fs').promises;
const path = require('path');

class FileProcessor {
    constructor(baseDir = './data') {
        this.baseDir = baseDir;
    }

    async ensureDir() {
        try {
            await fs.access(this.baseDir);
        } catch {
            await fs.mkdir(this.baseDir, { recursive: true });
        }
    }

    async writeFile(filename, content) {
        await this.ensureDir();
        const filePath = path.join(this.baseDir, filename);
        await fs.writeFile(filePath, content, 'utf8');
        return { success: true, path: filePath };
    }

    async readFile(filename) {
        const filePath = path.join(this.baseDir, filename);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return { success: true, content, path: filePath };
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }

    async appendToFile(filename, content) {
        const filePath = path.join(this.baseDir, filename);
        await fs.appendFile(filePath, content, 'utf8');
        return { success: true, path: filePath };
    }

    async deleteFile(filename) {
        const filePath = path.join(this.baseDir, filename);
        try {
            await fs.unlink(filePath);
            return { success: true, path: filePath };
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    async listFiles() {
        await this.ensureDir();
        const files = await fs.readdir(this.baseDir);
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                const stats = await fs.stat(path.join(this.baseDir, file));
                return {
                    name: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            })
        );
        return fileDetails;
    }

    async fileExists(filename) {
        const filePath = path.join(this.baseDir, filename);
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async copyFile(source, destination) {
        const sourcePath = path.join(this.baseDir, source);
        const destPath = path.join(this.baseDir, destination);
        await fs.copyFile(sourcePath, destPath);
        return { success: true, source: sourcePath, destination: destPath };
    }
}

module.exports = FileProcessor;
