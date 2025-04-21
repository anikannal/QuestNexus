import express, { Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameStateSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the Percy Jackson Quest Game
  const apiRouter = express.Router();

  // Get the current game state for a user
  apiRouter.get("/game-state/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const gameState = await storage.getGameState(userId);
      
      if (!gameState) {
        return res.status(404).json({ message: "Game state not found" });
      }
      
      return res.json(gameState);
    } catch (error) {
      console.error("Error getting game state:", error);
      return res.status(500).json({ message: "Failed to get game state" });
    }
  });

  // Save the current game state for a user
  apiRouter.post("/game-state", async (req: Request, res: Response) => {
    try {
      const { userId, playerData, questProgress, currentScene } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Validate data if provided fully as a game state
      if (!playerData || !questProgress || !currentScene) {
        return res.status(400).json({ message: "Player data, quest progress, and current scene are required" });
      }
      
      // Convert to number if it's a string
      const userIdNum = typeof userId === 'string' ? parseInt(userId) : userId;
      
      if (isNaN(userIdNum)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Update timestamp
      const timestamp = new Date().toISOString();
      
      const savedState = await storage.saveGameState(userIdNum, {
        playerData,
        questProgress,
        currentScene,
        updatedAt: timestamp
      });
      
      return res.status(201).json(savedState);
    } catch (error) {
      console.error("Error saving game state:", error);
      return res.status(500).json({ message: "Failed to save game state", error: String(error) });
    }
  });

  // Get available quests
  apiRouter.get("/quests", async (_req: Request, res: Response) => {
    try {
      const quests = await storage.getQuests();
      return res.json(quests);
    } catch (error) {
      console.error("Error getting quests:", error);
      return res.status(500).json({ message: "Failed to get quests" });
    }
  });

  // Get scene data
  apiRouter.get("/scenes/:sceneId", async (req: Request, res: Response) => {
    try {
      const { sceneId } = req.params;
      
      if (!sceneId) {
        return res.status(400).json({ message: "Scene ID is required" });
      }
      
      const scene = await storage.getScene(sceneId);
      
      if (!scene) {
        return res.status(404).json({ message: "Scene not found" });
      }
      
      return res.json(scene);
    } catch (error) {
      console.error("Error getting scene:", error);
      return res.status(500).json({ message: "Failed to get scene" });
    }
  });

  // Register API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
