import userModel from '../models/user.model.js'

class UserDao {
	constructor() {
		this.model = userModel;
		
	}

	async getAll() {
		return await this.model.find();
	}

	async getByEmail(email) {
		return await this.model.findOne({ email: email });
	}

	async createUser(userData) {
		return await this.model.create(userData);
	}

	async getUserById(id) {
		return await this.model.findById(id);
	}
}

const userDao = new UserDao();
export default userDao;
