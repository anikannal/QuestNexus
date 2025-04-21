import { users, type User, type InsertUser, type GameState, type InsertGameState, playerSchema, questProgressSchema, sceneSchema } from "@shared/schema";
import quests from "../client/src/data/quests";
import scenes from "../client/src/data/scenes";

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

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameStates: Map<number, any>; // userId -> gameState
  private quests: any[];
  private scenes: Map<string, any>; // sceneId -> scene
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.gameStates = new Map();
    this.quests = quests;
    this.scenes = new Map();
    
    // Initialize scenes from imported data
    scenes.forEach(scene => {
      this.scenes.set(scene.id, scene);
    });
    
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameState(userId: number): Promise<any | undefined> {
    return this.gameStates.get(userId);
  }

  async saveGameState(userId: number, gameState: Partial<InsertGameState>): Promise<any> {
    const existingState = this.gameStates.get(userId) || {};
    const updatedState = { ...existingState, ...gameState, userId };
    
    this.gameStates.set(userId, updatedState);
    
    // Format the response to match the expected game state structure in the client
    return {
      player: updatedState.playerData,
      quests: updatedState.questProgress,
      currentScene: updatedState.currentScene,
      lastSaved: updatedState.updatedAt
    };
  }

  async getQuests(): Promise<any[]> {
    return this.quests;
  }

  async getScene(sceneId: string): Promise<any | undefined> {
    return this.scenes.get(sceneId);
  }
}

export const storage = new MemStorage();
