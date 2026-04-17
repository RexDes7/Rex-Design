/**
 * Content Service
 * 
 * Handles all content-related operations (projects, about, contact info)
 */

import { getDatabase } from '@/lib/db/client';
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

class ContentService {
  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    const db = getDatabase();
    const projects = db.prepare(`
      SELECT * FROM projects 
      ORDER BY display_order ASC, created_at DESC
    `).all() as Project[];
    
    return projects;
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    const db = getDatabase();
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
    
    return project || null;
  }

  /**
   * Create new project
   */
  async createProject(data: CreateProjectInput): Promise<Project> {
    const db = getDatabase();
    const id = randomUUID();
    const now = new Date().toISOString();

    // Get max display_order
    const maxOrder = db.prepare('SELECT MAX(display_order) as max FROM projects').get() as { max: number | null };
    const displayOrder = (maxOrder.max || 0) + 1;

    db.prepare(`
      INSERT INTO projects (
        id, title, description, category, year, image, image_alt, 
        wide, featured, display_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.description,
      data.category,
      data.year,
      data.image,
      data.image_alt,
      data.wide ? 1 : 0,
      data.featured ? 1 : 0,
      displayOrder,
      now,
      now
    );

    return this.getProjectById(id) as Promise<Project>;
  }

  /**
   * Update project
   */
  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    const db = getDatabase();
    const now = new Date().toISOString();

    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.year !== undefined) {
      updates.push('year = ?');
      values.push(data.year);
    }
    if (data.image !== undefined) {
      updates.push('image = ?');
      values.push(data.image);
    }
    if (data.image_alt !== undefined) {
      updates.push('image_alt = ?');
      values.push(data.image_alt);
    }
    if (data.wide !== undefined) {
      updates.push('wide = ?');
      values.push(data.wide ? 1 : 0);
    }
    if (data.featured !== undefined) {
      updates.push('featured = ?');
      values.push(data.featured ? 1 : 0);
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    db.prepare(`
      UPDATE projects 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values);

    return this.getProjectById(id) as Promise<Project>;
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    const db = getDatabase();
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  }

  /**
   * Reorder projects
   */
  async reorderProjects(projectIds: string[]): Promise<void> {
    const db = getDatabase();
    
    projectIds.forEach((id, index) => {
      db.prepare('UPDATE projects SET display_order = ? WHERE id = ?').run(index + 1, id);
    });
  }

  /**
   * Get about content
   */
  async getAboutContent(): Promise<any> {
    const db = getDatabase();
    const content = db.prepare('SELECT * FROM content WHERE key = ?').get('about') as any;
    
    return content ? JSON.parse(content.value) : null;
  }

  /**
   * Update about content
   */
  async updateAboutContent(data: any): Promise<void> {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT OR REPLACE INTO content (key, value, updated_at)
      VALUES (?, ?, ?)
    `).run('about', JSON.stringify(data), now);
  }

  /**
   * Get contact info
   */
  async getContactInfo(): Promise<any> {
    const db = getDatabase();
    const content = db.prepare('SELECT * FROM content WHERE key = ?').get('contact') as any;
    
    return content ? JSON.parse(content.value) : null;
  }

  /**
   * Update contact info
   */
  async updateContactInfo(data: any): Promise<void> {
    const db = getDatabase();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT OR REPLACE INTO content (key, value, updated_at)
      VALUES (?, ?, ?)
    `).run('contact', JSON.stringify(data), now);
  }
}

export const contentService = new ContentService();
