import { setupWebGL, createProgramFromFiles } from "../common/webgl-utils.js"
import { transposeMatrix4d, multiplyPointByMatrix, EASING } from "./math-utils.js"

// duração da interpolação entre matrizes de projeção, em ms
const INTERPOLATION_DURATION = 0.4

const scene = {
    program: {
        id: null,
        locations: {
            u_projection: null,
            a_position: null
        }
    },
    points: {
        pz1: [-0.5, -0.33, -0.5],
        qz1: [ 0.5, -0.33, -0.5],
        pz2: [-0.5,  0.00, -0.7],
        qz2: [ 0.5,  0.00, -0.7],
        pz3: [-0.5,  0.33, -0.9],
        qz3: [ 0.5,  0.33, -0.9]
    },
    // projeção em column-major order, para facilitar o upload para o shader 
    projectionMatrix: null,
    targetProjectionMatrix: null,
    previousProjectionMatrix: null,
    
    interpolationTime: 0,

    // elementos HTML para mostrar os pontos projetados e suas coordenadas, 
    // atualizados a cada mudança na matriz de projeção
    overlayedPoints: [],    // bolinhas que ficam sobre os pontos projetados
    overlayedCoords: []     // texto com as coordenadas dos pontos projetados
}

export async function initialize(canvas) {
    const gl = setupWebGL(canvas, { antialias: false, alpha: true })
    scene.program.id = await createProgramFromFiles(gl, 
        '../../samples/perspective-division/vertex.glsl', 
        '../../samples/perspective-division/fragment.glsl')
    scene.program.locations.u_projection = gl.getUniformLocation(scene.program.id, 'u_projection')
    scene.program.locations.a_position = gl.getAttribLocation(scene.program.id, 'a_position')
    
    // cria as 3 linhas da cena, cada uma com um valor de z diferente
    const ps = scene.points
    const lineVertices = new Float32Array([
        ...ps.pz1,
        ...ps.qz1,
        ...ps.pz2,
        ...ps.qz2,
        ...ps.pz3,
        ...ps.qz3
    ])
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, lineVertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(scene.program.locations.a_position)
    gl.vertexAttribPointer(scene.program.locations.a_position, 3, gl.FLOAT, false, 0, 0)


    // configura estado inicial da aplicação
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.useProgram(scene.program.id)    
    
    // registra evento para atualizar a matriz de projeção a partir dos inputs
    const matrixContainer = document.querySelector('.input-matrix-4d')
    matrixContainer.addEventListener('input', () => projectionChanged(gl))

    scene.overlayedPoints = Array.from(document.querySelectorAll('#text-overlay .point'))
    scene.overlayedCoords = Array.from(document.querySelectorAll('#text-overlay .coords'))

    // configura a matriz de projeção a primeira vez, pegando os valores dos inputs
    projectionChanged(gl)
    scene.projectionMatrix = scene.targetProjectionMatrix
    scene.previousProjectionMatrix = scene.targetProjectionMatrix

    // registra eventos para os botões de preset de matriz de projeção
    const presetButtons = document.querySelectorAll('.projection-preset')
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const preset = button.dataset.m
            if (preset === 'identity') {
                setProjectionMatrixInputs(gl, [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                ])
            } else if (preset === 'fov90') {
                setProjectionMatrixInputs(gl, [
                    1, 0,   0,   0,
                    0, 1,   0,   0,
                    0, 0,   -1, -0.2,
                    0, 0,   -1,   0
                ])
            } else if (preset === 'fov60') {
                const f = 1 / Math.tan((60 / 2) * Math.PI / 180)
                setProjectionMatrixInputs(gl, [
                    f, 0, 0, 0,
                    0, f, 0, 0,
                    0, 0, -1, -0.2,
                    0, 0, -1, 0
                ])
            }
        })
    })

    // inicia o loop principal
    mainLoop(0, gl)
}

