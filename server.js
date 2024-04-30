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

// Function to connect to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

// Call connectToDatabase to establish the connection
connectToDatabase();

// Function to create a new user
async function createUser(email, username, password, fullName) {
    const db = client.db("myNewDatabase");
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

// Function to find a user by username
async function findUserByUsername(username) {
    const db = client.db("myNewDatabase");
    const collection = db.collection('users');
    try {
        const user = await collection.findOne({ username: username });
        return user;
    } catch (error) {
        console.error("Error fetching user by username", error);
        throw error;
    }
}

// Function to add an item to a user's item list
async function addItemToUser(item) {
    const db = client.db("myNewDatabase");
    const collection = db.collection('userItems');
    try {
        const result = await collection.insertOne(item);
        return result;
    } catch (error) {
        console.error("Error adding item to user", error);
        throw error;
    }
}

// Function to remove an item from a user's item list
async function removeItemFromUser(username, upc) {
    const db = client.db("myNewDatabase");
    const collection = db.collection('userItems');
    try {
        const result = await collection.deleteOne({ username: username, upc: upc });
        return result;
    } catch (error) {
        console.error("Error removing item from user", error);
        throw error;
    }
}

// Function to get items for a specific user
async function getItemsForUser(username) {
    const db = client.db("myNewDatabase");
    const collection = db.collection('userItems');
    try {
        const cursor = collection.find({ username: username });
        const items = await cursor.toArray();
        return items;
    } catch (error) {
        console.error("Error retrieving items for user:", error);
        throw error;
    }
}

// Endpoint to register a new user
app.post('/register', async (req, res) => {
    const { email, username, password, fullName } = req.body;
    try {
        const result = await createUser(email, username, password, fullName);
        res.status(201).send({ message: 'User registered', userId: result.insertedId });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Error registering user' });
    }
});

// Endpoint to authenticate a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (user && user.password === password) {
            res.status(200).send({ message: 'Login successful', user: { username: user.username, email: user.email } });
        } else {
            res.status(401).send({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to add an item to the user's list
app.post('/addItem', async (req, res) => {
    const { username, upc, image, description, brand, price, inStock, address, aisle, locationName } = req.body;
    const item = { username, upc, image, description, brand, price, inStock, address, aisle, locationName };
    try {
        await addItemToUser(item);
        res.status(200).send({ message: 'Item added successfully' });
    } catch (error) {
        console.error("Error adding item: ", error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to remove an item from the user's list
app.post('/removeItem', async (req, res) => {
    const { username, upc } = req.body;
    try {
        const result = await removeItemFromUser(username, upc);
        if (result.deletedCount > 0) {
            res.status(200).send({ message: 'Item removed successfully' });
        } else {
            res.status(404).send({ error: 'Item not found or not removed' });
        }
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to get items for a specific user
app.get('/getItems', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).send({ error: 'Username parameter is required' });
    }

    try {
        const items = await getItemsForUser(username);
        res.status(200).send(items);
    } catch (error) {
        console.error("Failed to get items:", error);
        res.status(500).send({ error: 'Failed to retrieve items' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
