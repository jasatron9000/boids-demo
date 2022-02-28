import { vec2 } from "../interfaces/vector"

export function toDegrees(radian: number): number {
    return 180 * (radian / Math.PI)
}

export function toRadian(degrees: number): number {
    return Math.PI * (degrees / 180)
}

export function toRectangular(mag: number, degrees: number): vec2 {
    return {
        x: mag * Math.cos(toRadian(degrees)),
        y: mag * Math.sin(toRadian(degrees))
    }
}

export function translate(vectorA: vec2, vectorB: vec2): vec2 {
    return {
        x: vectorA.x + vectorB.x,
        y: vectorA.y + vectorB.y
    }
}

export function rotate(vector: vec2, degrees: number): vec2 {
    return {
        x: (vector.x * Math.cos(toRadian(degrees))) - (vector.y * Math.sin(toRadian(degrees))),
        y: (vector.x * Math.sin(toRadian(degrees))) + (vector.y * Math.cos(toRadian(degrees)))
    }
}

// returns a number between -pi and pi
export function getAngle(vector: vec2): number {
    return Math.atan2(vector.y, vector.x)
}

export function getMag(vector: vec2): number {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
}

export function translateArray(vectors: vec2[], translateVec: vec2): vec2[] {
    return vectors.map(val => {
        return translate(val, translateVec)
    })
}

export function rotateArray(vectors: vec2[], degrees: number): vec2[] {
    return vectors.map(val => {
        return rotate(val, degrees)
    })
}

export function subtractVector(vectorA: vec2, vectorB: vec2): vec2 {
    return {
        x: vectorA.x - vectorB.x,
        y: vectorA.y - vectorB.y,
    }
} 

export function addVectors(vectors: vec2[], mag: number = -1): vec2 {
    let resultant: vec2 = { x: 0, y: 0 }

    vectors.map(val => {
        resultant.x += val.x
        resultant.y += val.y
    })

    if (mag !== -1) {
        return toRectangular(1, toDegrees(Math.atan2(resultant.y, resultant.x)))
    }

    return resultant
}