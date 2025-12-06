import React, { useRef, useEffect } from 'react';
import { CONSTANTS } from '../utils/Constants';

const GameCanvas = ({ gameState, entities, onCanvasReady }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, CONSTANTS.GROUND_Y + 20, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT - CONSTANTS.GROUND_Y - 20);

    // Draw platform
    ctx.fillStyle = '#666';
    ctx.fillRect(0, CONSTANTS.GROUND_Y + 15, CONSTANTS.CANVAS_WIDTH, 5);

    if (gameState === 'playing' || gameState === 'paused') {
      // Draw all entities
      entities.player?.draw(ctx);
      entities.zombies?.forEach(z => z.draw(ctx));
      entities.bullets?.forEach(b => b.draw(ctx));
      entities.grenades?.forEach(g => g.draw(ctx));
      entities.particles?.forEach(p => p.draw(ctx));
    }

    if (gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', CONSTANTS.CANVAS_WIDTH / 2, CONSTANTS.CANVAS_HEIGHT / 2);
    }
  }, [gameState, entities]);

  return (
    <canvas
      ref={canvasRef}
      width={CONSTANTS.CANVAS_WIDTH}
      height={CONSTANTS.CANVAS_HEIGHT}
      className="border-4 border-gray-700 rounded bg-gray-950 w-full max-w-4xl"
    />
  );
};

export default GameCanvas;