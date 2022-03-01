import { vec2 } from "../../../interfaces/vector"
import {
    toRectangular,
    translate,
    getAngle,
    rotateArray,
    translateArray,
    toDegrees,
    addVectors,
    getMag,
    subtractVector
} from "../../../utils/math";
import { PlayerList } from "./playerList";

interface playerInfo {
    relDisp: vec2,
    absVel: vec2,
    isTooClose: boolean
}

class Player {
    velocity: vec2;
    newVelocity: vec2;
    position: vec2;

    alignmentFactor: number = 0.5
    seperationFactor: number = 0.75
    cohesionFactor: number = 0.005

    maxSpeed: number
    minSpeed: number
    turnFactor: number = 4
    perception: number = 100
    avoidRatio: number = 0.4

    canvas: HTMLCanvasElement;
    wrapAround: boolean = false;

    private playerStyle: string;

    constructor(
        canvas: HTMLCanvasElement,
        maxSpeed: number = 25,
        minSpeed: number = 10
    ) {
        this.canvas = canvas
        this.maxSpeed = maxSpeed
        this.minSpeed = minSpeed

        this.velocity = toRectangular(minSpeed, (Math.random() * 360) - 180)
        this.newVelocity = {x: 0, y: 0}
        this.position = {
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height
        }

        this.playerStyle = `hsl(${28}, ${(Math.random() * 50) + 50}%, ${(Math.random() * 20) + 50}%)`

        console.log("created new player")
    }

    /*
        Helper Functions
    */
    updatePosition(allowWarp: boolean = true) {
        let position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y
        }

        if (allowWarp) {
            // warp the players back around when it goes out of bounds.
            if (position.x > this.canvas.width) {
                position.x = 0
            }
            else if (position.x < 0) {
                position.x = this.canvas.width
            }

            if (position.y > this.canvas.height) {
                position.y = 0
            }
            else if (position.y < 0) {
                position.y = this.canvas.height
            }
        }

        this.position = position
    }

    /*
        Boid Algorithm Functions
    
    */
    findClosePlayers(playerList: PlayerList): playerInfo[] {
        const playerInfos: playerInfo[] = []

        for (let i = 0; i < playerList.players.length; i++) {
            // get the scalar distance from this boid to its surrounding neighbours
            const currentPlayer = playerList.players[i]
            const relDisp = subtractVector(currentPlayer.position, this.position)
            const distanceTo = getMag(relDisp)

            // only adds something to the player info list if it is within the perception range
            if (distanceTo < this.perception) {
                playerInfos.push({
                    relDisp: relDisp,
                    absVel: currentPlayer.velocity,
                    isTooClose: (distanceTo < (this.perception * this.avoidRatio)) ? true : false
                })
            }
        }

        return playerInfos
    }

    alignment(closePlayers: playerInfo[], alignmentFactor: number): vec2 {
        let sumAlignment:vec2 = {x: 0, y: 0}

        // Only align with non
        for(let i = 0; i < closePlayers.length; i++) {
            const currentNeighbour = closePlayers[i]

            if (!currentNeighbour.isTooClose) {
                sumAlignment.x += currentNeighbour.absVel.x
                sumAlignment.y += currentNeighbour.absVel.y
            }
        }

        const avgAlignment: vec2 = {
            x: sumAlignment.x / closePlayers.length,
            y: sumAlignment.y / closePlayers.length,
        }
        
        return { 
            x: (avgAlignment.x - this.velocity.x) * alignmentFactor, 
            y: (avgAlignment.y - this.velocity.y) * alignmentFactor 
        }
    }

    separation(closePlayers: playerInfo[], seperationFactor: number): vec2 {
        let sumSeperation:vec2 = {x: 0, y: 0}

        // Only align with non
        for(let i = 0; i < closePlayers.length; i++) {
            const currentNeighbour = closePlayers[i]

            if (currentNeighbour.isTooClose) {
                sumSeperation.x += currentNeighbour.relDisp.x
                sumSeperation.y += currentNeighbour.relDisp.y
            }
        }

        const avgSeperation: vec2 = {
            x: sumSeperation.x / closePlayers.length,
            y: sumSeperation.y / closePlayers.length,
        }
        
        return { 
            x: (-avgSeperation.x) * seperationFactor, 
            y: (-avgSeperation.y) * seperationFactor 
        }
    }

    cohesion(closePlayers: playerInfo[], cohesionFactor: number): vec2 {
        let sumCohesion:vec2 = {x: 0, y: 0}

        // Only align with non
        for(let i = 0; i < closePlayers.length; i++) {
            const currentNeighbour = closePlayers[i]

            if (!currentNeighbour.isTooClose) {
                sumCohesion.x += currentNeighbour.relDisp.x
                sumCohesion.y += currentNeighbour.relDisp.y
            }
        }

        const avgCohesion: vec2 = {
            x: sumCohesion.x / closePlayers.length,
            y: sumCohesion.y / closePlayers.length,
        }
        
        return { 
            x: avgCohesion.x * cohesionFactor, 
            y: avgCohesion.y * cohesionFactor 
        }
        return {x: 0, y: 0}
    }

    // depending on its internal state update the bird
    update(playerList: PlayerList | void): void {
        if (playerList) {
            const closePlayers = this.findClosePlayers(playerList)
            const alignVelocity = this.alignment(closePlayers, this.alignmentFactor)
            const seperateVelocity = this.separation(closePlayers, this.seperationFactor)
            const cohesionVelocity = this.cohesion(closePlayers, this.cohesionFactor)

            this.newVelocity = addVectors([this.velocity, alignVelocity, seperateVelocity, cohesionVelocity])
        }

        // Deal with the screen edges
        const edgeMargin = 150

        if (this.position.x > (this.canvas.width - edgeMargin)) {
            this.newVelocity.x  = this.newVelocity.x - this.turnFactor
        }
        else if (this.position.x < (0 + edgeMargin)) {
            this.newVelocity.x  = this.newVelocity.x + this.turnFactor
        }

        if (this.position.y > (this.canvas.height - edgeMargin)) {
            this.newVelocity.y = this.newVelocity.y - this.turnFactor
        }
        else if (this.position.y < (0 + edgeMargin)) {
            this.newVelocity.y = this.newVelocity.y + this.turnFactor
        } 

        const speed = getMag(this.newVelocity)

        if (speed > this.maxSpeed) {
            this.newVelocity = {
                x: (this.newVelocity.x / speed) * this.maxSpeed,
                y: (this.newVelocity.y / speed) * this.maxSpeed
            }
        }

        if (speed < this.minSpeed) {
            this.newVelocity = {
                x: (this.newVelocity.x / speed) * this.minSpeed,
                y: (this.newVelocity.y / speed) * this.minSpeed
            }
        }

        this.updatePosition(this.wrapAround)
    }

    draw(
        ctx: CanvasRenderingContext2D,
    ): void {
        let path: vec2[] = [
            { x: 12, y: 0 },
            { x: 0, y: -4 },
            { x: -6, y: -2 },
            { x: -12, y: -4 },
            { x: -12, y: 4 },
            { x: -6, y: 2 },
            { x: 0, y: 4 },
            {x: 12, y: 0}
        ]

        path = translateArray(rotateArray(path, toDegrees(getAngle(this.newVelocity))), this.position)

        if (ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.playerStyle;

            for (let i = 0; i < path.length; i++) {
                if (i === 0) {
                    ctx.moveTo(path[i].x, path[i].y);
                    continue
                }
                ctx.lineTo(path[i].x, path[i].y)
            }

            ctx.fill();
        }

        this.velocity = this.newVelocity

    }

}

export default Player