import * as twgl from '../common/twgl-full.module.js'

export function initialize(canvas) {
    if (typeof canvas === 'string') {
        canvas = document.querySelector(canvas)
    }
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) {
        console.error('WebGL not supported')
        return
    }

    // simple GLSL program (WebGL2)
    const vs = `#version 300 es
    in vec4 position;
    in vec3 normal;
    uniform mat4 u_worldViewProjection;
    uniform mat4 u_world;
    uniform mat4 u_worldInverseTranspose;
    out vec3 v_normal;
    out vec3 v_worldPos;
    void main() {
      gl_Position = u_worldViewProjection * position;
      v_worldPos = (u_world * position).xyz;
      v_normal = mat3(u_worldInverseTranspose) * normal;
    }
    `

    const fs = `#version 300 es
    precision highp float;
    in vec3 v_normal;
    in vec3 v_worldPos;
    uniform vec3 u_lightWorldPos;
    uniform vec3 u_lightColor;
    uniform vec3 u_ambient;
    uniform vec3 u_color;
    out vec4 outColor;
    void main() {
      vec3 normal = normalize(v_normal);
      vec3 lightDir = normalize(u_lightWorldPos - v_worldPos);
      float diff = max(dot(normal, lightDir), 0.0);
      vec3 diffuse = diff * u_lightColor * u_color;
      vec3 ambient = u_ambient * u_color;
      outColor = vec4(diffuse + ambient, 1.0);
    }
    `

    const programInfo = twgl.createProgramInfo(gl, [vs, fs])

    // create the six primitives (top row: cube, sphere, truncated cone; bottom row: cylinder, torus, disc)
    const cubeBI = twgl.primitives.createCubeBufferInfo(gl, 1)
    const sphereBI = twgl.primitives.createSphereBufferInfo(gl, 1, 32, 16)
    const coneBI = twgl.primitives.createTruncatedConeBufferInfo(gl, 1, 0, 1, 32, 1)
    const cylinderBI = twgl.primitives.createCylinderBufferInfo(gl, 1, 1, 32, 1)
    const torusBI = twgl.primitives.createTorusBufferInfo(gl, 1, 0.4, 48, 12)
    const discBI = twgl.primitives.createDiscBufferInfo(gl, 0.8, 32)

    const bufferInfos = [cubeBI, sphereBI, coneBI, cylinderBI, torusBI, discBI]

    // palette taken from main.three.js (converted to 0..1 floats)
    const paletteHex = [0xffb3ba, 0xfffac9, 0xffbdfb, 0xbaffc9, 0xbae1ff, 0xa6f5d8]
    const palette = paletteHex.map(h => [(h >> 16 & 255)/255, (h >> 8 & 255)/255, (h & 255)/255])

    gl.clearColor(1, 1, 1, 1)
    gl.enable(gl.DEPTH_TEST)

    // --- DOM overlay labels (positioned over canvas) ---
    const canvasParent = gl.canvas.parentElement || document.body
    if (!canvasParent.style.position) canvasParent.style.position = 'relative'

    const labelContainer = document.createElement('div')
    labelContainer.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;'
    canvasParent.appendChild(labelContainer)

    const labelTexts = [
        'createCubeBufferInfo()',
        'createSphereBufferInfo()',
        'createTruncatedConeBufferInfo()',
        'createCylinderBufferInfo()',
        'createTorusBufferInfo()',
        'createDiscBufferInfo()'
    ]

    const labels = []
    labelTexts.forEach((text) => {
        const el = document.createElement('code')
        el.className = 'twgl-label'
        el.textContent = text
        el.style.cssText = 'position:absolute;transform:translate(-50%, -50%);font-size:0.9em;pointer-events:auto;'
        labelContainer.appendChild(el)
        labels.push(el)
    })

    // helper to project a 3D point with a 4x4 matrix to NDC then to screen pixels
    function projectPoint(mat4, x, y, z, canvas) {
        const m = mat4
        const cx = m[0]*x + m[4]*y + m[8]*z + m[12]
        const cy = m[1]*x + m[5]*y + m[9]*z + m[13]
        const cw = m[3]*x + m[7]*y + m[11]*z + m[15]
        if (cw === 0) return null
        const ndcX = cx / cw
        const ndcY = cy / cw
        const px = (ndcX * 0.5 + 0.5) * canvas.clientWidth
        const py = (-ndcY * 0.5 + 0.5) * canvas.clientHeight
        return {x: px, y: py}
    }

    // camera matching main.three.js
    const fov = 75 * Math.PI / 180
    const cameraPosition = [0, 0, 5]
    const target = [0, 0, 0]
    const up = [0, 1, 0]

    // per-object rotation state
    const rotations = new Array(bufferInfos.length).fill(0).map(() => ({x: 0, y: 0}))

    function render(time) {
        time *= 0.001
        twgl.resizeCanvasToDisplaySize(gl.canvas)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const projection = twgl.m4.perspective(fov, aspect, 0.1, 1000)
        const cameraMatrix = twgl.m4.lookAt(cameraPosition, target, up)
        const viewMatrix = twgl.m4.inverse(cameraMatrix)

        for (let i = 0; i < bufferInfos.length; ++i) {
            const bi = bufferInfos[i]

            // position calculation matching main.three.js
            const x = (i % 3 - 1) * 3
            const y = Math.floor(i / 3) * -3 + 1.5

            // update rotation
            rotations[i].x += 0.002
            rotations[i].y += 0.005

            let world = twgl.m4.identity()
            twgl.m4.translate(world, [x, y, 0], world)
            twgl.m4.rotateX(world, rotations[i].x, world)
            twgl.m4.rotateY(world, rotations[i].y, world)

            const worldView = twgl.m4.multiply(viewMatrix, world)
            const worldViewProjection = twgl.m4.multiply(projection, worldView)
            const worldInverse = twgl.m4.inverse(world)
            const worldInverseTranspose = twgl.m4.transpose(worldInverse)

            gl.useProgram(programInfo.program)
            twgl.setBuffersAndAttributes(gl, programInfo, bi)

            const uniforms = {
                u_worldViewProjection: worldViewProjection,
                u_world: world,
                u_worldInverseTranspose: worldInverseTranspose,
                u_lightWorldPos: [0, 1, 4],
                u_lightColor: [0.3, 0.3, 0.3],
                u_ambient: [0.4, 0.4, 0.4],
                u_color: palette[i % palette.length]
            }

            twgl.setUniforms(programInfo, uniforms)
            twgl.drawBufferInfo(gl, bi)
            twgl.setUniforms(programInfo, { u_color: [.6, .6, .6] })
            twgl.drawBufferInfo(gl, bi, gl.LINE_STRIP)

            // position associated DOM label
            const label = labels[i]
            if (label) {
                const screen = projectPoint(worldViewProjection, 0, 0, 0, gl.canvas)
                if (screen) {
                    let offsetY = i < 3 ? -90 : 110
                    offsetY = offsetY * ([1, 4].includes(i) ? 1.2 : 1)
                    label.style.left = `${screen.x}px`
                    label.style.top = `${screen.y + offsetY}px`
                }
            }
        }

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}
