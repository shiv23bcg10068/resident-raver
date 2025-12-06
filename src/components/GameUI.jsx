import React from 'react';
import { Play, Pause, RotateCcw, Zap, Bomb, Heart } from 'lucide-react';

const GameUI = ({ gameState, player, score, zombiesAlive, onStart, onPause, onResume, onReset }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-bold">{player?.health || 0}%</span>
          </div>
          <div>
            <span className="text-gray-400">Score:</span> <span className="font-bold text-yellow-400">{score}</span>
          </div>
          <div>
            <span className="text-gray-400">Zombies:</span> <span className="font-bold text-green-400">{zombiesAlive}</span>
          </div>
          <div className="flex items-center gap-2">
            {player?.weapon === 0 ? (
              <Zap className="w-4 h-4 text-yellow-400" />
            ) : (
              <Bomb className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">{player?.weapon === 0 ? 'Gun' : 'Grenade'}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {gameState === 'menu' && (
            <button
              onClick={onStart}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4" /> Start Game
            </button>
          )}
          {gameState === 'playing' && (
            <button
              onClick={onPause}
              className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 flex items-center gap-2 transition"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}
          {gameState === 'paused' && (
            <button
              onClick={onResume}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4" /> Resume
            </button>
          )}
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;