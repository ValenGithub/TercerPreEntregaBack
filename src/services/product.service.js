export default class ProductService {
    constructor(dao) {
      this.dao = dao;
    }
  
    agregarProducto(product) {
      return this.dao.agregarProducto(product)
    }

    obtenerProductos(){
        return this.dao.obtenerProductos()
    }
  
    async obtenerProductosPaginados(limit, page , sort , query) {
      const result = await this.dao.obtenerProductosPaginados(limit, page , sort, query );
      return result;
    }
  
  
    actualizarProducto(pid, product) {
      return this.dao.actualizarProducto(pid, product);
    }
  
    obtenerProductoById(prodId) {
      return this.dao.obtenerProductoById(prodId)
    }
  
  
    eliminarProducto(pid) {
      return this.dao.eliminarProducto(pid);
    }
  
  }