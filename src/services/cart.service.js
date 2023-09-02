export default class cartService {

    constructor(dao) {
        this.dao = dao;
    }

    async agregarCarrito() {
        return this.dao.agregarCarrito({ products: [] })
    }

    async obtenerCarritos(){
        return this.dao.obtenerCarritos();
    }

    async obtenerCarritoById(cartId) {
        return await this.dao.obtenerCarritoById(cartId)
    }

    async agregarProductoCarrito(cid,pid) {
        return this.dao.agregarProductoCarrito(cid,pid);
    }

    async eliminarProductoDeCarrito(cartId, prodId) {
        return this.dao.eliminarProductoDeCarrito(cartId, prodId)
    }


    async actualizarArrayCarrito(cartId, nuevosProductos) {

        return this.dao.actualizarArrayCarrito(cartId, nuevosProductos);

    }

    async actualizarCantidadProductoCarrito(cartId, prodId, newQuantity) {
        return this.dao.actualizarCantidadProductoCarrito(cartId, prodId, newQuantity)

    }

    async vaciarCarrito(cartId) {
        return this.dao.vaciarCarrito(cartId);
    }


}