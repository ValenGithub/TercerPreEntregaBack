import fs from 'fs';
import ProductManager from './ProductManager.js';

export default class CartManager{

    productManager = new ProductManager("products.json");

    constructor() {
      this.path = 'carts.json';
      try {
        const cartsData = fs.readFileSync(this.path, 'utf-8');
        this.cartProducts = JSON.parse(cartsData);
        this.id = this.cartProducts.length;
      } catch (err) {
        console.log('No se pudieron cargar los carritos desde el archivo JSON.');
        this.cartProducts = [];
        this.id = 0;
      }
    }

      async getCarts(){
          try{
              const carritoActual = await fs.promises.readFile(this.path, 'utf-8')
              console.log(carritoActual);
              return JSON.parse(carritoActual);       
          }
          catch(err){
              console.log('No hay carritos para mostrar')
          }
      }

      async createCart() {
          const nuevoCarrito = {
            id: this.id ++,
            productos: []
          };
          this.cartProducts.push(nuevoCarrito);
          await fs.promises.writeFile(this.path, JSON.stringify(this.cartProducts));
          console.log("Carrito creado con éxito");
          return this.cartProducts[this.cartProducts.length - 1];
      }

      async getCartProducts(idCarrito) {
          try {
            const carritos = await this.getCarts();
            const carritoEncontrado = carritos.find(carrito => carrito.id === idCarrito);
            //console.log(carritoEncontrado)
        
            if (!carritoEncontrado) {
              console.log(`No se encontró ningún carrito con ID ${idCarrito}`);
              return [];
            }
        
            const productosEnCarrito = carritoEncontrado.productos;
        
            return {productosEnCarrito};
          } catch (err) {
            console.log(`Error al obtener los productos del carrito con ID ${idCarrito}:`, err);
          return [];
      }
    }

  
  async addProductCart(cartId, productId) {
    let productos = await this.productManager.getProducts();
    let productoBuscado = productos.find(producto => producto.id === productId);
    let idProductoBuscado = productoBuscado.id
    let cantidad = 1; 
    let carts = await this.getCarts();
    let cartIndex = carts.findIndex(cart => cart.id === cartId);
    let productIndex = carts[cartIndex].productos.findIndex((p) => p.product === idProductoBuscado);
  
    // Validar que se encontró el producto
    if (!productoBuscado) {
      console.log(`No se encontró ningún producto con el ID ${productId}`);
      return null;
    }
  
    // Validar que se encontró el carrito
    if (cartIndex === -1) {
      console.log(`No se encontró el carrito con el ID ${cartId}`);
      return null;
    }
  
    try{
      if (productIndex === -1) {
        // Si no se encuentra el producto en el carrito, se agrega uno nuevo con cantidad 1
        carts[cartIndex].productos.push({ product: idProductoBuscado, quantity: cantidad });
      } else {
        // Si se encuentra el producto en el carrito, se actualiza su cantidad sumando 1
        carts[cartIndex].productos[productIndex].quantity += 1;
      }
    
      // Guardar los cambios en el archivo
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return carts[cartIndex]
    }catch(err){
      console.log('No se pudo agregar el producto')
    }
  }






}
//const carts = new CartManager();

const prueba = async () => {
    try{
        await carts.createCart()
        await carts.createCart()
        await carts.addProductCart(1,5)
        await carts.addProductCart(1,5)
        await carts.addProductCart(0,2)
        await carts.addProductCart(0,2)
        await carts.addProductCart(1,7)
        console.log(await carts.getCartProducts(1));
    }
    catch (err){
        console.log('La prueba salio mal')
    }
}

//prueba()

