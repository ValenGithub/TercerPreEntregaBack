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
		console.log("Intentando crear usuario con datos:", userData);
		try {
			const newUser = await this.model.create(userData);
			console.log("Usuario creado exitosamente:", newUser);
			return newUser;
		} catch (error) {
			console.error("Error creando usuario:", error);
		}
	}

	async getUserById(id) {
		return await this.model.findById(id);
	}
}

const userDao = new UserDao();
export default userDao;
