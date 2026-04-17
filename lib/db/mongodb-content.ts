import { getDatabase } from './mongodb';

export interface Content {
  key: string;
  value: string;
  updated_at: string;
}

export async function getContentByKey(key: string): Promise<Content | null> {
  const db = await getDatabase();
  return await db.collection<Content>('content').findOne({ key });
}

export async function upsertContent(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  
  await db.collection<Content>('content').updateOne(
    { key },
    { 
      $set: {
        key,
        value,
        updated_at: now,
      }
    },
    { upsert: true }
  );
}

export async function getAllContent(): Promise<Record<string, string>> {
  const db = await getDatabase();
  const contents = await db.collection<Content>('content').find({}).toArray();
  
  const result: Record<string, string> = {};
  contents.forEach(c => {
    result[c.key] = c.value;
  });
  
  return result;
}
