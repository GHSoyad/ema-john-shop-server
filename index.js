const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7r6jn89.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const productsCollection = client.db('ema-john').collection('products');
        const ordersCollection = client.db('ema-john').collection('orders');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.put('/orders', async (req, res) => {
            const product = req.body;
            const { productId, email } = product;
            const filter = { _id: ObjectId(productId) };
            const options = { upsert: true };
            const updateOrder = {
                $set: { productId, email },
                $inc: { quantity: 1 }
            };
            const result = await ordersCollection.updateOne(filter, updateOrder, options);
            res.send(result);
        })

    } finally {

    }
}

run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send("Server is running!!")
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})