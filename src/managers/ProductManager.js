/*import fs from 'fs';
import { Server } from "socket.io";


export default class ProductManager {
       
    
    constructor(path, io){          //funcion constructora donde se almacenaran los productos
        this.id = 0;
        this.path = path
        this.io = io;
        
        if(!fs.existsSync(this.path)){
            fs.promises.writeFile(this.path, JSON.stringify([]))
        }              
    }

    
   
    async getProducts() {  
        try{
            const productosActuales = await fs.promises.readFile(this.path, 'utf-8')
            //console.log(productosActuales)
            return JSON.parse(productosActuales);       
        }
        catch(err){
            console.log('No hay productos para mostrar')
        }              //funcion para mostrar array de productos
        
    }
    
    
    async addProduct(product) {  //funcion para agregar productos al array con parametros
        
        try{
            const productosActuales = await this.getProducts()
            let newId = 0;
            if (productosActuales.length > 0) {
              const lastProduct = productosActuales[productosActuales.length - 1];
              newId = lastProduct.id + 1;
            }
            const newProduct = { ...product, id: newId }
            productosActuales.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(productosActuales))

            
           
        } 
        catch(err){
            console.log('No se pudo agregar el producto')
        }

    }

    
  

    async getProductById(id){                 //funcion para obtener el producto mediante el id por parametro
        
        let productosActuales = await this.getProducts();
        for (let i = 0 ; i < productosActuales.length; i++){
            if (productosActuales[i].id === id){
                return productosActuales[i]
            }    
        }
        console.log("No tenemos productos con ese id");
        return null;
       
    }

    async updateProduct(id, camposParaReemplazar) {
        const productosActuales = await this.getProducts();
        const productIndex = productosActuales.findIndex((product) => product.id === id);
      
        if (productIndex <= -1) {
          console.log("No se encontró el producto con ese id");
          return null;
        }
      
        productosActuales[productIndex] = {
          ...productosActuales[productIndex],
          ...camposParaReemplazar,
        };
      
        await fs.promises.writeFile(
            this.path,
          JSON.stringify(productosActuales)
        );

        return productosActuales[productIndex];
    }

    async deleteProduct(id) {
        const productosActuales = await this.getProducts();
        const nuevoArrayProductos = productosActuales.filter(producto => producto.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(nuevoArrayProductos));
        console.log("Producto eliminado correctamente");

        

        return nuevoArrayProductos;
    }
 

};



//PRUEBAS
const products = new ProductManager("./products.json");



const prueba = async () => {
    try{
       //await products.addProduct({title: 'cubiertas', description:'redonda', price: 20000, thumbnail:'asd', code:1234, stock: 1 });
       //await products.addProduct({title: 'llanta', description:'metalica', price: 28000, thumbnail:'asdasd', code:12345, stock: 123 });
       //await products.addProduct({title: 'gomita', description:'cuadrado', price: 228000, thumbnail:'qwerty', code:123456, stock: 13 });
       //console.log(await products.getProductById(2));
       
    }
    catch (err){
        console.log('La prueba salio mal')
    }
};


//prueba();



*/