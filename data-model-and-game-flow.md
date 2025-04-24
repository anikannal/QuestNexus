# QuestNexus Data Models and Game Flow

## Data Models Diagram

```mermaid
classDiagram
    class User {
        +id: number
        +username: string
        +password: string
    }
    
    class GameState {
        +id: number
        +userId: number
        +playerData: JSON
        +questProgress: JSON
        +currentScene: JSON
        +updatedAt: string
    }
    
    class Player {
        +name: string
        +godParent: string
        +level: number
        +xp: number
        +health: number
        +maxHealth: number
        +energy: number
        +maxEnergy: number
        +drachmas: number
        +inventory: Inventory
    }
    
    class Inventory {
        +weapons: Weapon[]
        +powers: Power[]
        +items: Item[]
        +gems: Gem[]
    }
    
    class Weapon {
        +id: string
        +name: string
        +attack: number
        +durability: number
        +description: string
        +cost: number
        +type: string
    }
    
    class Power {
        +id: string
        +name: string
        +damage: number
        +heal: number
        +energyCost: number
        +description: string
        +type: string
    }
    
    class Item {
        +id: string
        +name: string
        +heal: number
        +damage: number
        +effect: string
        +quantity: number
        +description: string
        +type: string
    }
    
    class Gem {
        +id: string
        +name: string
        +effect: string
        +power: number
        +quantity: number
    }
    
    class QuestProgress {
        +completed: number[]
        +current: number
        +available: AvailableQuest[]
    }
    
    class AvailableQuest {
        +id: number
        +title: string
        +status: string
    }
    
    class SceneState {
        +type: string
        +id: string
        +questId: number
        +currentPanel: number
        +totalPanels: number
        +progress: number
        +decision: string
        +attempted: number
    }
    
    class Quest {
        +id: number
        +title: string
        +description: string
        +recommendedLevel: number
        +estimatedTime: string
        +icon: string
        +status: string
        +startingSceneId: string
        +requiredQuestIds: number[]
    }
    
    class Scene {
        +id: string
        +type: string
        +title: string
        +questId: number
    }
    
    class StoryScene {
        +panels: Panel[]
        +nextScene: string
    }
    
    class Panel {
        +imageDescription: string
        +dialogue: string
        +narration: string
    }
    
    class PuzzleScene {
        +imageDescription: string
        +riddle: string
        +hint: string
        +correctAnswer: string
        +successMessage: string
        +failureMessage: string
        +successScene: string
        +failureScene: string
    }
    
    class BattleScene {
        +imageDescription: string
        +introText: string
        +enemy: Enemy
        +victoryText: string
        +defeatText: string
        +rewards: Rewards
        +victoryScene: string
        +defeatScene: string
    }
    
    class Enemy {
        +name: string
        +level: number
        +health: number
        +baseDamage: number
        +initialRage: number
        +description: string
    }
    
    class Rewards {
        +drachmas: number
        +xp: number
        +items: Item[]
    }
    
    class DecisionScene {
        +imageDescription: string
        +dialogue: string
        +narration: string
        +followupDialogue: string
        +choices: Choice[]
        +defaultNextScene: string
    }
    
    class Choice {
        +id: string
        +title: string
        +description: string
        +hint: string
        +nextScene: string
    }
    
    User "1" -- "1" GameState
    GameState "1" -- "1" Player
    GameState "1" -- "1" QuestProgress
    GameState "1" -- "1" SceneState
    Player "1" -- "1" Inventory
    Inventory "1" -- "*" Weapon
    Inventory "1" -- "*" Power
    Inventory "1" -- "*" Item
    Inventory "1" -- "*" Gem
    QuestProgress "1" -- "*" AvailableQuest
    Scene <|-- StoryScene
    Scene <|-- PuzzleScene
    Scene <|-- BattleScene
    Scene <|-- DecisionScene
    StoryScene "1" -- "*" Panel
    BattleScene "1" -- "1" Enemy
    BattleScene "1" -- "1" Rewards
    DecisionScene "1" -- "*" Choice
```

## Game Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> Home
    Home --> NewGame: Start New Game
    Home --> LoadGame: Continue Game
    
    NewGame --> QuestSelection: Initialize Game State
    LoadGame --> QuestSelection: Load Saved State
    
    QuestSelection --> StoryScene: Select Quest
    
    state "Scene Flow" as SceneFlow {
        StoryScene --> NextScene: Complete Scene
        
        state "NextScene" as NextScene {
            state "Scene Type Check" as check
            check --> StoryScene: If next is Story
            check --> PuzzleScene: If next is Puzzle
            check --> BattleScene: If next is Battle
            check --> DecisionScene: If next is Decision
            check --> QuestComplete: If next is "end"
        }
        
        PuzzleScene --> NextScene: Success/Failure
        BattleScene --> NextScene: Victory/Defeat
        DecisionScene --> NextScene: Choose Option
    }
    
    QuestComplete --> QuestSelection: Unlock Next Quest
    QuestSelection --> [*]: All Quests Completed
```

## Game Mechanics

### Player Progression

1. **Experience and Leveling**
   - Players gain XP from completing battles and quests
   - When XP threshold is reached (level * 100), player levels up
   - Leveling up increases max health by 10 and max energy by 5
   - Health and energy are fully restored on level up

2. **Inventory Management**
   - Players can collect and use various items:
     - Weapons: Used in battle to deal damage
     - Powers: Special abilities that cost energy
     - Items: Consumables for healing or dealing damage
     - Gems: Special collectibles with unique effects

3. **Combat System**
   - Turn-based combat with the following actions:
     - Attack with weapons (costs energy)
     - Use powers (costs energy)
     - Use items (no energy cost)
     - Dodge (recovers energy)
   - Enemy has health and rage meters
   - Enemy rage increases with each turn, making attacks stronger

### Quest Structure

1. **Quest Progression**
   - Quests are unlocked sequentially
   - Each quest has a recommended player level
   - Completing a quest unlocks the next quest in the sequence

2. **Scene Types**
   - **Story Scenes**: Narrative progression with dialogue and narration
   - **Puzzle Scenes**: Riddles that test the player's problem-solving skills
   - **Battle Scenes**: Combat encounters with enemies
   - **Decision Scenes**: Choices that affect the story path

3. **Branching Paths**
   - Decisions and puzzle/battle outcomes can lead to different scenes
   - Multiple paths through each quest
   - Success/failure states affect rewards and story progression

## Data Persistence

1. **Local Storage**
   - Game state is saved to browser localStorage after each significant action
   - Includes player stats, inventory, quest progress, and current scene

2. **Server Storage**
   - Game state can be saved to the server database (currently commented out in code)
   - Uses PostgreSQL with Drizzle ORM
   - Enables potential for cross-device play and online features
  

```mermaid
graph TD
  A1[lightning-thief-intro] --> A2[lightning-thief-quest-announcement]
  A2 --> A3[oracle-riddle]
  A3 --> B1[journey-west-decision]
  A3 --> B1

%% success and failure both go here

  B1 --> C1[tunnel-riddle]
  B1 --> C2[minotaur-battle]

  C1 --> D1[underworld-entrance]
  C1 --> C2

%% failure from puzzle leads to battle

  C2 --> D1

%% victory
  C2 --> E1[recovery-camp]
  E1 --> D1

  D1 --> F1[hades-confrontation]
  F1 --> G1[betrayal-revealed]
  F1 --> G2[helmet-discovery]

  G1 --> H1[beach-battle]
  G2 --> H1

  H1 --> I1[olympus-return]
  I1 --> J1[end]

```
