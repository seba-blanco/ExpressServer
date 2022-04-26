const socket = io.connect();


function addProduct(e) {
    e.preventDefault();
    socket.emit('newProduct', "");
    alert('test');
    console.log("entre al ad prodcut cliente");

    // const prod = {
    //     title: document.getElementById('title').value,
    //     price: document.getElementById('price').value,
    //     thumbnails: document.getElementById('thumbnails').value
    // };
    
    // socket.emit('newProduct', prod);

    return false;
}
socket.on('products', data => {
    console.log("entra al productos del front")
    //render(data);
})