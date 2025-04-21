import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/GameContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryScreenProps {
  onClose: () => void;
}

export default function InventoryScreen({ onClose }: InventoryScreenProps) {
  const { gameState } = useGameContext();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("weapons");
  
  const { weapons, powers, items } = gameState.player.inventory;
  
  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
  };
  
  return (
    <div id="inventoryScreen" className="bg-white/90 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="border-b border-stone/20 pb-2 mb-6 flex justify-between items-center">
        <h2 className="font-heading text-xl text-primary">Your Inventory</h2>
        <Button 
          variant="ghost"
          className="text-stone hover:text-primary"
          onClick={onClose}
        >
          <span className="material-icons">close</span>
        </Button>
      </div>
      
      <Tabs defaultValue="weapons" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b border-stone/20 w-full justify-start mb-6">
          <TabsTrigger
            value="weapons"
            className="px-4 py-2 font-accent data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
          >
            Weapons
          </TabsTrigger>
          <TabsTrigger
            value="powers"
            className="px-4 py-2 font-accent data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
          >
            Powers
          </TabsTrigger>
          <TabsTrigger
            value="items"
            className="px-4 py-2 font-accent data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
          >
            Items
          </TabsTrigger>
          <TabsTrigger
            value="collectibles"
            className="px-4 py-2 font-accent data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
          >
            Collectibles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weapons" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {weapons.map(weapon => (
              <div 
                key={weapon.id}
                className={`inventory-item bg-parchment rounded-lg overflow-hidden shadow-md ${selectedItem?.id === weapon.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelectItem(weapon)}
              >
                <div className="h-32 bg-stone/10 flex items-center justify-center">
                  <div className="text-center text-stone/60">
                    <span className="material-icons text-3xl">sword</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-accent text-primary">{weapon.name}</h4>
                  <p className="text-xs text-stone mt-1">{weapon.description || "A weapon for combat."}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-[#f44336]">ATK: {weapon.attack}</span>
                    <span className="text-accent">DUR: {weapon.durability}/100</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty weapon slot placeholder */}
            <div className="inventory-item bg-parchment/50 rounded-lg overflow-hidden shadow-md opacity-50">
              <div className="h-32 bg-stone/10 flex items-center justify-center">
                <div className="text-center text-stone/60">
                  <span className="material-icons text-3xl">help_outline</span>
                  <p className="text-xs">Unknown Weapon</p>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-accent text-stone">???</h4>
                <p className="text-xs text-stone mt-1">Complete more quests to discover weapons.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="powers" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {powers.map(power => (
              <div 
                key={power.id}
                className={`inventory-item bg-parchment rounded-lg overflow-hidden shadow-md ${selectedItem?.id === power.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelectItem(power)}
              >
                <div className="h-32 bg-stone/10 flex items-center justify-center">
                  <div className="text-center text-stone/60">
                    <span className="material-icons text-3xl">auto_fix_high</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-accent text-primary">{power.name}</h4>
                  <p className="text-xs text-stone mt-1">{power.description || "A special ability."}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    {power.damage ? (
                      <span className="text-[#f44336]">DMG: {power.damage}</span>
                    ) : (
                      <span className="text-[#4caf50]">HEAL: {power.heal}</span>
                    )}
                    <span className="text-accent">COST: {power.energyCost}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty power slot placeholder */}
            <div className="inventory-item bg-parchment/50 rounded-lg overflow-hidden shadow-md opacity-50">
              <div className="h-32 bg-stone/10 flex items-center justify-center">
                <div className="text-center text-stone/60">
                  <span className="material-icons text-3xl">help_outline</span>
                  <p className="text-xs">Unknown Power</p>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-accent text-stone">???</h4>
                <p className="text-xs text-stone mt-1">Discover new powers as you progress.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="items" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div 
                key={item.id}
                className={`inventory-item bg-parchment rounded-lg overflow-hidden shadow-md ${selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelectItem(item)}
              >
                <div className="h-32 bg-stone/10 flex items-center justify-center">
                  <div className="text-center text-stone/60">
                    <span className="material-icons text-3xl">inventory_2</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-accent text-primary">{item.name}</h4>
                  <p className="text-xs text-stone mt-1">{item.description || "A useful item."}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    {item.heal ? (
                      <span className="text-[#4caf50]">HEAL: {item.heal}</span>
                    ) : (
                      <span className="text-[#f44336]">EFFECT: {item.effect || "Various"}</span>
                    )}
                    <span className="text-accent">QTY: {item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="collectibles" className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(gameState.player.inventory.gems || []).map((gem: any) => (
              <div 
                key={gem.id}
                className={`inventory-item bg-parchment rounded-lg overflow-hidden shadow-md ${selectedItem?.id === gem.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleSelectItem(gem)}
              >
                <div className="h-32 bg-stone/10 flex items-center justify-center">
                  <div className="text-center text-stone/60">
                    <span className="material-icons text-3xl">diamond</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-accent text-primary">{gem.name}</h4>
                  <p className="text-xs text-stone mt-1">{gem.effect}</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-accent">POWER: {gem.power}</span>
                    <span className="text-secondary">QTY: {gem.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty collectibles message if none */}
            {(!gameState.player.inventory.gems || gameState.player.inventory.gems.length === 0) && (
              <div className="col-span-full text-center p-8 bg-stone/10 rounded-lg">
                <span className="material-icons text-stone/40 text-4xl mb-2">search</span>
                <p className="font-accent text-stone/70">
                  You haven't found any magical gems or collectibles yet. Complete quests to discover them!
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Item Details */}
      <div className="mt-6 p-4 bg-white/70 rounded-lg border border-stone/20">
        <h3 className="font-heading text-lg text-primary mb-2">Item Details</h3>
        {selectedItem ? (
          <div>
            <h4 className="font-accent text-primary mb-1">{selectedItem.name}</h4>
            <p className="text-sm text-stone mb-2">{selectedItem.description || "No additional details available."}</p>
            {selectedItem.effect && <p className="text-xs text-accent">Effect: {selectedItem.effect}</p>}
          </div>
        ) : (
          <p className="text-sm text-stone mb-4">Select an item to view its details and options.</p>
        )}
        <p className="italic text-xs text-stone/70 mt-4">
          Tip: Some weapons have special abilities that can be unlocked by collecting certain gems or completing specific quests.
        </p>
      </div>
    </div>
  );
}
