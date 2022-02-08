const express = require('express');

const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// mongodb database user name : mydbuser1
//password iulkgOC9qv1roUAK

//middleware

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://mydbuser1:iulkgOC9qv1roUAK@cluster0.4mq9z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection('users');
        //GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })
        // POST api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('new user added', result);
            res.json(result);
        })

        //update put
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updtedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updtedUser.name,
                    email: updtedUser.email

                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log('update', id);
            res.json(result);
        })

        //Delete API

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('deleting users with id', id);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('runing my crud');
});

app.listen(port, () => {
    console.log('running server port', port);
})