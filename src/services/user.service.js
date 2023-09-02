export default class UserService {
    constructor(dao) {
        this.dao = dao;
    }

    getAll() {
        return this.dao.getAll();
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