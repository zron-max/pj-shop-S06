import { shoppingItems, users, type User, type InsertUser, type ShoppingItem, type InsertShoppingItem } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Shopping Items CRUD
  getShoppingItems(userId: string): Promise<ShoppingItem[]>;
  createShoppingItem(item: InsertShoppingItem): Promise<ShoppingItem>;
  updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined>;
  deleteShoppingItem(id: number): Promise<boolean>;
  toggleShoppingItemComplete(id: number): Promise<ShoppingItem | undefined>;
  resetAllItems(userId: string): Promise<ShoppingItem[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getShoppingItems(userId: string): Promise<ShoppingItem[]> {
    const items = await db.select().from(shoppingItems).where(eq(shoppingItems.userId, userId));
    return items;
  }

  async createShoppingItem(insertItem: InsertShoppingItem): Promise<ShoppingItem> {
    const [item] = await db
      .insert(shoppingItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined> {
    try {
      const updateData: any = { updatedAt: new Date() };
      
      // Only include defined values in the update
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.category !== undefined) updateData.category = updates.category;
      
      const [item] = await db
        .update(shoppingItems)
        .set(updateData)
        .where(eq(shoppingItems.id, id))
        .returning();
        
      return item || undefined;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  async deleteShoppingItem(id: number): Promise<boolean> {
    const result = await db
      .delete(shoppingItems)
      .where(eq(shoppingItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async toggleShoppingItemComplete(id: number): Promise<ShoppingItem | undefined> {
    const [currentItem] = await db.select().from(shoppingItems).where(eq(shoppingItems.id, id));
    if (!currentItem) return undefined;

    const [updatedItem] = await db
      .update(shoppingItems)
      .set({ 
        completed: !currentItem.completed,
        updatedAt: new Date() 
      })
      .where(eq(shoppingItems.id, id))
      .returning();
    
    return updatedItem || undefined;
  }

  async resetAllItems(userId: string): Promise<ShoppingItem[]> {
    try {
      // Use raw SQL to avoid ORM issues
      await db.execute(sql`
        UPDATE shopping_items 
        SET completed = false, updated_at = NOW() 
        WHERE user_id = ${userId}
      `);
      
      // Return updated items
      return this.getShoppingItems(userId);
    } catch (error) {
      console.error('Reset all items error:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
