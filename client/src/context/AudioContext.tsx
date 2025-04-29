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
      // Check if we're in a browser environment
      if (typeof window === 'undefined') return;
      
      const trackPath = musicTracks[musicType as keyof typeof musicTracks] || musicTracks.main;
      // Add a cache-busting parameter to avoid browser caching issues during development
      const audio = new Audio(`${trackPath}?v=${Date.now()}`);
      audio.loop = true;
      audio.volume = volume;
      audio.muted = isMuted;
      
      // Add event listener for when the file is ready to play
      audio.addEventListener('canplaythrough', () => {
        console.log(`Music track ready: ${musicType}`);
      });
      
      // Add error handler for the audio
      audio.addEventListener('error', (e) => {
        console.warn(`Music file not found or cannot be played: ${musicType}`, e);
        // We'll set the current music even if there's an error to maintain state consistency
        setCurrentMusic(audio);
      });
      
      // Try to play the audio file
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Now playing: ${musicType}`);
            setCurrentMusic(audio);
          })
          .catch(error => {
            console.log("Browser blocked autoplay or audio file issue:", error);
            // Still set the current music so we can track its state
            setCurrentMusic(audio);
          });
      } else {
        // If play() didn't return a promise (older browsers)
        setCurrentMusic(audio);
      }
    } catch (error) {
      console.log("Error with audio playback:", error);
    }
  };

  const playSound = (type: string) => {
    if (isMuted) return;
    
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') return;
      
      const soundSrc = soundEffects[type as keyof typeof soundEffects];
      if (!soundSrc) return;
      
      // Add a cache-busting parameter to avoid browser caching issues
      const audio = new Audio(`${soundSrc}?v=${Date.now()}`);
      audio.volume = volume;
      
      // Add error handler
      audio.addEventListener('error', (e) => {
        console.warn(`Sound effect not found or cannot be played: ${type}`, e);
      });
      
      audio.play().catch(error => {
        console.log("Sound effect playback issue:", error);
      });
    } catch (error) {
      console.log("Error with sound effect playback:", error);
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