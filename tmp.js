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

async function createItemsCollection() {
    try {
        await client.connect();
        const db = client.db("myNewDatabase");
        // This will create the 'items' collection if it does not already exist
        const collection = await db.createCollection('items', {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["username", "items"],
                    properties: {
                        username: {
                            bsonType: "string",
                            description: "must be a string and is required"
                        },
                        items: {
                            bsonType: "array",
                            description: "must be an array of strings and is required",
                            items: {
                                bsonType: "string"
                            }
                        }
                    }
                }
            }
        });
        console.log("'items' collection created successfully");
    } catch (error) {
        if (error.codeName === 'NamespaceExists') {
            console.log("'items' collection already exists");
        } else {
            console.error("Error creating 'items' collection", error);
            throw error;
        }
    } finally {
        await client.close();
    }
}

// Call createItemsCollection when the server starts
createItemsCollection().catch(console.error);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
