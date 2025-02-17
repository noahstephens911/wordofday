import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BookOpenCheck, Sparkles, BookmarkIcon, Library, GraduationCap, Settings } from 'lucide-react';
import { WordCard } from './components/WordCard';
import { FavoritesList } from './components/FavoritesList';
import { WordLibrary } from './components/WordLibrary';
import { FlashCards } from './components/FlashCards';
import { useFavorites } from './hooks/useFavorites';
import { words } from './data/words';
import type { Word } from './types';

// Add styles for permanent kitten
const permanentKittenStyles = `
  .permanent-kitten {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 80px;
    height: 80px;
    z-index: 50;
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(0 0 5px rgba(0,0,0,0.2));
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .permanent-kitten:hover {
    transform: scale(1.2) rotate(-5deg);
  }

  .permanent-kitten img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }

  .pill-trail {
    position: fixed;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 10px;
    pointer-events: none;
    animation: fallAndFade 1s ease-out forwards;
    z-index: 50;
  }

  @keyframes fallAndFade {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(20px) scale(0.3);
      opacity: 0;
    }
  }
`;

function getRandomWord(): Word {
  return words[Math.floor(Math.random() * words.length)];
}

type View = 'daily' | 'favorites' | 'library' | 'flashcards' | 'settings' | 'support';

