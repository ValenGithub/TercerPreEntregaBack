import UserService from "../services/user.service.js";
import userDao from "../dao/user.dao.js";


class UserController {
    constructor() {
        this.service = new UserService(userDao);
    }

    async getAll() {
        return await this.service.getAll();
    }

    async getByEmail(email) {
        return await this.service.getByEmail(email);
    }

    async createUser(userData) {
        return await this.service.createUser(userData);
    }

    async getUserById(id) {
        return await this.service.getUserById(id);
    }

}

const userController = new UserController;

export default userController;