function render(gl) {
    // desenha 3 linhas horizontais
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINES, 0, 6)
}

function mainLoop(timestamp, gl) {
    const dt = timestamp - (mainLoop.previousTimestamp || timestamp)
    mainLoop.previousTimestamp = timestamp

    update(dt, gl)
    render(gl)
    requestAnimationFrame((timestamp) => mainLoop(timestamp, gl))
}

function update(dt, gl) {
    // animação de interpolação entre matrizes de projeção, quando a matriz muda
    if (scene.interpolationTime < 1) {
        scene.interpolationTime += dt / (INTERPOLATION_DURATION * 1000)
        if (scene.interpolationTime > 1) {
            scene.interpolationTime = 1
            scene.previousProjectionMatrix = scene.targetProjectionMatrix
        }
        const t = scene.interpolationTime
        const clamped = Math.min(Math.max(t, 0), 1)
        // const easedT = easeInOutCubic(clamped)
        const easedT = EASING.easeOutQuad(clamped)
        const m1 = scene.previousProjectionMatrix
        const m2 = scene.targetProjectionMatrix
        const interpolatedMatrix = m1.map((value, index) => {
            const v2 = m2 ? m2[index] : value
            return value * (1 - easedT) + v2 * easedT
        })
        scene.projectionMatrix = new Float32Array(interpolatedMatrix)
        gl.uniformMatrix4fv(scene.program.locations.u_projection, false, scene.projectionMatrix)
        updatePointPositions(gl)
    }
}

function setProjectionMatrixInputs(gl, values) {
    const inputs = document.querySelectorAll('.input-matrix-4d input')
    inputs.forEach((input, index) => {
        input.value = values[index]
    })
    projectionChanged(gl)
}

function projectionChanged(gl) {
    updateProjectionMatrixFromInput(gl)
    updatePointPositions(gl)
}

function updateProjectionMatrixFromInput(gl) {
    const inputs = document.querySelectorAll('.input-matrix-4d input')
    // values em row-major order
    const values = Array.from(inputs).map(input => parseFloat(input.value) || 0)
    // valuesTransposed em column-major order, para upload para o shader
    const valuesTransposed = transposeMatrix4d(values)
    scene.targetProjectionMatrix = new Float32Array(valuesTransposed)
    scene.previousProjectionMatrix = scene.projectionMatrix
    scene.interpolationTime = 0
}


function projectPoint(point) {
    const projectionMatrix = transposeMatrix4d(scene.projectionMatrix ?? scene.targetProjectionMatrix)
    const [xp, yp, zp, wp] = multiplyPointByMatrix(point, projectionMatrix)
    const xpp = xp / wp
    const ypp = yp / wp
    const zpp = zp / wp
    return [xpp, ypp, zpp]
}

function mapClipCoordinatesToOverlayCoordinates(width, height, x, y) {
    const overlayX = (x + 1) / 2 * width
    const overlayY = (1 - (y + 1) / 2) * height
    return [overlayX, overlayY]
}

function updatePointPositions(gl) {
    const ps = scene.points
    const points = [ps.pz1, ps.qz1, ps.pz2, ps.qz2, ps.pz3, ps.qz3]
    const projectedPoints = points.map(projectPoint)
    projectedPoints.forEach((projPoint, index) => {
        const [x, y] = mapClipCoordinatesToOverlayCoordinates(
            gl.canvas.width,
            gl.canvas.height,
            projPoint[0],
            projPoint[1]
        )
        const overlayPoint = scene.overlayedPoints[index]
        const overlayCoords = scene.overlayedCoords[index]
        overlayPoint.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
        overlayCoords.style.transform = `translate(calc(-50% + ${x}px), calc(-100% + ${y}px))`
        overlayCoords.textContent = `(${projPoint[0].toFixed(1)}, ${projPoint[1].toFixed(1)}, ${projPoint[2].toFixed(1)})`
    })
}