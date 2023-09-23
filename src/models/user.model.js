import mongoose from 'mongoose';
import validator from 'validator';  // Asegúrate de instalar esto: npm install validator

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    last_name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email no válido');
            }
        },
        index: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    cart: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        ],
        default: [],
    },
    rol: {
        type: String,
        default: 'usuario',
    },
    img: String,
});

const userModel = mongoose.model('users', userSchema);
export default userModel;