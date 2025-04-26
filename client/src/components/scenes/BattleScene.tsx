import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { useToast } from "@/hooks/use-toast";

export default function BattleScene() {
  const { gameState, completeScene, updatePlayerStats } = useGameContext();
  const [battleStage, setBattleStage] = useState(1); // 1: Intro, 2: Combat, 3: Outcome
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [enemyRage, setEnemyRage] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(gameState.player.health);
  const [playerEnergy, setPlayerEnergy] = useState(gameState.player.energy);
  const [turnCounter, setTurnCounter] = useState(1);
  const [battleLog, setBattleLog] = useState("Select a weapon, power, or item to use against the enemy.");
  const [enemyAction, setEnemyAction] = useState("The enemy prepares to attack!");
  const [battleResult, setBattleResult] = useState<"victory" | "defeat" | null>(null);
  const [scene, setScene] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Find the current scene data
    const currentSceneId = gameState.currentScene.id;
    
    // In a real implementation, this would fetch from the API
    import("@/data/scenes").then(module => {
      const sceneData = module.default.find((s: any) => s.id === currentSceneId);
      if (sceneData) {
        setScene(sceneData);
        
        // Initialize enemy stats from scene data
        if (sceneData.enemy) {
          setEnemyHealth(sceneData.enemy.health);
          setEnemyRage(sceneData.enemy.initialRage || 0);
        }
      }
    });
    
    // Initialize player stats from gameState
    setPlayerHealth(gameState.player.health);
    setPlayerEnergy(gameState.player.energy);
  }, [gameState.currentScene, gameState.player]);
  
  if (!scene) {
    return <div className="text-center p-8">Loading battle...</div>;
  }
  
  const handleStartBattle = () => {
    setBattleStage(2);
  };
  
  const selectAction = (actionId: string) => {
    setSelectedAction(actionId);
  };
  
  const executeAction = () => {
    if (!selectedAction) return;
    
    let actionResult = '';
    let energyCost = 0;
    let damageToEnemy = 0;
    let healAmount = 0;
    
    // Find the action data
    const selectedWeapon = gameState.player.inventory.weapons.find(w => w.id === selectedAction);
    const selectedPower = gameState.player.inventory.powers.find(p => p.id === selectedAction);
    const selectedItem = gameState.player.inventory.items.find(i => i.id === selectedAction);
    
    // Process based on action type
    if (selectedWeapon) {
      energyCost = selectedWeapon.cost || 2;
      damageToEnemy = selectedWeapon.attack;
      actionResult = `You attack with your ${selectedWeapon.name}, dealing ${damageToEnemy} damage!`;
    } else if (selectedPower) {
      energyCost = selectedPower.energyCost;
      damageToEnemy = selectedPower.damage || 0;
      healAmount = selectedPower.heal || 0;
      
      if (damageToEnemy > 0) {
        actionResult = `You unleash ${selectedPower.name}, dealing ${damageToEnemy} damage!`;
      }
      if (healAmount > 0) {
        actionResult = `You use ${selectedPower.name}, healing yourself for ${healAmount} health!`;
      }
    } else if (selectedItem) {
      energyCost = 0;
      healAmount = selectedItem.heal || 0;
      damageToEnemy = selectedItem.damage || 0;
      
      if (healAmount > 0) {
        actionResult = `You use ${selectedItem.name}, restoring ${healAmount} health!`;
      }
      if (damageToEnemy > 0) {
        actionResult = `You use ${selectedItem.name}, dealing ${damageToEnemy} damage!`;
      }
    } else if (selectedAction === "dodge") {
      energyCost = -2; // Gain energy
      actionResult = "You dodge the attack and recover 2 energy!";
    }
    
    // Apply costs and effects
    const newPlayerEnergy = Math.min(Math.max(playerEnergy - energyCost, 0), gameState.player.maxEnergy);
    setPlayerEnergy(newPlayerEnergy);
    
    if (healAmount > 0) {
      const newPlayerHealth = Math.min(playerHealth + healAmount, gameState.player.maxHealth);
      setPlayerHealth(newPlayerHealth);
    }
    
    if (damageToEnemy > 0) {
      const newEnemyHealth = Math.max(enemyHealth - damageToEnemy, 0);
      setEnemyHealth(newEnemyHealth);
      
      // Check if enemy defeated
      if (newEnemyHealth <= 0) {
        setBattleResult("victory");
        setBattleStage(3);
        return;
      }
    }
    
    setBattleLog(actionResult);


    // Enemy turn
    setTimeout(() => {
      performEnemyAction();
    }, 1000);
  };
  
  const performEnemyAction = () => {
    // Basic enemy AI
    const enemyDamage = scene.enemy.baseDamage + Math.floor(enemyRage / 20);
    const newPlayerHealth = Math.max(playerHealth - enemyDamage, 0);
    
    setPlayerHealth(newPlayerHealth);
    setEnemyRage(enemyRage + 10); // Enemy gets more enraged each turn
    setEnemyAction(`${scene.enemy.name} attacks for ${enemyDamage} damage!`);
    
    // Check if player is defeated
    if (newPlayerHealth <= 0) {
      setBattleResult("defeat");
      setBattleStage(3);
      return;
    }
    
    // Increment turn counter
    setTurnCounter(turnCounter + 1);
    setSelectedAction(null);
  };
  
  const handleContinueAfterBattle = () => {
    // Update player stats based on battle outcome
    if (battleResult === "victory") {
      // Only update stats on victory
      updatePlayerStats({
        health: playerHealth,
        energy: playerEnergy,
        drachmas: gameState.player.drachmas + scene.rewards.drachmas,
        xp: gameState.player.xp + scene.rewards.xp
      });
      
      // If victory, add any item rewards to inventory
      if (scene.rewards.items) {
        // Would be implemented in the context
        // addItemsToInventory(scene.rewards.items);
      }
    } else {
      // On defeat, reset player health and energy to default values
      // This ensures the player starts with full health when restarting the quest
      updatePlayerStats({
        health: gameState.player.maxHealth,
        energy: gameState.player.maxEnergy
      });
      
      // Show a toast message to inform the player they're restarting the quest
      toast({
        title: "Quest Failed",
        description: "You will restart from the beginning of this quest.",
        variant: "destructive"
      });
    }
    
    // Complete the scene with the appropriate outcome
    completeScene(battleResult === "victory" ? "success" : "failure");
  };
  
  const renderBattlePanel = () => {
    switch (battleStage) {
      case 1: // Introduction
        return (
          <div id="battlePanel1" className="panel bg-parchment rounded-lg overflow-hidden shadow mb-6">
            <div className="h-96 w-full flex items-center justify-center bg-stone-100">
              <img
                src={`/${scene.imageName}.png`}
                alt={scene.imageName}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-stone/10 flex items-center justify-center">
              <div className="text-center text-stone/60">
                <p>{scene.imageDescription}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="mb-3 font-accent text-lg">{scene.introText}</p>
              <div className="text-center mt-4">
                <Button 
                  id="startBattleBtn" 
                  className="px-6 py-2 bg-[#f44336] text-white rounded-lg hover:bg-[#f44336]/80"
                  onClick={handleStartBattle}
                >
                  Begin Battle
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 2: // Combat Interface
        return (
          <div id="battlePanel2">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Enemy Stats */}
              <div className="bg-stone/10 rounded-lg p-4 flex-1 order-2 md:order-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-xl text-[#f44336]">{scene.enemy.name}</h3>
                  <div className="px-3 py-1 bg-[#f44336]/20 text-[#f44336] text-sm rounded-full">Level {scene.enemy.level}</div>
                </div>
                <div className="h-48 w-full flex items-center justify-center bg-stone-100">
                  <img
                    src={`/${scene.imageName}.png`}
                    alt={scene.imageName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-stone/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-stone/60">
                    <p>{scene.enemy.displayName || scene.enemy.name} battle stance</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Health</span>
                      <span>{enemyHealth}/{scene.enemy.health}</span>
                    </div>
                    <div className="w-full bg-stone/20 h-3 rounded-full">
                      <div 
                        className="bg-[#f44336] h-full rounded-full" 
                        style={{ width: `${(enemyHealth / scene.enemy.health) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Rage</span>
                      <span>{enemyRage}/100</span>
                    </div>
                    <div className="w-full bg-stone/20 h-3 rounded-full">
                      <div 
                        className="bg-[#ff9800] h-full rounded-full" 
                        style={{ width: `${enemyRage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 border border-stone/20 rounded-lg bg-white/50">
                  <p className="text-sm font-accent italic">{enemyAction}</p>
                </div>
              </div>
              
              {/* Battle Interface */}
              <div className="bg-parchment rounded-lg p-4 flex-1 order-1 md:order-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-lg text-primary">Your Turn</h3>
                  <div className="text-sm text-stone">
                    <span className="material-icons inline-block text-accent" style={{ fontSize: "16px" }}>update</span>
                    Turn: {turnCounter}
                  </div>
                </div>
                
                {/* Player Stats */}
                <div className="bg-white/70 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-accent text-primary text-sm">Your Stats</h4>
                    <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Hero</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Health</span>
                        <span>{playerHealth}/{gameState.player.maxHealth}</span>
                      </div>
                      <div className="w-full bg-stone/20 h-3 rounded-full">
                        <div 
                          className="bg-[#4caf50] h-full rounded-full" 
                          style={{ width: `${(playerHealth / gameState.player.maxHealth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Energy</span>
                        <span>{playerEnergy}/{gameState.player.maxEnergy}</span>
                      </div>
                      <div className="w-full bg-stone/20 h-3 rounded-full">
                        <div 
                          className="bg-[#2196f3] h-full rounded-full" 
                          style={{ width: `${(playerEnergy / gameState.player.maxEnergy) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-sm">Choose your action:</p>
                  
                  {/* Weapon Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {gameState.player.inventory.weapons.map(weapon => (
                      <div 
                        key={weapon.id}
                        className={`battle-card bg-white rounded-lg p-3 border ${selectedAction === weapon.id ? 'ring-2 ring-primary' : 'border-secondary/50'} cursor-pointer`}
                        onClick={() => selectAction(weapon.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-accent text-primary">{weapon.name}</h4>
                          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">Weapon</span>
                        </div>
                        <p className="text-xs text-stone mb-2">{weapon.description || "A balanced weapon for combat."}</p>
                        <div className="flex justify-between text-xs">
                          <span><span className="material-icons" style={{ fontSize: "14px" }}>flash_on</span> Cost: {weapon.cost || 2} Energy</span>
                          <span><span className="material-icons text-[#f44336]" style={{ fontSize: "14px" }}>gavel</span> Damage: {weapon.attack}</span>
                        </div>
                      </div>
                    ))}
                    
                    {gameState.player.inventory.powers.map(power => (
                      <div 
                        key={power.id}
                        className={`battle-card bg-white rounded-lg p-3 border ${selectedAction === power.id ? 'ring-2 ring-primary' : 'border-accent/50'} cursor-pointer`}
                        onClick={() => selectAction(power.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-accent text-primary">{power.name}</h4>
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Power</span>
                        </div>
                        <p className="text-xs text-stone mb-2">{power.description || "A special ability."}</p>
                        <div className="flex justify-between text-xs">
                          <span><span className="material-icons" style={{ fontSize: "14px" }}>flash_on</span> Cost: {power.energyCost} Energy</span>
                          {power.damage ? (
                            <span><span className="material-icons text-[#f44336]" style={{ fontSize: "14px" }}>gavel</span> Damage: {power.damage}</span>
                          ) : (
                            <span><span className="material-icons text-[#4caf50]" style={{ fontSize: "14px" }}>favorite</span> Heal: {power.heal}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {gameState.player.inventory.items.map(item => (
                      <div 
                        key={item.id}
                        className={`battle-card bg-white rounded-lg p-3 border ${selectedAction === item.id ? 'ring-2 ring-primary' : 'border-[#4caf50]/50'} cursor-pointer`}
                        onClick={() => selectAction(item.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-accent text-primary">{item.name}</h4>
                          <span className="text-xs bg-[#4caf50]/20 text-[#4caf50] px-2 py-1 rounded">Item</span>
                        </div>
                        <p className="text-xs text-stone mb-2">{item.description || "A useful item."}</p>
                        <div className="flex justify-between text-xs">
                          <span><span className="material-icons" style={{ fontSize: "14px" }}>flash_on</span> Cost: 0 Energy</span>
                          {item.heal ? (
                            <span><span className="material-icons text-[#4caf50]" style={{ fontSize: "14px" }}>favorite</span> Heal: {item.heal}</span>
                          ) : (
                            <span><span className="material-icons text-[#f44336]" style={{ fontSize: "14px" }}>gavel</span> Damage: {item.damage}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div 
                      className={`battle-card bg-white rounded-lg p-3 border ${selectedAction === "dodge" ? 'ring-2 ring-primary' : 'border-[#ff9800]/50'} cursor-pointer`}
                      onClick={() => selectAction("dodge")}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-accent text-primary">Dodge</h4>
                        <span className="text-xs bg-[#ff9800]/20 text-[#ff9800] px-2 py-1 rounded">Action</span>
                      </div>
                      <p className="text-xs text-stone mb-2">Avoid the next attack and recover some energy.</p>
                      <div className="flex justify-between text-xs">
                        <span><span className="material-icons" style={{ fontSize: "14px" }}>flash_on</span> Cost: 0 Energy</span>
                        <span><span className="material-icons text-accent" style={{ fontSize: "14px" }}>battery_charging_full</span> Gain: 2 Energy</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-accent">{battleLog}</p>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    className="px-4 py-2 bg-stone/20 text-stone rounded-lg hover:bg-stone/30"
                    onClick={() => toast({
                      title: "Enemy Details",
                      description: scene.enemy.description || `A ${scene.enemy.name.toLowerCase()} that poses a threat to your quest.`,
                    })}
                  >
                    Examine Enemy
                  </Button>
                  <Button
                    id="executeActionBtn"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
                    disabled={!selectedAction}
                    onClick={executeAction}
                  >
                    Execute Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // Outcome
        return (
          <div id="battlePanel3" className="panel bg-parchment rounded-lg overflow-hidden shadow mt-6">
            <div className="h-96 w-full flex items-center justify-center bg-stone-100">
              <img
                src={battleResult === "victory" ? `/${scene.victoryImageName}.png` : `/${scene.defeatImageName}.png`}
                alt={scene.imageName}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="bg-stone/10 flex items-center justify-center">
              <div className="text-center text-stone/60">
                <p>{battleResult === "victory" ? scene.victoryImageDescription : scene.defeatImageDescription}</p>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className={`font-heading text-xl ${battleResult === "victory" ? "text-[#4caf50]" : "text-[#f44336]"} mb-3`}>
                {battleResult === "victory" ? "Victory!" : "Defeat!"}
              </h3>
              <p className="font-accent text-lg mb-4">
                {battleResult === "victory" ? scene.victoryText : scene.defeatText}
              </p>
              
              {battleResult === "victory" && (
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="bg-white/70 rounded-lg p-3 text-center">
                    <span className="material-icons text-secondary text-2xl">toll</span>
                    <p className="text-sm font-accent mt-1">+{scene.rewards.drachmas} Drachmas</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 text-center">
                    <span className="material-icons text-accent text-2xl">auto_awesome</span>
                    <p className="text-sm font-accent mt-1">+{scene.rewards.xp} XP</p>
                  </div>
                  {scene.rewards.items && scene.rewards.items.map((item: any) => (
                    <div key={item.id} className="bg-white/70 rounded-lg p-3 text-center">
                      <span className="material-icons text-[#ff9800] text-2xl">star</span>
                      <p className="text-sm font-accent mt-1">{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                id="continueBattleBtn"
                className={`px-6 py-2 ${battleResult === "victory" ? "bg-secondary" : "bg-stone"} text-white rounded-lg hover:${battleResult === "victory" ? "bg-secondary-light" : "bg-stone/80"}`}
                onClick={handleContinueAfterBattle}
              >
                Continue Quest
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div id="battleScene" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto mb-6">
      <div className="border-b border-stone/20 pb-2 mb-4 flex justify-between items-center">
        <h2 className="font-heading text-xl text-primary">{scene.title}</h2>
        <span className="px-3 py-1 bg-[#f44336] text-white text-sm rounded-full">Battle</span>
      </div>
      
      {renderBattlePanel()}
    </div>
  );
}
