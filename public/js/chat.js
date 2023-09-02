const socket = io();
let user;
const inputMSJ = document.getElementById('msj');
const sendBtn = document.getElementById('sendBtn');
  
  Swal.fire({
    title: 'Bienvenido',
    input: 'text',
    text: 'Identificate para participar del PiolaChat',
    icon: 'success',
    inputValidator: (value) => {
      return !value && 'Tenes que identificarte, aca fantasmas no...';
    },
    allowOutsideClick: false,
  }).then((result) => {
    user = result.value;
    socket.emit('sayhello', user);
  });
  
  function render(data) {
    // Genero el html
    const html = data
      .map((elem, index) => {
        // Recorro el array de mensajes y genero el html
        return `<div>
          <strong>${elem.user}:</strong>
          <em>${elem.message}</em>
        </div>`;
      })
      .join(' '); // Convierto el array de strings en un string
  
    // Inserto el html en el elemento con id messages
    document.getElementById('messages').innerHTML = html;
  }
  
  inputMSJ.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });
  
  sendBtn.addEventListener('click', () => {
    sendMessage();
  });
  
  function sendMessage() {
    let msj = inputMSJ.value;
    if (msj.trim().length > 0) {
      socket.emit('message', { user, msj });
      inputMSJ.value = '';
    }
  }
  
  socket.on('messages', (data) => {
    render(data);
  });
  
  socket.on('connected', (data) => {
    Swal.fire({
      text: `Se conecto ${data}`,
      toast: true,
      position: 'top-right',
    });
  });