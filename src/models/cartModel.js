import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
	products: {
	  type: [
		{
		  product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'products',
		  },
		  quantity: Number
		},
	  ],
	  required: false,
	  default: [],
	},
  });

export const cartModel = mongoose.model('carts', cartSchema);