import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface Project {
  _id?: ObjectId;
  id?: string;
  title: string;
  description: string;
  category: string;
  year: string;
  image: string;
  image_alt: string;
  images?: string;
  wide?: number;
  featured?: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDatabase();
  const projects = await db
    .collection<Project>('projects')
    .find({})
    .sort({ display_order: 1 })
    .toArray();
  
  return projects.map(p => ({
    ...p,
    id: p._id?.toString() || p.id,
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = await getDatabase();
  const project = await db
    .collection<Project>('projects')
    .findOne({ _id: new ObjectId(id) });
  
  if (!project) return null;
  
  return {
    ...project,
    id: project._id?.toString() || project.id,
  };
}

export async function createProject(data: Omit<Project, '_id' | 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  
  const result = await db.collection<Project>('projects').insertOne({
    ...data,
    created_at: now,
    updated_at: now,
  } as Project);
  
  const project = await db.collection<Project>('projects').findOne({ _id: result.insertedId });
  
  if (!project) throw new Error('Failed to create project');
  
  return {
    ...project,
    id: project._id?.toString(),
  };
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  
  const { _id, id: _, ...updateData } = data as any;
  
  await db.collection<Project>('projects').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...updateData,
        updated_at: now,
      }
    }
  );
  
  return getProjectById(id);
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Project>('projects').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function getMaxDisplayOrder(): Promise<number> {
  const db = await getDatabase();
  const project = await db
    .collection<Project>('projects')
    .find({})
    .sort({ display_order: -1 })
    .limit(1)
    .toArray();
  
  return project.length > 0 ? (project[0].display_order || 0) : -1;
}
