import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Convert mongodb+srv:// to direct mongodb:// connection with explicit hosts
function convertToDirectUri(srvUri: string): string {
  if (!srvUri.startsWith('mongodb+srv://')) {
    return srvUri;
  }

  // Extract credentials and cluster name
  const match = srvUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(.*)/);
  if (!match) {
    return srvUri;
  }

  const [, username, password, host, queryParams] = match;
  // For Atlas cluster "portfolio.ursz6ap.mongodb.net", the direct hosts are:
  const directHosts = [
    'ac-8xw0qmq-shard-00-00.ursz6ap.mongodb.net:27017',
    'ac-8xw0qmq-shard-00-01.ursz6ap.mongodb.net:27017',
    'ac-8xw0qmq-shard-00-02.ursz6ap.mongodb.net:27017',
  ].join(',');

  // Build query params
  const params = queryParams.startsWith('?') ? queryParams.substring(1) : '';
  const paramObj = new URLSearchParams(params);
  paramObj.set('ssl', 'true');
  paramObj.set('authSource', 'admin');
  paramObj.set('replicaSet', 'atlas-5x4y0l-shard-0');
  paramObj.set('retryWrites', 'true');
  paramObj.set('w', 'majority');

  return `mongodb://${username}:${password}@${directHosts}/?${paramObj.toString()}`;
}

const uri = convertToDirectUri(process.env.MONGODB_URI);

const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  retryWrites: true,
  w: 'majority' as const,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

async function createClient(): Promise<MongoClient> {
  const mongoClient = new MongoClient(uri, options);
  await mongoClient.connect();
  console.log('[MongoDB] Connected successfully');
  return mongoClient;
}

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = createClient();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = createClient();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('Portfolio');
}
