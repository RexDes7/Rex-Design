import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Pageview {
  _id?: ObjectId;
  path: string;
  ip?: string;
  timestamp: string;
}

export interface Contact {
  _id?: ObjectId;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export async function trackPageview(path: string, ip?: string): Promise<void> {
  const db = await getDatabase();
  await db.collection<Pageview>('pageviews').insertOne({
    path,
    ip,
    timestamp: new Date().toISOString(),
  } as Pageview);
}

export async function getPageviews(startDate?: string, endDate?: string): Promise<Pageview[]> {
  const db = await getDatabase();
  const query: any = {};
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }
  
  return await db
    .collection<Pageview>('pageviews')
    .find(query)
    .sort({ timestamp: -1 })
    .toArray();
}

export async function createContact(name: string, email: string, message: string): Promise<Contact> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  
  const result = await db.collection<Contact>('contacts').insertOne({
    name,
    email,
    message,
    created_at: now,
  } as Contact);
  
  const contact = await db.collection<Contact>('contacts').findOne({ _id: result.insertedId });
  if (!contact) throw new Error('Failed to create contact');
  
  return contact;
}

export async function getAllContacts(): Promise<Contact[]> {
  const db = await getDatabase();
  return await db
    .collection<Contact>('contacts')
    .find({})
    .sort({ created_at: -1 })
    .toArray();
}
