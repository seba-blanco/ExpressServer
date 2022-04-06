const express = require('express');
const port= 8080;
const app = express();
const fs = require('fs');
const path = require('path');



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



    }

    deleteById =async(id) => {
        console.log("entre al get by id");
        let datos = await this.readFile().then (prods=> {return prods});
        
        let newData = datos.filter(x=> x.id != id);
        
        console.log("newData");
        console.log(newData);
        this.writeFile(newData);

    }

    
    deleteAll = async () => {
        console.log("entre al delete all")
        
        this.writeFile([]);
    }
}

/*
const archivo = new contenedor('./products.json');

 archivo.getAll().then(res => {console.log(res)});


 archivo.getById(2).then(res => {console.log(res)})


 const newProduct = {
    "title":"Muy malo",
    "price":200,
    "thumbnails":"test"
 }

 archivo.save(newProduct)*/

 
 const archivo = new contenedor('./products.json');

const server =app.listen(port, () => {

    console.log(`servidor http escuchando en el puerto ${server.address().port} `)
})

server.on("error", error => console.log(`Error en servidor ${error}`));


app.get('/productos',async  (req,res) =>{
    
    let prods =await archivo.getAll();
    
    res.json(prods);

})


app.get('/productoRandom',async (req,res) =>{
    
    const id = Math.floor(Math.random() * 4) + 1;
    let prods = await archivo.getById(id);
    res.json(prods);
})
