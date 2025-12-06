import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import GameUI from './components/GameUI';
import { Player } from './entities/Player';
import { Zombie } from './entities/Zombie';
import { Bullet } from './entities/Bullet';
import { Grenade } from './entities/Grenade';
import { Particle } from './entities/Particle';
import { CollisionDetection } from './systems/CollisionDetection';
import { InputManager } from './systems/InputManager';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('menu');
  const [player, setPlayer] = useState(null);
  const [zombies, setZombies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [grenades, setGrenades] = useState([]);
  const [particles, setParticles] = useState([]);
  const [score, setScore] = useState(0);
  const [inputManager] = useState(() => new InputManager());

  const createParticles = useCallback((x, y, color, count = 15) => {
    setParticles(prev => [...prev, new Particle(x, y, color, count)]);
  }, []);

  const initGame = useCallback(() => {
    const newPlayer = new Player(50, 300);
    setPlayer(newPlayer);
    setZombies([
      new Zombie(300, 300, 1),
      new Zombie(500, 300, -1),
      new Zombie(650, 300, 1),
    ]);
    setBullets([]);
    setGrenades([]);
    setParticles([]);
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  const pauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const resetGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

// Game loop
useEffect(() => {
  if (gameState !== 'playing' || !player) return;

  const gameLoop = setInterval(() => {
    if (inputManager.wasPressed('Tab')) {
      player.switchWeapon();
    }

    if (inputManager.wasPressed('c')) {
      const projectile = player.shoot();
      if (projectile.type === 'bullet') {
        setBullets(prev => [...prev, new Bullet(projectile)]);
      } else {
        setGrenades(prev => [...prev, new Grenade(projectile)]);
      }
    }

    player.update(inputManager.keys);
    // ✅ REMOVE: setPlayer({ ...player });

    setZombies(prevZombies => {
      return prevZombies.map(zombie => {
        zombie.update();
        return zombie;
      }).filter(z => z.health > 0);
    });

    setBullets(prevBullets => {
      return prevBullets.filter(bullet => {
        bullet.update();
        return !bullet.isOffScreen();
      });
    });

    setGrenades(prevGrenades => {
      return prevGrenades.filter(grenade => {
        grenade.update();
        if (grenade.shouldExplode()) {
          createParticles(grenade.x, grenade.y, 'orange', 20);
          return false;
        }
        return true;
      });
    });

    setParticles(prevParticles => {
      return prevParticles.map(p => {
        p.update();
        return p;
      }).filter(p => !p.isDone());
    });

    setBullets(prevBullets => {
      const remainingBullets = [];
      prevBullets.forEach(bullet => {
        let hit = false;
        setZombies(prevZombies => {
          return prevZombies.map(zombie => {
            if (!hit && CollisionDetection.checkAABB(bullet, zombie)) {
              const died = zombie.receiveDamage(bullet.damage);
              if (died) {
                setScore(s => s + 100);
                createParticles(zombie.x + zombie.width / 2, zombie.y + zombie.height / 2, 'green', 25);
              } else {
                createParticles(zombie.x + zombie.width / 2, zombie.y + zombie.height / 2, 'green', 5);
              }
              hit = true;
            }
            return zombie;
          });
        });
        if (!hit) {
          remainingBullets.push(bullet);
        }
      });
      return remainingBullets;
    });

    setGrenades(prevGrenades => {
      const remainingGrenades = [];
      prevGrenades.forEach(grenade => {
        let hit = false;
        setZombies(prevZombies => {
          return prevZombies.map(zombie => {
            if (!hit && CollisionDetection.checkCircleAABB(grenade, zombie)) {
              zombie.receiveDamage(grenade.damage);
              setScore(s => s + 100);
              createParticles(zombie.x + zombie.width / 2, zombie.y + zombie.height / 2, 'green', 25);
              createParticles(grenade.x, grenade.y, 'orange', 20);
              hit = true;
            }
            return zombie;
          }).filter(z => z.health > 0);
        });
        if (!hit) {
          remainingGrenades.push(grenade);
        }
      });
      return remainingGrenades;
    });

    if (!player.invincible) {
      zombies.forEach(zombie => {
        if (CollisionDetection.checkAABB(player, zombie)) {
          const died = player.receiveDamage(10);
          if (died) {
            createParticles(player.x + player.width / 2, player.y + player.height / 2, 'red', 25);
            setGameState('gameover');
          } else {
            createParticles(player.x + player.width / 2, player.y + player.height / 2, 'red', 5);
          }
          // ✅ REMOVE: setPlayer({ ...player });
        }
      });
    }

    if (zombies.length === 0) {
      setGameState('win');
    }
  }, 16);

  return () => clearInterval(gameLoop);
}, [gameState, player, zombies, bullets, grenades, inputManager, createParticles]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">
          🎮 Resident Raver - Impact.js Game Demo
        </h1>

        <GameUI
          gameState={gameState}
          player={player}
          score={score}
          zombiesAlive={zombies.length}
          onStart={startGame}
          onPause={pauseGame}
          onResume={resumeGame}
          onReset={resetGame}
        />

        <div className="mt-4 flex justify-center relative">
          <GameCanvas
            gameState={gameState}
            entities={{ player, zombies, bullets, grenades, particles }}
            onCanvasReady={() => {}}
          />

          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded">
              <div className="text-center p-8 bg-gray-800 rounded-lg">
                <h2 className="text-5xl font-bold mb-4 text-red-500">💀 GAME OVER!</h2>
                <p className="text-2xl mb-6">Final Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-green-600 rounded-lg hover:bg-green-700 text-xl font-bold transition"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {gameState === 'win' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded">
              <div className="text-center p-8 bg-gray-800 rounded-lg">
                <h2 className="text-5xl font-bold mb-4 text-green-500">🎉 YOU WIN!</h2>
                <p className="text-2xl mb-6">Score: <span className="text-yellow-400 font-bold">{score}</span></p>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 text-xl font-bold transition"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">🎯 Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-700 p-3 rounded">
              <div className="font-bold text-yellow-400">← →</div>
              <div className="text-gray-300">Move Left/Right</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="font-bold text-yellow-400">X</div>
              <div className="text-gray-300">Jump</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="font-bold text-yellow-400">C</div>
              <div className="text-gray-300">Shoot</div>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <div className="font-bold text-yellow-400">TAB</div>
              <div className="text-gray-300">Switch Weapon</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">📚 Implemented Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Entity System (Player, Zombie, Weapons)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Collision Detection (AABB & Circle)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Physics Engine (Gravity, Velocity)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Particle System (Explosions)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Weapon System (Gun & Grenade)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Health & Damage System</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Invincibility Mechanic</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>AI Enemy Movement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;