import { type User, type InsertUser, type Document, type InsertDocument, users, documents } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDocuments(): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  getDocumentsByAppId(appId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  updateDocument(id: string, doc: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getDocuments(): Promise<Document[]> {
    return db.select().from(documents).orderBy(documents.updatedAt);
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.category, category));
  }

  async getDocumentsByAppId(appId: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.appId, appId));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(doc).returning();
    return document;
  }

  async updateDocument(id: string, doc: Partial<InsertDocument>): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set({ ...doc, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
