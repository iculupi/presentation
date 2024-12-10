// Example code with common issues for analysis
export class UserService {
    private users: any[] = [];

    async createUser(data: any) {
        try {
            // No input validation
            const user = {
                id: Math.random().toString(),
                ...data,
                createdAt: new Date()
            };
            
            this.users.push(user);
            return user;
        } catch(e) {
            console.log('Error:', e);
        }
    }

    async getUser(id: string) {
        // Unsafe comparison
        return this.users.find(u => u.id == id);
    }

    async updateUser(id: string, data: any) {
        const index = this.users.findIndex(u => u.id == id);
        if(index >= 0) {
            // Overwriting entire object without validation
            this.users[index] = { ...this.users[index], ...data };
            return this.users[index];
        }
    }

    deleteUser(id) { // Missing parameter type
        const index = this.users.findIndex(u => u.id == id);
        if(index >= 0) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
} 