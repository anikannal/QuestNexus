import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useGameContext } from './GameContext';

interface AudioContextProps {
  isMuted: boolean;
  toggleMute: () => void;
  playMusic: (type: string) => void;
  playSound: (type: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const defaultContext: AudioContextProps = {
  isMuted: false,
  toggleMute: () => {},
  playMusic: () => {},
  playSound: () => {},
  volume: 0.5,
  setVolume: () => {},
};

const AudioContext = createContext<AudioContextProps>(defaultContext);

// Available music tracks
const musicTracks = {
  main: '/music/main-theme.mp3',
  camp: '/music/camp-halfblood.mp3',
  battle: '/music/battle.mp3',
  puzzle: '/music/puzzle.mp3',
  victory: '/music/victory.mp3',
  story: '/music/story.mp3',
};

// Available sound effects
const soundEffects = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  fail: '/sounds/fail.mp3',
  levelUp: '/sounds/level-up.mp3',
  damage: '/sounds/damage.mp3',
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem('isMuted') === 'true' ? true : false
  );
  const [volume, setVolume] = useState(
    parseFloat(localStorage.getItem('volume') || '0.5')
  );
  const [currentMusic, setCurrentMusic] = useState<HTMLAudioElement | null>(null);
  const { gameState } = useGameContext();

  // Create audio elements for each track when the component mounts
  useEffect(() => {
    const audioElements: { [key: string]: HTMLAudioElement } = {};
    
    // Preload music tracks
    Object.entries(musicTracks).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = volume;
      audioElements[key] = audio;
    });
    
    return () => {
      // Clean up audio elements
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Automatically change music based on scene type
  useEffect(() => {
    if (gameState.currentScene.type) {
      playMusic(gameState.currentScene.type);
    } else if (gameState.quests.current === null) {
      playMusic('camp');
    }
  }, [gameState.currentScene.type, gameState.quests.current]);

  // Update volume and mute state in localStorage
  useEffect(() => {
    localStorage.setItem('isMuted', isMuted.toString());
    if (currentMusic) {
      currentMusic.muted = isMuted;
    }
  }, [isMuted, currentMusic]);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
    if (currentMusic) {
      currentMusic.volume = volume;
    }
  }, [volume, currentMusic]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playMusic = (type: string) => {
    if (currentMusic) {
      currentMusic.pause();
    }

    let musicType = type;
    
    // Map scene types to music types
    switch (type) {
      case 'story':
        musicType = 'story';
        break;
      case 'battle':
        musicType = 'battle';
        break;
      case 'puzzle':
        musicType = 'puzzle';
        break;
      case 'decision':
        musicType = 'story';
        break;
      case 'camp':
        musicType = 'camp';
        break;
      default:
        musicType = 'main';
    }

    try {
      const audio = new Audio(musicTracks[musicType as keyof typeof musicTracks] || musicTracks.main);
      audio.loop = true;
      audio.volume = volume;
      audio.muted = isMuted;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setCurrentMusic(audio);
          })
          .catch(error => {
            console.error("Error playing music:", error);
          });
      }
    } catch (error) {
      console.error("Error creating audio element:", error);
    }
  };

  const playSound = (type: string) => {
    if (isMuted) return;
    
    try {
      const soundSrc = soundEffects[type as keyof typeof soundEffects];
      if (!soundSrc) return;
      
      const audio = new Audio(soundSrc);
      audio.volume = volume;
      audio.play().catch(error => {
        console.error("Error playing sound effect:", error);
      });
    } catch (error) {
      console.error("Error creating sound effect:", error);
    }
  };

  const value: AudioContextProps = {
    isMuted,
    toggleMute,
    playMusic,
    playSound,
    volume,
    setVolume,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};