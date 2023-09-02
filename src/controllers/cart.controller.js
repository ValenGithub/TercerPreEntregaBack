import cartService from "../services/cart.service.js";
import cartDao from "../dao/cart.dao.js";


class CartController {
    constructor() {
        this.service = new cartService(cartDao);
    }

    async agregarCarrito() {
        return this.service.agregarCarrito({ products: [] })
    }

    async obtenerCarritos(){
        return this.service.obtenerCarritos();
    }

    async obtenerCarritoById(cartId) {
        return await this.service.obtenerCarritoById(cartId)
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