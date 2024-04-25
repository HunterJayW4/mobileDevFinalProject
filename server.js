const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const uri = "mongodb+srv://admin:groceryHound@cluster0.xaavoou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function createUser(email, username, password, fullName) {
    const db = client.db("myNewDatabase"); // Ensure you replace "myNewDatabase" with your actual database name
    const collection = db.collection('users');
    try {
        const newUser = { email, username, password, fullName };
        const result = await collection.insertOne(newUser);
        return result;
    } catch (error) {
        console.error("Error creating user", error);
        throw error;
    }
}

async function findUserByUsername(username) {
    const db = client.db("myNewDatabase"); // Adjust if you have a different database name
    const collection = db.collection('users');
    try {
        await client.connect();
        const user = await collection.findOne({ username: username });
        return user;
    } catch (error) {
        console.error("Error fetching user by username", error);
        throw error;
    } finally {
        await client.close();
    }
}

// Function to add an item to a user's item list
async function addItemToUser(username, upc) {
    const db = client.db("myNewDatabase");
    const collection = db.collection('items');
    try {
        await client.connect();
        const result = await collection.updateOne(
            { username: username },
            { $addToSet: { items: upc } },  // Use $addToSet to avoid duplicate items
            { upsert: true }  // Creates a new document if no document matches the query
        );
        return result;
    } catch (error) {
        console.error("Error adding item to user", error);
        throw error;
    } finally {
        await client.close();
    }
}

// Function to remove an item from a user's item list
async function removeItemFromUser(username, upc) {
    const db = client.db("myNewDatabase");
    const collection = db.collection('items');
    try {
        await client.connect();
        const result = await collection.updateOne(
            { username: username },
            { $pull: { items: upc } }  // $pull removes the item from the array
        );
        return result;
    } catch (error) {
        console.error("Error removing item from user", error);
        throw error;
    } finally {
        await client.close();
    }
}


app.post('/register', async (req, res) => {
    const { email, username, password, fullName } = req.body;
    try {
        await client.connect(); // Ensure MongoDB client is connected
        const result = await createUser(email, username, password, fullName);
        res.status(201).send({ message: 'User registered', userId: result.insertedId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Error registering user' });
    } finally {
        await client.close(); // Ensure MongoDB client is closed after the operation
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        await client.connect();
        const user = await findUserByUsername(username);
        if (user && user.password === password) {
            res.status(200).send({ message: 'Login successful', user: { username: user.username, email: user.email } });
        } else {
            res.status(401).send({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

// API endpoint to add an item to the user's list
app.post('/addItem', async (req, res) => {
    const { username, upc } = req.body;
    try {
        const result = await addItemToUser(username, upc);
        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
            res.status(200).send({ message: 'Item added successfully' });
        } else {
            res.status(404).send({ error: 'Item not added' });
        }
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send({ error: 'Error adding item' });
    }
});

// API endpoint to remove an item from the user's list
app.post('/removeItem', async (req, res) => {
    const { username, upc } = req.body;
    try {
        const result = await removeItemFromUser(username, upc);
        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Item removed successfully' });
        } else {
            res.status(404).send({ error: 'Item not found or not removed' });
        }
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).send({ error: 'Error removing item' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
