export default class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        try {
            const userList = await this.dao.getAll();
            console.log(userList); // Agrega este console.log para verificar la lista de usuarios en el servicio
            return userList;
        } catch (error) {
            throw error;
        }
    }

    getByEmail(email) {
        return this.dao.getByEmail(email);
    }

    createUser(userData) {
        return this.dao.createUser(userData);
    }

    getUserById(id) {
        return this.dao.getUserById(id);
    }

}