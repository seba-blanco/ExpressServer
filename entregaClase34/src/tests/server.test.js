const request = require("supertest")("http://localhost:8080")
const expect = require("chai").expect

describe("test cases for API/products", function () {

    it("get All products", async function (){
        const prod = await request.get("/api/productos/")
        console.log(prod._body)
        expect(prod.status).to.eql(200)
    })

    it("Get one product by id", async () => {
        const prod = await request.get("/api/productos/1")
        console.log(prod._body)
        expect(prod.status).to.eql(200)
        expect(prod._body.id).to.eql(1)
    })


    it("Create prod", async () => {
        const prod = {
            title: "calculadora",
            price: 234.56,
            thumbnails: "https://via.placeholder.com/15"
        }

        const response = await request.post("/api/productos").send(prod)


        expect(response.status).to.eql(200)
    })

    it("edit prod", async () => {
        const edit = {
            title: "calculadora modificada",
            price: 234.56,
            thumbnails: "https://via.placeholder.com/15"
        }

        const response = await request.put("/api/productos/2").send(edit)

        expect(response.status).to.eql(200)
    })

    //revisar antes que el id este disponible.
    it("delete by id", async () => {
        const response = await request.delete("/api/productos/5")

        expect(response.status).to.eql(200)
    })

}) 