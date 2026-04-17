require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('Testing MongoDB connection...');
  console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✓ Connected successfully to MongoDB Atlas');
    
    const db = client.db('portfolio');
    const collections = await db.listCollections().toArray();
    console.log('✓ Database "portfolio" accessible');
    console.log('Collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✓ Connection closed');
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
