import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function MusicControls() {
  const { isMuted, toggleMute, volume, setVolume } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-2 rounded hover:bg-primary-light relative"
          title="Music Controls"
        >
          <span className="material-icons">
            {isMuted ? 'volume_off' : volume > 0.5 ? 'volume_up' : 'volume_down'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium text-center">Music Settings</h4>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleMute}
              className="w-24"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <div className="flex-1 flex items-center">
              <span className="material-icons text-muted-foreground mr-2">
                volume_down
              </span>
              <Slider
                defaultValue={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                disabled={isMuted}
                className="flex-1"
              />
              <span className="material-icons text-muted-foreground ml-2">
                volume_up
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}