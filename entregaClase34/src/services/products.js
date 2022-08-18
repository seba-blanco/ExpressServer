const {productsDAO} = require("./src/DAOS/defaultDaos");

const addProd = async (p) => {
  return await productsDAO.save(p);
};

const getAllProd = async () => {
  return await productsDAO.getAll();
};

const srvcProducts = { addProd, getAllProd };

module.exports = srvcProducts;
