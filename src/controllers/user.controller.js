import UserService from "../services/user.service.js";
import userDao from "../dao/user.dao.js";
import userModel from '../models/user.model.js';


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
    async changeUserRole(userId, newRole) {
        try {
            // Encuentra el usuario por su ID y actualiza el rol
            const updatedUser = await userModel.findByIdAndUpdate(userId, { rol: newRole }, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }


}



const userController = new UserController;

export default userController;