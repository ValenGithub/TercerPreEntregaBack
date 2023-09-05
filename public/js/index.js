
const cartId = localStorage.getItem('cartClient');

async function verifyCart() {
  if (cartId !== null) {
  
  } else {
    try {
      const response = await fetch(`/api/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      localStorage.setItem('cartClient', data._id);

    } catch (error) {
      console.error("Error:", error);
    }
  }
}


verifyCart();








// // Obtener todos los botones "agregar al carrito"
const agregarProductoBotones = document.querySelectorAll('.btn-add-to-cart');

agregarProductoBotones.forEach((boton) => {
  boton.addEventListener('click', async (e) => {
    const productId = e.target.dataset.productId;
    async function addProductCart() {
      const cartId = localStorage.getItem('cartClient');
      console.log(cartId)
      try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data)

      } catch (error) {
        console.error("Error:", error);
      }
    }
  addProductCart()
  });
});
