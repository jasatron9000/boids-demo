import { vec2 } from "../../../interfaces/vector"
import {
    toRectangular,
    translate,
    getAngle,
    rotateArray,
    translateArray,
    toDegrees,
    addVectors,
    getMagnitudeDiff
} from "../../../utils/math";
import { PlayerList } from "./playerList";

interface playerInfo {
    dF: vec2
}

class Player {
    tForce: vec2;     // acceleration
    driveForce: vec2; // The force of where it is facing

    bearing: number = 0;
    position: vec2 = { x: 0, y: 0 };  // current position from the canvas
    speed: number = 25;             // the constant speed

    drivingForce: number = 2
    alignmentForce: number = 1
    seperationForce: number = 1
    cohensionForce: number = 1

    perception: number = 50

    canvas: HTMLCanvasElement;
    wrapAround: boolean = true;

    private playerStyle: string = "#e67e22";

    constructor(
        canvas: HTMLCanvasElement,
        speed: number = 25
    ) {
        this.canvas = canvas
        this.speed = speed;
        this.tForce = toRectangular(1, (Math.random() * 360) - 180)
        this.driveForce = {
            x: this.tForce.x,
            y: this.tForce.y
        }

        this.position = {
            x: (Math.random() * canvas.width),
            y: (Math.random() * canvas.height)
        };
        this.bearing = getAngle(this.tForce)

        console.log("created new player")
    }

    findClosePlayers(playerList: PlayerList): playerInfo[] {
        let pInfo: playerInfo[] = []

        for (let i = 0; i < playerList.players.length; i++) {
            const currPlayer = playerList.players[i]
            const distanceTo = getMagnitudeDiff(this.position, currPlayer.position)

            if (distanceTo < this.perception) {
                pInfo.push({
                    dF: currPlayer.driveForce
                })
            }
        }

        return pInfo
    }

    alignment(closePlayers: playerInfo[]): vec2 {
        if (closePlayers.length > 0) {
            const closePlayerMags: vec2[] = []

            closePlayers.map((val) => {
                closePlayerMags.push(val.dF)
            })

            return addVectors(closePlayerMags, this.alignmentForce)

        }

        return { x: 0, y: 0 }
    }



    // depending on its internal state update the bird
    update(playerList: PlayerList | void): void {
        if (playerList) {
            // get the player info
            const closePlayers = this.findClosePlayers(playerList)

            const driveForce = {
                x: this.driveForce.x * this.drivingForce,
                y: this.driveForce.y * this.drivingForce
            }
            const alignForce = this.alignment(closePlayers)


            // add all the forces together
            this.tForce = addVectors([driveForce, alignForce], 1)
        }

        const velocity: vec2 = {
            x: this.tForce.x * this.speed,
            y: this.tForce.y * this.speed
        }

        const dispT: vec2 = {
            x: velocity.x,
            y: -1 * velocity.y
        }

        let position = translate(this.position, dispT)

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

        this.position = position
        this.bearing = getAngle(dispT)

    }

    draw(
        ctx: CanvasRenderingContext2D,
    ): void {
        let path: vec2[] = [
            { x: 30, y: 0 },
            { x: -30, y: -15 },
            { x: -30, y: 15 }
        ]

        path = translateArray(rotateArray(path, toDegrees(this.bearing)), this.position)

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

        // set the forward direction to the over all force
        this.driveForce = this.tForce
    }

}

export default Player