function App() {
  const [currentWord, setCurrentWord] = useState<Word>(getRandomWord());
  const [currentView, setCurrentView] = useState<View>('daily');
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);
  const trailCount = useRef(0);

  // Add permanent kitten state
  const [permanentKitten] = useState({
    x: window.innerWidth - 100,
    y: window.innerHeight - 100,
    image: 'https://placekitten.com/80/80'
  });

  // Add breathing reminder state
  const [showBreathingReminder, setShowBreathingReminder] = useState(false);
  const sirenSound1 = useRef<HTMLAudioElement | null>(null);
  const sirenSound2 = useRef<HTMLAudioElement | null>(null);
  const sirenSound3 = useRef<HTMLAudioElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNewWord = useCallback(() => {
    setCurrentWord(getRandomWord());
  }, []);

  const handleToggleFavorite = useCallback((word: Word) => {
    if (isFavorite(word.word)) {
      removeFavorite(word.word);
    } else {
      addFavorite(word);
    }
  }, [addFavorite, removeFavorite, isFavorite]);

  // Add mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.5) { // Only create trail 50% of the time for performance
        const newTrail = {
          id: trailCount.current++,
          x: e.clientX - 10, // Center the pill
          y: e.clientY - 10
        };
        
        setTrails(prev => [...prev, newTrail]);
        
        // Remove trail after animation
        setTimeout(() => {
          setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Add bang sound effect for settings
  useEffect(() => {
    let timeoutId: number;
    
    if (currentView === 'settings') {
      // Create audio element for the bang sound
      const bangSound = new Audio('https://www.myinstants.com/media/sounds/vine-boom.mp3');
      bangSound.volume = 1.0; // Full volume for maximum effect
      
      // Play the sound after 3.5 seconds
      timeoutId = window.setTimeout(() => {
        bangSound.play();
      }, 3500);
    }
    
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [currentView]);

  // Initialize siren sounds
  useEffect(() => {
    sirenSound1.current = new Audio('https://www.myinstants.com/media/sounds/emergency-alarm-with-reverb-29431.mp3');
    sirenSound2.current = new Audio('https://www.myinstants.com/media/sounds/nuclear-alarm.mp3');
    sirenSound3.current = new Audio('https://www.myinstants.com/media/sounds/air-raid-siren-01.mp3');
    
    // Set volumes for balance
    if (sirenSound1.current) sirenSound1.current.volume = 1.0;
    if (sirenSound2.current) sirenSound2.current.volume = 0.8;
    if (sirenSound3.current) sirenSound3.current.volume = 0.9;
    
    return () => {
      [sirenSound1.current, sirenSound2.current, sirenSound3.current].forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
      sirenSound1.current = null;
      sirenSound2.current = null;
      sirenSound3.current = null;
    };
  }, []);

  // Add breathing reminder effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowBreathingReminder(true);
      // Play all siren sounds
      [sirenSound1.current, sirenSound2.current, sirenSound3.current].forEach(sound => {
        if (sound) {
          sound.currentTime = 0;
          sound.play();
        }
      });
      
      // Hide reminder and stop sirens after 3 seconds
      setTimeout(() => {
        setShowBreathingReminder(false);
        [sirenSound1.current, sirenSound2.current, sirenSound3.current].forEach(sound => {
          if (sound) {
            sound.pause();
          }
        });
      }, 3000);
    }, 60000); // Changed from 10000 to 60000 (1 minute)

    return () => {
      clearInterval(intervalId);
      [sirenSound1.current, sirenSound2.current, sirenSound3.current].forEach(sound => {
        if (sound) {
          sound.pause();
        }
      });
    };
  }, []);

  // Add effect to control video playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // This will make it play at half speed
    }
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center p-8">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
        src="Spacebeam.mp4"
      />
      
      {/* Overlay to ensure text readability */}
      <div className="fixed inset-0 bg-black/50 -z-10" />

      {/* Breathing reminder */}
      {showBreathingReminder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-500">
          <div className="bg-[#1a1a1a]/90 border border-[#FFE81F] rounded-3xl p-12 shadow-[0_0_50px_rgba(255,232,31,0.3)] transform scale-110 animate-float">
            <p className="text-4xl font-bold text-[#FFE81F] text-center mb-4 font-starwars">
              Use The Force To Breathe
            </p>
            <div className="w-24 h-24 mx-auto bg-[#FFE81F] rounded-full animate-pulse shadow-[0_0_30px_rgba(255,232,31,0.5)]" />
          </div>
        </div>
      )}

      {/* BB-8 droid */}
      <div
        className="bb8-droid animate-float"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: '80px',
          height: '80px',
          backgroundImage: `url('../assets/bb8.png')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: 50,
          cursor: 'pointer',
          filter: 'drop-shadow(0 0 10px rgba(255,232,31,0.3))'
        }}
      />

      {/* Pill trails */}
      {trails.map(trail => (
        <div
          key={trail.id}
          className="pill-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
          }}
        />
      ))}

      <header className="relative mb-16 text-center animate-float">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 text-[#FFE81F] opacity-75 animate-spin-slow">★</div>
        </div>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-[#1a1a1a]/80 backdrop-blur-sm p-4 rounded-2xl border border-[#FFE81F] shadow-[0_0_30px_rgba(255,232,31,0.2)]">
            <BookOpenCheck className="w-12 h-12 text-[#FFE81F]" />
          </div>
          <h1 className="text-5xl font-bold text-[#FFE81F] tracking-tight font-starwars">
            Jedi Archives
          </h1>
        </div>
        <p className="text-lg text-[#FFE81F]/80 max-w-md mx-auto font-starwars">
          Expand your knowledge of the Force, one word at a time
        </p>
        <div className="flex justify-center gap-6 mb-12">
          <button
            onClick={() => setCurrentView('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
              currentView === 'daily' 
                ? 'bg-[#FFE81F]/10 text-[#FFE81F] border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.3)]' 
                : 'text-[#FFE81F]/70 border-[#FFE81F]/30 hover:border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.2)]'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Daily Word
          </button>
          <button
            onClick={() => setCurrentView('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
              currentView === 'favorites' 
                ? 'bg-[#FFE81F]/10 text-[#FFE81F] border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.3)]' 
                : 'text-[#FFE81F]/70 border-[#FFE81F]/30 hover:border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.2)]'
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
            Holocron
          </button>
          <button
            onClick={() => setCurrentView('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
              currentView === 'library' 
                ? 'bg-[#FFE81F]/10 text-[#FFE81F] border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.3)]' 
                : 'text-[#FFE81F]/70 border-[#FFE81F]/30 hover:border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.2)]'
            }`}
          >
            <Library className="w-5 h-5" />
            Archives
          </button>
          <button
            onClick={() => setCurrentView('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
              currentView === 'flashcards' 
                ? 'bg-[#FFE81F]/10 text-[#FFE81F] border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.3)]' 
                : 'text-[#FFE81F]/70 border-[#FFE81F]/30 hover:border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.2)]'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            Training
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border group ${
              currentView === 'settings' 
                ? 'bg-[#FF0000]/20 text-[#FF0000] border-[#FF0000] shadow-[0_0_20px_rgba(255,0,0,0.3)]' 
                : 'text-[#FFE81F]/70 border-[#FFE81F]/30 hover:text-[#FF0000] hover:border-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]'
            }`}
          >
            <Settings className={`w-5 h-5 transition-transform duration-1000 ${
              currentView === 'settings' ? 'animate-spin' : 'group-hover:rotate-180'
            }`} />
            Dark Side
          </button>
          <button
            onClick={() => setCurrentView('support')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
              currentView === 'support' 
                ? 'bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50] shadow-[0_0_20px_rgba(76,175,80,0.3)]' 
                : 'text-[#FFE81F]/70 border-[#FFE81F]/30 hover:border-[#4CAF50] hover:shadow-[0_0_20px_rgba(76,175,80,0.2)]'
            }`}
          >
            <span className="w-5 h-5 text-xl">⚔️</span>
            Join The Alliance
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFE81F]/5 to-[#4CAF50]/5 opacity-10 blur-3xl rounded-full transform -rotate-12" />
        
        {currentView === 'daily' && (
          <WordCard 
            word={currentWord} 
            onNewWord={handleNewWord}
            onToggleFavorite={() => handleToggleFavorite(currentWord)}
            isFavorite={isFavorite(currentWord.word)}
          />
        )}
        
        {currentView === 'favorites' && (
          <FavoritesList 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavorite}
            onRemove={removeFavorite}
          />
        )}
        
        {currentView === 'library' && (
          <WordLibrary 
            words={words}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        
        {currentView === 'flashcards' && (
          <FlashCards />
        )}
        
        {currentView === 'settings' && (
          <div className="fixed inset-0 z-50 bg-black">
            <video
              className="w-full h-full object-cover"
              src="jumpscare%20video.mp4"
              autoPlay
              playsInline
              muted={false}
            />
            <button 
              onClick={() => setCurrentView('daily')}
              className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-50 text-xl font-bold"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        )}

        {currentView === 'support' && (
          <div className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-2xl p-8 border border-[#FFE81F] shadow-[0_0_30px_rgba(255,232,31,0.2)]">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-[#FFE81F] mb-4 font-starwars">Join The Rebel Alliance ⚔️</h2>
              <p className="text-[#FFE81F]/80 max-w-2xl mx-auto">
                Help us maintain balance in the Force by supporting our mission to preserve and share knowledge across the galaxy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-xl border border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.2)] hover:shadow-[0_0_30px_rgba(255,232,31,0.3)] transition-all">
                <h3 className="text-2xl font-bold text-[#FFE81F] mb-3 font-starwars">One-time Support</h3>
                <p className="text-[#FFE81F]/70 mb-4">Support the Rebellion with a one-time contribution</p>
                <button className="w-full py-2 px-4 bg-[#FFE81F]/10 text-[#FFE81F] rounded-lg border border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.3)] transition-all">
                  Donate Credits 💫
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-xl border border-[#4CAF50] shadow-[0_0_20px_rgba(76,175,80,0.2)] hover:shadow-[0_0_30px_rgba(76,175,80,0.3)] transition-all">
                <h3 className="text-2xl font-bold text-[#4CAF50] mb-3 font-starwars">Jedi Council</h3>
                <p className="text-[#FFE81F]/70 mb-4">Become a member of the Jedi Council</p>
                <button className="w-full py-2 px-4 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg border border-[#4CAF50] hover:shadow-[0_0_20px_rgba(76,175,80,0.3)] transition-all">
                  Join Now ⚔️
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-xl border border-[#FFE81F] shadow-[0_0_20px_rgba(255,232,31,0.2)] hover:shadow-[0_0_30px_rgba(255,232,31,0.3)] transition-all">
                <h3 className="text-2xl font-bold text-[#FFE81F] mb-3 font-starwars">Rebel Gear</h3>
                <p className="text-[#FFE81F]/70 mb-4">Get official Rebel Alliance merchandise</p>
                <button className="w-full py-2 px-4 bg-[#FFE81F]/10 text-[#FFE81F] rounded-lg border border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.3)] transition-all">
                  Shop Now 🛡️
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-[#FFE81F] mb-4 font-starwars">Other Ways to Help</h3>
              <div className="flex justify-center gap-4">
                <button className="py-2 px-6 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg border border-[#1DA1F2] hover:shadow-[0_0_20px_rgba(29,161,242,0.3)] transition-all">
                  Share Intel 📡
                </button>
                <button className="py-2 px-6 bg-[#FFE81F]/10 text-[#FFE81F] rounded-lg border border-[#FFE81F] hover:shadow-[0_0_20px_rgba(255,232,31,0.3)] transition-all">
                  Star Systems ⭐
                </button>
                <button className="py-2 px-6 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg border border-[#4CAF50] hover:shadow-[0_0_20px_rgba(76,175,80,0.3)] transition-all">
                  Join Forces 🤝
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-[#FFE81F] mb-4 font-starwars">Jedi Masters ✨</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {['Obi-Wan', 'Yoda', 'Luke', 'Leia', 'Rey'].map(supporter => (
                  <div key={supporter} className="animate-float">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE81F]/20 to-[#4CAF50]/20 border border-[#FFE81F] flex items-center justify-center text-[#FFE81F] font-bold text-xl mb-2 shadow-[0_0_20px_rgba(255,232,31,0.2)]">
                      {supporter[0]}
                    </div>
                    <p className="text-sm text-[#FFE81F]/70">{supporter}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center">
        <p className="text-[#FFE81F]/50 text-sm font-starwars">
          May the Force be with you, always
        </p>
      </footer>
    </div>
  );
}

export default App;