import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase();
  return await db.collection<User>('users').findOne({ email });
}

export async function createUser(email: string, password_hash: string): Promise<User> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  
  const result = await db.collection<User>('users').insertOne({
    email,
    password_hash,
    created_at: now,
  } as User);
  
  const user = await db.collection<User>('users').findOne({ _id: result.insertedId });
  if (!user) throw new Error('Failed to create user');
  
  return user;
}
