import { setupWebGL, createProgramFromFiles } from '../common/webgl-utils.js'
import { m4, resizeCanvasToDisplaySize } from '../common/twgl-full.module.js'

const scene = {
    program: {
        id: null,
        locations: {
            a_coords: null,
            a_size: null,
            a_offset: null,
            a_texCoords: null,
            u_projection: null,
            u_view: null,
            u_camera: null,
            u_isBillboard: null
        }
    },
    geometry: {
        square: {
            vao: null,
            vboInstanceOffset: null,
            vboInstanceSize: null,
            draw: null
        }
    },
    clumpsOfGrass: {
        instancePositions: [
          [-10, 0, -24],  [0, 0, -24],  [10, 0, -24]
        ].flat(),
        instanceSizes: [1.5, 1.5, 1.5]
    },
    camera: {
        position: [0, 11, 0],
        yaw: 0,
        pitch: -0.2,
        movementSpeed: 12,
        mouseSensitivity: 0.0025,
        pitchLimit: Math.PI / 2 - 0.01
    },
    keys: {
        w: false,
        a: false,
        s: false,
        d: false
    },
    billboardEnabled: true,
    fogEnabled: true
}

function normalizeVector3([x, y, z]) {
    const len = Math.hypot(x, y, z)
    if (len === 0) return [0, 0, 0]
    return [x / len, y / len, z / len]
}

function updateViewMatrix(gl) {
    const { position, yaw, pitch } = scene.camera
    const direction = [
        Math.cos(pitch) * Math.sin(yaw),
        Math.sin(pitch),
        -Math.cos(pitch) * Math.cos(yaw)
    ]

    const target = [
        position[0] + direction[0],
        position[1] + direction[1],
        position[2] + direction[2]
    ]

    const cameraMatrix = m4.lookAt(position, target, [0, 1, 0])
    gl.uniformMatrix4fv(scene.program.locations.u_camera, false, cameraMatrix)
    gl.uniformMatrix4fv(scene.program.locations.u_view, false, m4.inverse(cameraMatrix))
}


function square(gl, program, instancePositions, instanceSizes) {
    const vertices = new Float32Array([
        -0.5,    0, 0,
         0.5,    0, 0,
         0.5, 4.83, 0,
        -0.5, 4.83, 0
    ])
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const vboCoords = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vboCoords)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(program.locations.a_coords)
    gl.vertexAttribPointer(program.locations.a_coords, 3, gl.FLOAT, false, 0, 0)

    const vboTexCoords = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vboTexCoords)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(program.locations.a_texCoords)
    gl.vertexAttribPointer(program.locations.a_texCoords, 2, gl.FLOAT, false, 0, 0)

    const vboInstanceOffset = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vboInstanceOffset)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instancePositions), gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(program.locations.a_offset)
    gl.vertexAttribPointer(program.locations.a_offset, 3, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(program.locations.a_offset, 1)

    const vboInstanceSize = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vboInstanceSize)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instanceSizes), gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(program.locations.a_size)
    gl.vertexAttribPointer(program.locations.a_size, 1, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(program.locations.a_size, 1)

    return {
        vao,
        vboInstanceOffset,
        vboInstanceSize,
        draw(gl, instanceCount) {
            gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, 4, instanceCount)
        }
    }
}

