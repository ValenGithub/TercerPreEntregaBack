
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



const agregarProductoBotones = document.querySelectorAll('.btn-add-to-cart');

agregarProductoBotones.forEach((boton) => {
  boton.addEventListener('click', async (e) => {
    const productId = e.target.dataset.productId;
    async function addProductCart() {
      const cartId = localStorage.getItem('cartClient');
      console.log(cartId)
      console.log(productId)
      try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 401) {
            console.error("Authentication error: Token expired or user not authenticated.");
            // Aquí puedes redirigir al usuario al inicio de sesión o mostrarle un mensaje.
        } else {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
    }
  addProductCart()
  });
});


const deleteProducttButtons = document.querySelectorAll(".deleteProduct");

deleteProducttButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productId = e.target.dataset.productId;
    async function deleteProductCart() {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(response => {
         location.reload()
        })
    }
    deleteProductCart()
  });
});