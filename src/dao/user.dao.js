import { logger } from '../middlewares/logger.middleware.js';
import userModel from '../models/user.model.js'

class UserDao {
	constructor() {
		this.model = userModel;
		
	}

	async getAll() {
		return await this.model.find().lean();
	}

	async getByEmail(email) {
		return await this.model.findOne({ email: email });
	}

	async createUser(userData) {
		logger.info("Intentando crear usuario con datos:", userData);
		try {
			const newUser = await this.model.create(userData);
			logger.info("Usuario creado exitosamente:", newUser);
			return newUser;
		} catch (error) {
			logger.error("Error creando usuario:", error);
		}
	}

	async getUserById(id) {
		return await this.model.findById(id);
	}
	async deleteUserById(id) {
		try {
			const result = await this.model.findByIdAndDelete(id);
			return result;
		} catch (error) {
			logger.error("Error eliminando usuario:", error);
			throw error;  // Re-lanza el error para que pueda ser manejado por capas superiores.
		}
	}
}

const userDao = new UserDao();
export default userDao;