export async function initialize(canvas) {
    const gl = setupWebGL(canvas, { antialias: true, alpha: true })
    scene.program.id = await createProgramFromFiles(gl, 
        '../../samples/instanced-drawing/vertex.glsl', 
        '../../samples/instanced-drawing/fragment.glsl')
    scene.program.locations.u_projection = gl.getUniformLocation(scene.program.id, 'u_projection')
    scene.program.locations.u_view = gl.getUniformLocation(scene.program.id, 'u_view')
    scene.program.locations.u_camera = gl.getUniformLocation(scene.program.id, 'u_camera')
    scene.program.locations.a_coords = gl.getAttribLocation(scene.program.id, 'a_coords')
    scene.program.locations.a_size = gl.getAttribLocation(scene.program.id, 'a_size')
    scene.program.locations.a_offset = gl.getAttribLocation(scene.program.id, 'a_offset')
    scene.program.locations.a_texCoords = gl.getAttribLocation(scene.program.id, 'a_texCoords')
    scene.program.locations.u_hasWind = gl.getUniformLocation(scene.program.id, 'u_hasWind')
    scene.program.locations.u_time = gl.getUniformLocation(scene.program.id, 'u_time')
    scene.program.locations.u_isBillboard = gl.getUniformLocation(scene.program.id, 'u_isBillboard')
    scene.program.locations.u_fogStart = gl.getUniformLocation(scene.program.id, 'u_fogStart')
    scene.program.locations.u_fogEnd = gl.getUniformLocation(scene.program.id, 'u_fogEnd')

    // cria a geometria do quadrado que será instanciada para desenhar a grama
    scene.geometry.square = square(gl, scene.program, scene.clumpsOfGrass.instancePositions, scene.clumpsOfGrass.instanceSizes)
    // carrega a textura (SVG) que será usada para desenhar a grama: grass-clump.svg
    const texture = gl.createTexture()
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const image = new Image()
    image.onload = () => {
        const offscreenCanvas = document.createElement('canvas')
        offscreenCanvas.width = image.width * 8
        offscreenCanvas.height = image.height * 8
        const ctx = offscreenCanvas.getContext('2d')
        ctx.drawImage(image, 0, 0)

        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreenCanvas)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.generateMipmap(gl.TEXTURE_2D)
    }
    image.src = '../../samples/instanced-drawing/grass-clump.svg'
    

    // configura estado inicial da aplicação
    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.useProgram(scene.program.id)    
    gl.uniformMatrix4fv(scene.program.locations.u_projection, false,
        m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 2000)
    )
    gl.uniform1i(scene.program.locations.u_isBillboard, scene.billboardEnabled ? 1 : 0)
    gl.uniform1f(scene.program.locations.u_fogStart, 30.0)
    gl.uniform1f(scene.program.locations.u_fogEnd, 80.0)
    updateViewMatrix(gl)

    // captura o mouse para controlar a câmera ao clicar no canvas
    gl.canvas.addEventListener('click', () => {
        gl.canvas.requestPointerLock()
    })

    document.addEventListener('mousemove', (event) => {
        if (document.pointerLockElement !== gl.canvas) return

        scene.camera.yaw += event.movementX * scene.camera.mouseSensitivity
        scene.camera.pitch -= event.movementY * scene.camera.mouseSensitivity
        scene.camera.pitch = Math.max(-scene.camera.pitchLimit,
            Math.min(scene.camera.pitchLimit, scene.camera.pitch))
    })

    // registra WASD para mover a câmera (sem pulo)
    window.addEventListener('keydown', (event) => {
        if (event.key === 'w' || event.key === 'W') scene.keys.w = true
        if (event.key === 'a' || event.key === 'A') scene.keys.a = true
        if (event.key === 's' || event.key === 'S') scene.keys.s = true
        if (event.key === 'd' || event.key === 'D') scene.keys.d = true
    })

    window.addEventListener('keyup', (event) => {
        if (event.key === 'w' || event.key === 'W') scene.keys.w = false
        if (event.key === 'a' || event.key === 'A') scene.keys.a = false
        if (event.key === 's' || event.key === 'S') scene.keys.s = false
        if (event.key === 'd' || event.key === 'D') scene.keys.d = false
    })

    // registra eventos '+' para adicionar mais grama e '-' para remover
    window.addEventListener('keydown', (event) => {
        let needToReuploadInstanceVBOs = false
        if (event.key === '+' || event.key === '=') {
            const newClumps = 5
            for (let c = 0; c < newClumps; c += 1) {
                const basePosition = [Math.random() * 60 - 30, 0, Math.random() * (-60) - 10]
                const newBlades = Math.floor(Math.random() * 5) + 3
                for (let i = 0; i < newBlades; i += 1) {
                    const newInstancePosition = [
                        basePosition[0] + (Math.random() - 0.5) * 2,
                        0,
                        basePosition[2] + (Math.random() - 0.5) * 2
                    ]
                    scene.clumpsOfGrass.instancePositions.push(...newInstancePosition)
                    scene.clumpsOfGrass.instanceSizes.push(Math.random() * 0.5 + 1)
                }
            }
            needToReuploadInstanceVBOs = true
            console.log('Added instance. Total instances:', scene.clumpsOfGrass.instanceSizes.length)
        } else if (event.key === '-') {
            if (scene.clumpsOfGrass.instanceSizes.length > 0) {
                scene.clumpsOfGrass.instancePositions.splice(-3, 3)
                scene.clumpsOfGrass.instanceSizes.pop()
                needToReuploadInstanceVBOs = true
                console.log('Removed instance. Total instances:', scene.clumpsOfGrass.instanceSizes.length)
            }
        } else if (event.key === 'v' || event.key === 'V') {
            // alterna o vento ligado/desligado
            const hasWind = gl.getUniform(scene.program.id, scene.program.locations.u_hasWind)
            gl.uniform1i(scene.program.locations.u_hasWind, hasWind ? 0 : 1)
            console.log('Toggled wind. Now:', hasWind ? 'OFF' : 'ON')
        } else if ((event.key === 'b' || event.key === 'B') && !event.repeat) {
            // alterna o modo billboard para fazer a grama sempre olhar para a câmera
            scene.billboardEnabled = !scene.billboardEnabled
            gl.uniform1i(scene.program.locations.u_isBillboard, scene.billboardEnabled ? 1 : 0)
            console.log('Toggled billboard mode. Now:', scene.billboardEnabled ? 'ON' : 'OFF')
        } else if ((event.key === 'f' || event.key === 'F') && !event.repeat) {
            // alterna o nevoeiro ligado/desligado
            scene.fogEnabled = !scene.fogEnabled
            if (scene.fogEnabled) {
                gl.uniform1f(scene.program.locations.u_fogStart, 30.0)
                gl.uniform1f(scene.program.locations.u_fogEnd, 80.0)
            } else {
                gl.uniform1f(scene.program.locations.u_fogStart, 10000.0)
                gl.uniform1f(scene.program.locations.u_fogEnd, 10000.0)
            }
            console.log('Toggled fog. Now:', scene.fogEnabled ? 'ON' : 'OFF')
        } else if (event.key === ' ') {
            // ordena as instâncias por distância à câmera para melhorar a renderização com transparências
            const cameraPosition = scene.camera.position

            const sortableInstances = []
            for (let i = 0; i < scene.clumpsOfGrass.instanceSizes.length; i += 1) {
                const base = i * 3
                const x = scene.clumpsOfGrass.instancePositions[base]
                const y = scene.clumpsOfGrass.instancePositions[base + 1]
                const z = scene.clumpsOfGrass.instancePositions[base + 2]
                const dx = x - cameraPosition[0]
                const dy = y - cameraPosition[1]
                const dz = z - cameraPosition[2]
                sortableInstances.push({
                    position: [x, y, z],
                    size: scene.clumpsOfGrass.instanceSizes[i],
                    distanceSquared: dx * dx + dy * dy + dz * dz
                })
            }

            sortableInstances.sort((a, b) => b.distanceSquared - a.distanceSquared)

            scene.clumpsOfGrass.instancePositions = sortableInstances
                .flatMap(({ position }) => position)
            scene.clumpsOfGrass.instanceSizes = sortableInstances
                .map(({ size }) => size)

            needToReuploadInstanceVBOs = true
            console.log('Sorted instances by distance to camera')
        }

        if (!needToReuploadInstanceVBOs) return
        gl.bindBuffer(gl.ARRAY_BUFFER, scene.geometry.square.vboInstanceOffset)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scene.clumpsOfGrass.instancePositions.flat()), gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, scene.geometry.square.vboInstanceSize)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scene.clumpsOfGrass.instanceSizes), gl.DYNAMIC_DRAW)
    })

    mainLoop(0, gl)
}

