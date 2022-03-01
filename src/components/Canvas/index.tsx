import React, { useRef, useEffect, useState } from 'react';
import { PlayerList } from './classes/playerList';

import './index.css';

interface Props {
    perception?: number,
    closePerception?: number,
    turnFactor?: number,

    cohesionFactor?: number,
    seperationFactor?: number,
    alignmentFactor?: number
}

const Canvas: React.FC<Props> = ({
    perception,
    closePerception,
    turnFactor,
    cohesionFactor,
    seperationFactor,
    alignmentFactor
}) => {
    const playersRef = useRef<PlayerList | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const totalPlayers: number = 200

    function draw() {
        const players = playersRef.current

        if (players) {
            players.update(
                alignmentFactor, 
                seperationFactor, 
                cohesionFactor, 
                turnFactor, 
                perception, 
                closePerception
            )
            players.draw()
        }
    }

    useEffect(() => {
        if (canvasRef.current) {
            playersRef.current = new PlayerList(
                canvasRef.current,
                totalPlayers
            )
        }

        return () => {
            playersRef.current = null
        }
    }, [])

    useEffect(() => {
        const ID = setInterval(draw, 42)

        return () => {
            clearInterval(ID)
        }
    })

    return (
        <canvas ref={canvasRef} width={1920} height={1080} />
    )
}

export default Canvas;