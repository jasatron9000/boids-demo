import Player from "./player";

export class PlayerList {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;

    players: Player[]

    constructor(
        canvas: HTMLCanvasElement,
        length: number = 10,
    ) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

        this.players = []

        for (let i = 0; i < length; i++) {
            this.players.push(new Player(
                canvas,
                15
            ))
        }
    }

    update() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.ctx) {
                this.players[i].update(this)
            }
        }
    }

    draw() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            for (let i = 0; i < this.players.length; i++) {
                this.players[i].draw(this.ctx)
            }
        }
    }
}