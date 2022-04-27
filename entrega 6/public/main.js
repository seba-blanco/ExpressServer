const socket = io.connect();

function preventDef(){
    return false;
}

function renderProductos(data) {
    const html = data.map((elem, index) => {
        return(`<div>
            <strong>${elem.title}</strong>:
            <em>${elem.price}</em>
        </div>`)
    }).join(" ");

    document.getElementById('lstProducts').innerHTML = html;
    
}

function addProduct(e) {
    
    const data = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnails: document.getElementById('thumbnails').value
    };
    
    socket.emit('newProduct',data);
    
    return false;
}

function addChatMessage(e) {
   
    const chatMsg = {
        userName: document.getElementById('userName').value,
        message: document.getElementById('message').value
    };
   
    socket.emit('newMessage', chatMsg);
   
    return false;
}

socket.on('products', data => {
   
    renderProductos(data);
});


function renderChat(data) {
    const html = data.map((elem, index) => {
        return(`<div>
            <strong>${elem.title}</strong>:
            <em>${elem.price}</em>
        </div>`)
    }).join(" ");

    document.getElementById('lstMsgs').innerHTML = html;
    
}


socket.on('chatMessages', data => {
    alert('en el mensajes');
    renderChat(data);
})
