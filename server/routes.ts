import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShoppingItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all shopping items for a user
  app.get("/api/shopping-items", async (req, res) => {
    try {
      const userId = req.query.userId as string || 'user1'; // Default user for demo
      const items = await storage.getShoppingItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shopping items' });
    }
  });

  // Create a new shopping item
  app.post("/api/shopping-items", async (req, res) => {
    try {
      const validatedData = insertShoppingItemSchema.parse({
        ...req.body,
        userId: req.body.userId || 'user1', // Default user for demo
      });
      
      const item = await storage.createShoppingItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create shopping item' });
      }
    }
  });

  // Reset all shopping items (uncheck all) - place before other PATCH routes
  app.patch("/api/shopping-items/reset", async (req, res) => {
    try {
      const userId = req.query.userId as string || 'user1'; // Default user for demo
      const updatedItems = await storage.resetAllItems(userId);
      res.json(updatedItems);
    } catch (error: any) {
      console.error('Reset error:', error);
      res.status(500).json({ error: 'Failed to reset shopping list', details: error?.message || 'Unknown error' });
    }
  });

  // Toggle item completion
  app.patch("/api/shopping-items/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }
      
      const item = await storage.toggleShoppingItemComplete(id);
      
      if (!item) {
        res.status(404).json({ error: 'Shopping item not found' });
        return;
      }
      
      res.json(item);
    } catch (error) {
      console.error('Toggle item error:', error);
      res.status(500).json({ error: 'Failed to toggle shopping item' });
    }
  });

  // Update a shopping item
  app.patch("/api/shopping-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }
      
      const updates = req.body;
      
      const item = await storage.updateShoppingItem(id, updates);
      if (!item) {
        res.status(404).json({ error: 'Shopping item not found' });
        return;
      }
      
      res.json(item);
    } catch (error) {
      console.error('Update item error:', error);
      res.status(500).json({ error: 'Failed to update shopping item' });
    }
  });

  // Delete a shopping item
  app.delete("/api/shopping-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }
      
      const success = await storage.deleteShoppingItem(id);
      
      if (!success) {
        res.status(404).json({ error: 'Shopping item not found' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete item error:', error);
      res.status(500).json({ error: 'Failed to delete shopping item' });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
