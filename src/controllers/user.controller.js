import UserService from "../services/user.service.js";
import userDao from "../dao/user.dao.js";


class UserController {
    constructor() {
        this.service = new UserService(userDao);
    }

    async getAll() {
        try {
            const userList = await this.service.getAll();
            console.log(userList); // Agrega este console.log para verificar la lista de usuarios
            res.render('adminUsers', { userList });
        } catch (error) {
            // Maneja errores si ocurren durante la obtención de la lista de usuarios
            next(error);
        }
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
            // Verifica si el usuario actual es un administrador (debes implementar esta lógica)
            const isAdmin = req.user && req.user.rol === 'admin'; // Asegúrate de implementar esta lógica

            if (!isAdmin) {
                throw new Error('Acceso no autorizado'); // Puedes personalizar el mensaje de error
            }

            // Cambia el rol del usuario utilizando el modelo de usuario y el ID proporcionado
            await userModel.updateOne({ _id: userId }, { rol: newRole });

            // Devuelve un mensaje de éxito o realiza cualquier otra acción necesaria
            return 'Rol cambiado con éxito';
        } catch (error) {
            // Maneja errores si ocurren durante el cambio de rol
            throw error;
        }
    }


}



const userController = new UserController;

export default userController;