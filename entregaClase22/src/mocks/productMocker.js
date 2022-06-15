const faker = require('faker')
    
generateRandomProducts = (amount) => {
    const myRandomProds = [];
    
    for (let i = 0; i < amount; i++) {
        const myRandomProd = {
            id: faker.random.number(),
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnails: faker.image.image()
            
        }
        myRandomProds.push(myRandomProd);        
    }

    return myRandomProds;
}

module.exports = {generateRandomProducts};

