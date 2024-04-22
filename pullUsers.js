const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:groceryHound@cluster0.xaavoou.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function fetchAllUsers() {
    try {
        await client.connect();
        const database = client.db("myNewDatabase"); // Replace "myNewDatabase" with your actual database name
        const users = database.collection("users");

        const allUsers = await users.find({}).toArray();
        return allUsers; // This will be an array of all user documents
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // It's good practice to re-throw the error after logging it
    } finally {
        await client.close(); // Make sure to close the MongoDB client
    }
}

async function run() {
    try {
        const users = await fetchAllUsers();
        console.log("All users:", users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
}

run();
