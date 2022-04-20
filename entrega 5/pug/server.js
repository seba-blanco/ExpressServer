const express = require('express');
const app = express();
const PORT = 8080;

const Contenedor = require("./contenedorAsync");

// const router = Router();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use("/api/productos", router);

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static("public"));



 
const archivo = new Contenedor('./products.json');

const server =app.listen(PORT, () => {

    console.log(`servidor http escuchando en el puerto ${server.address().port} `)
})

server.on("error", error => console.log(`Error en servidor ${error}`));


app.get('/productos',async  (req,res) =>{
    
    let prods =await archivo.getAll();
    
    console.log(prods);
    res.render('productos.pug', { productos: prods, listExists: true });  

})

app.get('/',async  (req,res) =>{
    
    res.render('main.pug', {});  

})


//add product to products.json
app.post("/", async (req, res) => {
    let newProduct = await archivo.save(req.body);
    
     res.redirect('/productos');
})




