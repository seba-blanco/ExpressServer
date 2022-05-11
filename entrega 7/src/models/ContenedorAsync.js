const fs = require('fs');
const path = require('path');

class contenedor {
    constructor(knexConn, tableName) {
        this.knexConn =  knexConn;
        this.tableName = tableName;

    }
        
    readFile = async () => {
    
      
    }


    writeFile =async (data) => {
        
        await fs.promises.writeFile(this.fileName, JSON.stringify(data, null, 4))
        .then(res => {console.log("actualizado")})
        .catch(err => {console.log('no se puedo actualizar', err)})


    }
    

    getAll = async () => {
        const content= await this.knexConn(this.tableName).select('id', 'name', 'price', 'description', 'stock')
        .then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
        });
        return content;
        
        // return datos;
    }
    
    getById =async (id) => {
        
        const content= await this.knexConn(this.tableName).where({id: id}).select('id', 'name', 'price', 'description', 'stock')
        .then((result) => {
            return result;
        }).catch((err) => {
            console.log(err);
        });
        return content;
    }
    
    save =async (object) => {
       
        const content= await this.knexConn(this.tableName).insert({name: object.name, description: object.description, price: object.price, photo: object.photo, stock:object.stock})
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
        return object;
        
        // console.log(datos)
        // let maxId = Math.max(...datos.map(prod => prod.id), 0);
        // object["id"] = maxId + 1;
        // datos.push(object);
       
        // this.writeFile(datos);

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

module.exports = contenedor;