// Update the connection string below with your MongoDB URI
const uri = 'mongodb://localhost:27017'; // <-- Replace with your MongoDB connection string if needed
const dbName = 'eccom';
const collections = ['users', 'products', 'orders', 'categories'];

const { MongoClient } = require('mongodb');

async function initDatabase() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    for (const coll of collections) {
      const exists = await db.listCollections({ name: coll }).hasNext();
      if (!exists) {
        await db.createCollection(coll);
        console.log(`Created collection: ${coll}`);
      } else {
        console.log(`Collection already exists: ${coll}`);
      }
    }
    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.close();
  }
}

initDatabase(); 