const express = require('express')
require('dotenv').config()
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const port = 5000

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5rt5l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  console.log('database connected');

  app.post('/addProduct', (req, res) => {
    const product = req.body;
    console.log(product);
    collection.insertOne(product)
    .then(result => {
      res.send(result.insertedCount)
    })
    .catch(err => console.log(err))
  })

  app.get('/products', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/products/:key', (req, res) => {
    collection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    collection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const orderInfo = req.body;
    ordersCollection.insertOne(orderInfo)
    .then(result => {
     res.send(result.insertedCount > 0)
      console.log(result);
    })
    .catch(err => console.log(err))
  })
});



app.listen(port)