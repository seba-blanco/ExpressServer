const express = require('express');
const {Router} = express;

const Contenedor = require("./contenedorAsync");
const port= 8080;

const app = express();
const router = Router();

const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/productos", router);



 
const archivo = new Contenedor('./products.json');

const server =app.listen(port, () => {

    console.log(`servidor http escuchando en el puerto ${server.address().port} `)
})

server.on("error", error => console.log(`Error en servidor ${error}`));


router.get('/',async  (req,res) =>{
    
    let prods =await archivo.getAll();
    
    res.json(prods);

})

//get product by id.
router.get('/:id',async (req,res) =>{
    
    const id = req.params.id;
    let prods = await archivo.getById(id);
    if (Object.entries(prods).length === 0) 
        res.json({errorMsg:'el objeto esta vacio'})
    else 
        res.json(prods);
})


//add product to products.json
router.post("/", async (req, res) => {
    
    let newProduct = await archivo.save(req.body);
    console.log(newProduct);
    res.json({newProduct: newProduct});
})


//modify by ID
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    let newProduct = await archivo.update(id, req.body);
    console.log(newProduct);
    res.json({newProduct: newProduct});
})


//Delete by ID
router.delete("/:id", async (req, res) => {
    
    const id = req.params.id;
    await(archivo.deleteById(id));
   
    res.json({deletedId: id});
})
