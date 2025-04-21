import { users, gameStates, type User, type InsertUser, type GameState, type InsertGameState } from "@shared/schema";
import quests from "../client/src/data/quests";
import scenes from "../client/src/data/scenes";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGameState(userId: number): Promise<any | undefined>;
  saveGameState(userId: number, gameState: Partial<InsertGameState>): Promise<any>;
  getQuests(): Promise<any[]>;
  getScene(sceneId: string): Promise<any | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // In-memory cache for quests and scenes since they're static
  private quests: any[];
  private scenes: Map<string, any>; // sceneId -> scene

  constructor() {
    this.quests = quests;
    this.scenes = new Map();
    
    // Initialize scenes from imported data
    scenes.forEach(scene => {
      this.scenes.set(scene.id, scene);
    });
  }

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

  async getGameState(userId: number): Promise<any | undefined> {
    const [gameState] = await db
      .select()
      .from(gameStates)
      .where(eq(gameStates.userId, userId));
    
    if (!gameState) return undefined;
    
    // Format the response to match the expected game state structure in the client
    return {
      player: gameState.playerData,
      quests: gameState.questProgress,
      currentScene: gameState.currentScene,
      lastSaved: gameState.updatedAt
    };
  }

  async saveGameState(userId: number, gameState: Partial<InsertGameState>): Promise<any> {
    // Add timestamp for when state was updated
    const updatedState = {
      ...gameState,
      userId,
      updatedAt: new Date().toISOString()
    };
    
    // Check if game state already exists for this user
    const existingState = await this.getGameState(userId);
    
    let result;
    if (existingState) {
      // Update existing game state
      [result] = await db
        .update(gameStates)
        .set({
          playerData: updatedState.playerData,
          questProgress: updatedState.questProgress,
          currentScene: updatedState.currentScene,
          updatedAt: updatedState.updatedAt
        })
        .where(eq(gameStates.userId, userId))
        .returning();
    } else {
      // Create new game state
      [result] = await db
        .insert(gameStates)
        .values({
          userId: updatedState.userId,
          playerData: updatedState.playerData,
          questProgress: updatedState.questProgress,
          currentScene: updatedState.currentScene,
          updatedAt: updatedState.updatedAt
        })
        .returning();
    }
    
    // Format the response to match the expected game state structure in the client
    return {
      player: result.playerData,
      quests: result.questProgress,
      currentScene: result.currentScene,
      lastSaved: result.updatedAt
    };
  }

  async getQuests(): Promise<any[]> {
    return this.quests;
  }

  async getScene(sceneId: string): Promise<any | undefined> {
    return this.scenes.get(sceneId);
  }
}

export const storage = new DatabaseStorage();
