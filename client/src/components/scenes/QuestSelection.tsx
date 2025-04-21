import { useGameContext } from "@/context/GameContext";
import quests from "@/data/quests";
import { Button } from "@/components/ui/button";

export default function QuestSelection() {
  const { gameState, startQuest } = useGameContext();
  
  const handleQuestSelect = async (questId: number) => {
    console.log("%c=== Quest Selection Debug ===", "color: #4CAF50; font-weight: bold;");
    console.log("%cQuest ID:", "font-weight: bold;", questId);
    const questInState = gameState.quests.available.find(q => q.id === questId);
    const questDetails = quests.find(q => q.id === questId);
    console.log("%cQuest in state:", "font-weight: bold;", questInState);
    console.log("%cQuest details:", "font-weight: bold;", questDetails);
    console.log("%cCurrent game state:", "font-weight: bold;", gameState);
    
    if (!questInState || !questDetails) {
      console.error("Quest not found!");
      return;
    }
    
    if (questInState.status === "available") {
      console.log("Starting quest:", questId);
      try {
        await startQuest(questId);
        console.log("Quest started successfully");
      } catch (error) {
        console.error("Error starting quest:", error);
      }
    } else {
      console.log("Quest not available");
    }
  };
  
  // Function to begin the first available quest directly
  const startFirstAvailableQuest = () => {
    console.log("Attempting to start first available quest");
    // Find the first available quest
    const firstAvailableQuest = gameState.quests.available.find(q => q.status === "available");
    if (firstAvailableQuest) {
      console.log("Found first available quest:", firstAvailableQuest);
      startQuest(firstAvailableQuest.id);
    } else {
      console.log("No available quests found");
    }
  };
  
  return (
    <div id="questSelection" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-secondary pb-2">
        <h2 className="font-heading text-2xl text-primary">Available Quests at Camp Half-Blood</h2>
        <Button 
          className="bg-primary text-white px-4 py-2"
          onClick={startFirstAvailableQuest}
        >
          Begin First Quest
        </Button>
      </div>
      
      {gameState.quests.available.map(questState => {
        const questDetails = quests.find(q => q.id === questState.id);
        if (!questDetails) return null;
        
        return (
          <div 
            key={questState.id}
            className={`quest-card bg-parchment border border-stone/20 rounded-lg p-4 mb-4 cursor-pointer hover:bg-parchment/80 transition-colors ${questState.status !== "available" ? "opacity-80" : ""}`}
            onClick={() => handleQuestSelect(questState.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-heading text-xl text-primary">{questState.title}</h3>
                <p className="text-stone mt-1 font-accent">{questDetails.description}</p>
                <div className="flex items-center mt-3 text-sm text-stone/80">
                  <span className="material-icons text-secondary mr-1" style={{ fontSize: "16px" }}>military_tech</span>
                  <span>Recommended Level: {questDetails.recommendedLevel}</span>
                  <span className="mx-3">|</span>
                  <span className="material-icons text-accent mr-1" style={{ fontSize: "16px" }}>schedule</span>
                  <span>Estimated Time: {questDetails.estimatedTime}</span>
                </div>
              </div>
              <div className="bg-secondary text-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="material-icons">{questDetails.icon}</span>
              </div>
            </div>
            
            {questState.status === "locked" && questDetails.requiredQuestTitle && (
              <div className="mt-2 bg-stone/10 rounded p-2 text-sm">
                <span className="material-icons text-warning inline-block mr-1" style={{ fontSize: "16px" }}>lock</span>
                <span>Complete "{questDetails.requiredQuestTitle}" to unlock</span>
              </div>
            )}
            
            {questState.status === "available" && (
              <div className="mt-3 text-right">
                <Button 
                  className="bg-accent text-white px-3 py-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Starting quest:", questState.id);
                    handleQuestSelect(questState.id);
                  }}
                >
                  Begin Quest
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
