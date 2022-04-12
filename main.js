const express = require('express');
const { get } = require('express/lib/response');
const {Router} = express;

const port= 8080;

const app = express();
const router = Router();

const fs = require('fs');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/productos", router);

class contenedor {
    constructor(fileName) {
        this.fileName = fileName;
        this.fileContent = [];

    }
        
    readFile = async () => {
     const content =  await fs.promises.readFile(this.fileName,'utf-8')
        .then (contenido => { 
            
           return JSON.parse(contenido);
           
        })
        
        .catch(error => {
        })
        
        return content;
    }


    writeFile =async (data) => {
        
        await fs.promises.writeFile(this.fileName, JSON.stringify(data, null, 4))
        .then(res => {console.log("actualizado")})
        .catch(err => {console.log('no se puedo actualizar', err)})


    }
    

    getAll = async () => {
        console.log("entre al get all")
        let datos = await this.readFile().then (prods=> { return prods});
        
        return datos;
    }
    
    getById =async (id) => {
        console.log("entre al get by id")
        let datos = await this.readFile().then (prods=> {return prods});

        console.log("esto es datos");
        console.log(datos);
        return datos.filter(x=> x.id == id);
    }
    
    save =async (object) => {
        console.log("datos get by id")
        let datos = await this.readFile().then (prods=> {return prods});
        console.log(datos)
        let maxId = Math.max(...datos.map(prod => prod.id), 0);
        object["id"] = maxId + 1;
        datos.push(object);
       
        this.writeFile(datos);

        return object;


    }

    update = async (id, product) => {
        let datos = await this.readFile().then (prods=> {return prods});
        
        let newData = datos.filter(x=> x.id != id);

        product["id"] = id;

        newData.push(product);
       
        this.writeFile(newData);

        return product;


    }

    deleteById =async(id) => {
        
        let datos = await this.readFile().then (prods=> {return prods});
        
        let newData = datos.filter(x=> x.id != id);
        
      
        this.writeFile(newData);

    }

    
    deleteAll = async () => {
        console.log("entre al delete all")
        
        this.writeFile([]);
    }
}

 
const archivo = new contenedor('./products.json');

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
