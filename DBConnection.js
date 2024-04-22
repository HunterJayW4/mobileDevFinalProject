const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:groceryHound@cluster0.xaavoou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function findUserByUsername(username) {
    const db = client.db("myNewDatabase"); // Replace "your_database_name" with the actual database name
    const collection = db.collection('users'); // Assuming 'users' is your collection name
    try {
        const users = await collection.find({ username: username }).toArray();
        return users; // This will be an array of user documents
    } catch (error) {
        console.error("Failed to retrieve users", error);
        throw error; // Rethrow the error after logging it
    }
}

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Example usage: Query users by username
        const username = "admin"; // Replace "exampleUser" with the username you want to query
        const users = await findUserByUsername(username);
        console.log(users); // Log the array of users found

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
