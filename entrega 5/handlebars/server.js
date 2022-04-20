const express = require('express');
const app = express();
const PORT = 8080;
const handlebars = require('express-handlebars');

const Contenedor = require("./contenedorAsync");

// const router = Router();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use("/api/productos", router);

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static("public"));

app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/"
    })
);

 
const archivo = new Contenedor('./products.json');

const server =app.listen(PORT, () => {

    console.log(`servidor http escuchando en el puerto ${server.address().port} `)
})

server.on("error", error => console.log(`Error en servidor ${error}`));


app.get('/productos',async  (req,res) =>{
    
    let prods =await archivo.getAll();
    
    console.log(prods);
    res.render('productos', { productos: prods, listExists: true });  

})

app.get('/',async  (req,res) =>{
    
    res.render('main', {});  

})


//add product to products.json
app.post("/", async (req, res) => {
   
    let newProduct = await archivo.save(req.body);
    
     res.redirect('/productos');
     // res.json({newProduct: newProduct});
})




