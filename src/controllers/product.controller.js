import ProductService from "../services/product.service.js";
import productDao from "../dao/product.dao.js";


class ProductController {
    constructor() {
        this.service = new ProductService(productDao);
    }

    agregarProducto(product) {
        return this.service.agregarProducto(product)
    }

    obtenerProductos(){
        return this.service.obtenerProductos()
    }

    async obtenerProductosPaginados(limit, page, sort, query) {
        const resulta = await this.service.obtenerProductosPaginados(limit, page, sort, query)
        return resulta;
    }


    actualizarProducto(pid, product) {
        return this.service.actualizarProducto(pid, product);
    }

    obtenerProductoById(prodId) {
        return this.service.obtenerProductoById(prodId)
    }


    eliminarProducto(pid) {
        return this.service.eliminarProducto(pid);
    }

}



const productController = new ProductController;
export default productController;