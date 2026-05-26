// 2. todoList.js - Task management system
class TodoList {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    addTask(title, description = "") {
        const task = {
            id: this.nextId++,
            title: title,
            description: description,
            completed: false,
            createdAt: new Date(),
            completedAt: null
        };
        this.tasks.push(task);
        return task;
    }

    removeTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        }
        return false;
    }

    completeTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task && !task.completed) {
            task.completed = true;
            task.completedAt = new Date();
            return true;
        }
        return false;
    }

    getPendingTasks() {
        return this.tasks.filter(task => !task.completed);
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.completed);
    }

    getAllTasks() {
        return this.tasks;
    }

    searchTasks(keyword) {
        return this.tasks.filter(task => 
            task.title.toLowerCase().includes(keyword.toLowerCase()) ||
            task.description.toLowerCase().includes(keyword.toLowerCase())
        );
    }
}

module.exports = TodoList;
