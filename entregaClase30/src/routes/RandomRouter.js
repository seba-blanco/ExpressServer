const express = require('express');
const {Router} = express;
const randomRouter = Router();

const {fork} = require('child_process');


randomRouter.get('/random?', async (req,res) => {
    //INSERT WITH MANUAL IDS
    
    const cant = req.query.cant ? req.query.cant : 100000000
    const forket = fork('./src/utils/randomNumbers');
    forket.send(cant)
    forket.on("message", (data) => {
        res.json({
            randomNumbers: data
        })
    })
})

module.exports = randomRouter;