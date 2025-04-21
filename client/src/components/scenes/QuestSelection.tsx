import { useGameContext } from "@/context/GameContext";

export default function QuestSelection() {
  const { gameState, startQuest } = useGameContext();
  
  const handleQuestSelect = (questId: number) => {
    const quest = gameState.quests.available.find(q => q.id === questId);
    
    if (quest && quest.status === "available") {
      startQuest(questId);
    }
  };
  
  return (
    <div id="questSelection" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="font-heading text-2xl text-primary mb-6 border-b border-secondary pb-2">Available Quests at Camp Half-Blood</h2>
      
      {gameState.quests.available.map(quest => (
        <div 
          key={quest.id}
          className={`quest-card bg-parchment border border-stone/20 rounded-lg p-4 mb-4 cursor-pointer hover:bg-parchment/80 transition-colors ${quest.status !== "available" ? "opacity-80" : ""}`}
          onClick={() => handleQuestSelect(quest.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-heading text-xl text-primary">{quest.title}</h3>
              <p className="text-stone mt-1 font-accent">{quest.description}</p>
              <div className="flex items-center mt-3 text-sm text-stone/80">
                <span className="material-icons text-secondary mr-1" style={{ fontSize: "16px" }}>military_tech</span>
                <span>Recommended Level: {quest.recommendedLevel}</span>
                <span className="mx-3">|</span>
                <span className="material-icons text-accent mr-1" style={{ fontSize: "16px" }}>schedule</span>
                <span>Estimated Time: {quest.estimatedTime}</span>
              </div>
            </div>
            <div className="bg-secondary text-white rounded-full w-10 h-10 flex items-center justify-center">
              <span className="material-icons">{quest.icon}</span>
            </div>
          </div>
          
          {quest.status === "locked" && (
            <div className="mt-2 bg-stone/10 rounded p-2 text-sm">
              <span className="material-icons text-warning inline-block mr-1" style={{ fontSize: "16px" }}>lock</span>
              <span>Complete "{quest.requiredQuestTitle}" to unlock</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
