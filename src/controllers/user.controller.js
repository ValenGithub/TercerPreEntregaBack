import UserService from "../services/user.service.js";
import userDao from "../dao/user.dao.js";
import { logger } from "../middlewares/logger.middleware.js";

class UserController {
    constructor() {
        this.service = new UserService(userDao);
        this.changeUserRole = this.changeUserRole.bind(this);
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
    async changeUserRole(req, res, next) {
        const userId = req.params.uid;
        const desiredAction = req.body.userAction;
    
        try {
            const user = await this.service.getUserById(userId); 
            
            if (!user) {
                logger.error(`User with ID ${userId} not found.`);
                return res.status(404).json({ error: 'User not found.' });
            }
    
            switch (desiredAction) {
                case 'PREMIUM':
                    user.rol = 'PREMIUM';
                    break;
                case 'usuario':
                    user.rol = 'usuario';
                    break;
                default:
                    logger.error(`Invalid action: ${desiredAction}`);
                    return res.status(400).json({ error: 'Invalid action.' });
            }
    
            await user.save();;
    
            logger.info(`User role changed. ID: ${userId}, New role: ${user.rol}`);
    
           
            res.redirect('/adminchange');
    
        } catch (error) {
            logger.error(`Error changing user role: ${error.message}`);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}



const userController = new UserController;

export default userController;