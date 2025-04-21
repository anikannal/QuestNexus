import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  playerData: jsonb("player_data").notNull(),
  questProgress: jsonb("quest_progress").notNull(),
  currentScene: jsonb("current_scene").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Schema for player data structure
export const playerSchema = z.object({
  name: z.string(),
  godParent: z.string(),
  level: z.number(),
  xp: z.number(),
  health: z.number(),
  maxHealth: z.number(),
  energy: z.number(),
  maxEnergy: z.number(),
  drachmas: z.number(),
  inventory: z.object({
    weapons: z.array(z.object({
      id: z.string(),
      name: z.string(),
      attack: z.number(),
      durability: z.number(),
      description: z.string().optional(),
      cost: z.number().optional(),
      type: z.string().optional(),
    })),
    powers: z.array(z.object({
      id: z.string(),
      name: z.string(),
      damage: z.number().optional(),
      heal: z.number().optional(),
      energyCost: z.number(),
      description: z.string().optional(),
      type: z.string().optional(),
    })),
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      heal: z.number().optional(),
      damage: z.number().optional(),
      effect: z.string().optional(),
      quantity: z.number(),
      description: z.string().optional(),
      type: z.string().optional(),
    })),
    gems: z.array(z.object({
      id: z.string(),
      name: z.string(),
      effect: z.string(),
      power: z.number(),
      quantity: z.number(),
    })).optional(),
  }),
});

// Schema for quest progress
export const questProgressSchema = z.object({
  completed: z.array(z.number()),
  current: z.number().nullable(),
  available: z.array(z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(["available", "locked", "completed"]),
  })),
});

// Schema for current scene
export const sceneSchema = z.object({
  type: z.enum(["story", "puzzle", "battle", "decision"]),
  id: z.string(),
  questId: z.number(),
  currentPanel: z.number().optional(),
  totalPanels: z.number().optional(),
  progress: z.number().optional(),
  decision: z.string().optional(),
  attempted: z.number().optional(),
});

// Game state schema
export const gameStateSchema = z.object({
  player: playerSchema,
  quests: questProgressSchema,
  currentScene: sceneSchema,
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;

// Game-specific types
export type Player = z.infer<typeof playerSchema>;
export type QuestProgress = z.infer<typeof questProgressSchema>;
export type SceneState = z.infer<typeof sceneSchema>;
export type GameStateData = z.infer<typeof gameStateSchema>;
