import React, { useRef, useEffect, useState } from 'react';
import { PlayerList } from './classes/playerList';

import { vec2 } from '../../interfaces/vector';

import './index.css';

const Canvas: React.FC = () => {
    const playersRef = useRef<PlayerList | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function draw() {
        const players = playersRef.current

        if (players) {
            players.update()
            players.draw()
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            playersRef.current = new PlayerList(
                canvasRef.current,
                25
            )
        }
    }, [])

    useEffect(() => {
        const ID = setInterval(draw, 33)

        return () => {
            clearInterval(ID)
        }
    })

    return (
        <canvas ref={canvasRef} width={1920} height={1080} />
    )
}

export default Canvas;