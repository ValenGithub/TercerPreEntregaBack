export default class ProductDTO {
    constructor(product) {
        this._id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.code = product.code;
        this.ownerId = product.owner;  // Solo enviamos el ID del propietario
        this.stock = product.stock;
    }
}