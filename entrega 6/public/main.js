const socket = io.connect();

function preventDef(){
    return false;
}

socket.on('welcome', data => {
    renderProductos(data.products);
    renderChat(data.chat);

});



function renderProductos(data) {
    
    const html = data.map((elem, index) => {
        return(`<tr>
            <td>${elem.title}</td>
            <td>${elem.price}</td>
            <td><img src='${elem.thumbnails}'></img></td>
        </tr>`)
    }).join(" ");
    document.getElementById('tableProd').getElementsByTagName('tbody')[0].innerHTML = html;
    
    
}


function renderChat(data) {
    if (data.length> 0) { 
    const html = data.map((elem, index) => {
        return(`<div>
            <strong style='color:blue;'>${elem.userName}</strong>:
            <span style='color:brown;'>[${elem.datetime}]</span>
            <i style='color:green;'>${elem.message}</i>
        </div>`)
    }).join(" ");

   document.getElementById('lstMsgs').innerHTML = html;
    }
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

socket.on('chatMessages', data => {
    renderChat(data.chat);
});
