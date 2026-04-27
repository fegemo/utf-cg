export function transposeMatrix4d(m) {
    return [
        m[0], m[4], m[8],  m[12],
        m[1], m[5], m[9],  m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
    ]
}

export function multiplyPointByMatrix(point, matrix) {
    const m = matrix
    const [x, y, z, w] = [...point, 1]
    const xp = m[0] * x + m[1] * y + m[2]  * z + m[3] * w 
    const yp = m[4] * x + m[5] * y + m[6]  * z + m[7] * w
    const zp = m[8] * x + m[9] * y + m[10]  * z + m[11] * w
    const wp = m[12] * x + m[13] * y + m[14]  * z + m[15] * w
    return [xp, yp, zp, wp]
}

// Easing functions (t in [0,1])
function linear(t) {
    return t
}

function easeInQuad(t) {
    return t * t
}

function easeOutQuad(t) {
    return t * (2 - t)
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export const EASING = {
    linear,
    easeInQuad,
    easeOutQuad,
    easeInOutCubic
}