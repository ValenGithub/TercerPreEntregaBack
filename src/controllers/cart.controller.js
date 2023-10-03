import cartService from "../services/cart.service.js";
import cartDao from "../dao/cart.dao.js";
import CartDTO from "../dto/cart.dto.js"


class CartController {
    constructor() {
        this.service = new cartService(cartDao);
    }

    async agregarCarrito() {
        return this.service.agregarCarrito({ products: [] })
    }

    async obtenerCarritos(){
        const carts = await this.service.obtenerCarritos();
        return carts.map(cart => new CartDTO(cart));
    }

    async obtenerCarritoById(cartId) {
        const cart = await this.service.obtenerCarritoById(cartId);
        return new CartDTO(cart);
    }

    async agregarProductoCarrito(cid,pid) {
        return this.service.agregarProductoCarrito(cid,pid);
    }

    async eliminarProductoDeCarrito(cartId, prodId) {
        return this.service.eliminarProductoDeCarrito(cartId, prodId)
    }


    async actualizarArrayCarrito(cartId, nuevosProductos) {

        return this.service.actualizarArrayCarrito(cartId, nuevosProductos);

    }

    async actualizarCantidadProductoCarrito(cartId, prodId, newQuantity) {
        return this.service.actualizarCantidadProductoCarrito(cartId, prodId, newQuantity)

    }

    async vaciarCarrito(cartId) {
        return this.service.vaciarCarrito(cartId);
    }
}

const cartController = new CartController;
export default cartController;