function render(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    scene.geometry.square.draw(gl, scene.clumpsOfGrass.instanceSizes.length)
}

function mainLoop(timestamp, gl) {
    gl.uniform1f(scene.program.locations.u_time, timestamp * 0.001)
    const dt = timestamp - (mainLoop.previousTimestamp || timestamp)
    mainLoop.previousTimestamp = timestamp

    update(dt, gl)
    render(gl)
    requestAnimationFrame((timestamp) => mainLoop(timestamp, gl))
}

function update(dt, gl) {
    const wasResized = resizeCanvasToDisplaySize(gl.canvas)
    if (wasResized) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.uniformMatrix4fv(scene.program.locations.u_projection, false,
            m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 2000)
        )
    }

    const dtSeconds = dt * 0.001

    const forwardDirection = [Math.sin(scene.camera.yaw), 0, -Math.cos(scene.camera.yaw)]
    const rightDirection = [Math.cos(scene.camera.yaw), 0, Math.sin(scene.camera.yaw)]

    let moveX = 0
    let moveZ = 0
    if (scene.keys.w) {
        moveX += forwardDirection[0]
        moveZ += forwardDirection[2]
    }
    if (scene.keys.s) {
        moveX -= forwardDirection[0]
        moveZ -= forwardDirection[2]
    }
    if (scene.keys.d) {
        moveX += rightDirection[0]
        moveZ += rightDirection[2]
    }
    if (scene.keys.a) {
        moveX -= rightDirection[0]
        moveZ -= rightDirection[2]
    }

    const [normalizedMoveX, , normalizedMoveZ] = normalizeVector3([moveX, 0, moveZ])
    const distance = scene.camera.movementSpeed * dtSeconds

    scene.camera.position[0] += normalizedMoveX * distance
    scene.camera.position[2] += normalizedMoveZ * distance

    updateViewMatrix(gl)
}
