# QuestNexus Architecture Diagram

```mermaid
graph TD
    %% Client-side components
    subgraph Frontend["Frontend (React + TypeScript)"]
        App["App.tsx\n(Main Application)"]
        Router["Router\n(wouter)"]
        Pages["Pages\n(Home, Game, NotFound)"]
        GameContainer["GameContainer\n(Main Game Layout)"]
        
        subgraph GameComponents["Game Components"]
            SceneComponents["Scene Components\n(Story, Battle, Puzzle, Decision)"]
            PlayerComponents["Player Components\n(Dashboard, Inventory)"]
            LayoutComponents["Layout Components\n(Header, Footer)"]
        end
        
        subgraph StateManagement["State Management"]
            GameContext["GameContext\n(Game State Provider)"]
            LocalStorage["LocalStorage\n(Game State Persistence)"]
        end
        
        subgraph UIComponents["UI Components"]
            ShadcnUI["Shadcn UI Components\n(Button, Card, Dialog, etc.)"]
        end
        
        subgraph ClientData["Client-side Data"]
            QuestsData["quests.ts\n(Quest Definitions)"]
            ScenesData["scenes.ts\n(Scene Definitions)"]
        end
    end
    
    %% Server-side components
    subgraph Backend["Backend (Express.js)"]
        Server["server/index.ts\n(Express Server)"]
        Routes["server/routes.ts\n(API Endpoints)"]
        Storage["server/storage.ts\n(Data Access Layer)"]
        DB["server/db.ts\n(Database Connection)"]
    end
    
    %% Database
    subgraph Database["Database (PostgreSQL)"]
        Users["Users Table"]
        GameStates["Game States Table"]
    end
    
    %% Shared components
    subgraph Shared["Shared"]
        Schema["schema.ts\n(Data Models & Validation)"]
    end
    
    %% Connections
    App --> Router
    Router --> Pages
    Pages --> GameContainer
    GameContainer --> GameComponents
    GameContainer --> StateManagement
    
    GameComponents --> StateManagement
    StateManagement --> LocalStorage
    StateManagement -.-> API
    
    GameComponents --> UIComponents
    GameComponents --> ClientData
    
    Server --> Routes
    Routes --> Storage
    Storage --> DB
    DB --> Database
    
    Storage --> ClientData
    
    Schema --> Storage
    Schema --> StateManagement
    
    %% API Connection
    subgraph API["API Endpoints"]
        GameStateAPI["GET/POST /api/game-state/:userId"]
        QuestsAPI["GET /api/quests"]
        ScenesAPI["GET /api/scenes/:sceneId"]
    end
    
    Routes --> API
    StateManagement -.-> API
end

%% Data Flow Diagram
flowchart LR
    subgraph DataFlow["Game Data Flow"]
        direction LR
        A[User Action] --> B[GameContext]
        B --> C[State Update]
        C --> D[Component Re-render]
        C --> E[LocalStorage Save]
        C -.-> F[API Call]
        F -.-> G[Database Update]
    end
```

## Architecture Overview

QuestNexus is a full-stack application built with React, TypeScript, Express.js, and PostgreSQL. It's a Percy Jackson-themed quest game where players can embark on adventures, battle monsters, solve puzzles, and make decisions that affect the story.

### Frontend Architecture

The frontend is built with React and TypeScript, using a component-based architecture:

1. **Core Application Structure**:
   - `App.tsx`: The main application component that sets up providers and routing
   - Router: Uses the lightweight `wouter` library for routing between pages
   - Pages: Home, Game, and NotFound pages

2. **Game Components**:
   - `GameContainer`: The main container for the game interface
   - Scene Components: Different types of game scenes (Story, Battle, Puzzle, Decision)
   - Player Components: Dashboard and Inventory management
   - Layout Components: Header and Footer

3. **State Management**:
   - `GameContext`: React Context API for managing game state
   - LocalStorage: Persists game state between sessions
   - API Integration: Communicates with backend for data persistence

4. **UI Components**:
   - Uses Shadcn UI components for consistent styling
   - Custom game-specific components

5. **Client-side Data**:
   - `quests.ts`: Defines available quests and their properties
   - `scenes.ts`: Defines scene content and progression logic

### Backend Architecture

The backend is built with Express.js and provides API endpoints for game data:

1. **Server Setup**:
   - `server/index.ts`: Express server configuration
   - `server/routes.ts`: API route definitions
   - `server/vite.ts`: Development server integration

2. **Data Access Layer**:
   - `server/storage.ts`: Implements data access operations
   - `server/db.ts`: Database connection and configuration

3. **API Endpoints**:
   - `/api/game-state/:userId`: Get/save game state for a user
   - `/api/quests`: Get available quests
   - `/api/scenes/:sceneId`: Get scene data

### Database Schema

The database uses PostgreSQL with Drizzle ORM:

1. **Tables**:
   - `users`: User accounts
   - `game_states`: Saved game progress for users

2. **Data Models**:
   - Player data (stats, inventory)
   - Quest progress
   - Scene state

### Shared Components

1. **Schema Definitions**:
   - `shared/schema.ts`: Defines data models and validation using Zod
   - Shared between frontend and backend for type safety

## Game Flow

1. User starts or loads a game
2. Game state is initialized from localStorage or defaults
3. User selects a quest
4. Game progresses through scenes based on user actions:
   - Story scenes advance the narrative
   - Battle scenes involve combat mechanics
   - Puzzle scenes require solving riddles
   - Decision scenes offer choices that affect the story path
5. Game state is updated and saved after each action
6. Quest completion unlocks new quests

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Context API
- **Routing**: wouter
- **Validation**: Zod
- **Build Tools**: Vite, esbuild
