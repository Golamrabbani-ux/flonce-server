const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 4000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phsvt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("FloneCommerce").collection("allProducts");

    // ALL POST
    app.post('/allProducts', (req, res) => {
        const products = req.body;
        productsCollection.insertMany(products)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })
    app.post('/someProductsKeys', (req, res) =>{
        const productKeys = req.body;
        const productId = productKeys.map(id => {
            return ObjectId(id)
        })
        productsCollection.find({_id: {$in: productId}})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })


    //ALL GET
    //ALL PRODUCTS
    app.get('/allProducts', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })
    //SINGLE PRODUCT
    app.get('/product/:_id', (req, res) =>{
        const productId = req.params._id;
        productsCollection.find({_id: ObjectId(productId)})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})