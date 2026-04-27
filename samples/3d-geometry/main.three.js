import * as THREE from 'three'

export async function initialize(canvas) {
    if (typeof canvas === 'string') {
        canvas = document.querySelector(canvas)
    }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setClearColor(0xffffff, 1); 
    // ensure renderer size matches canvas display size
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

    // creates a scene displaying different THREE.js geometries:
    // top row: BoxGeometry, SphereGeometry, ConeGeometry
    // bottom row: CylinderGeometry, TorusGeometry, TorusKnotGeometry
    const geometries = [
        new THREE.BoxGeometry(),
        new THREE.SphereGeometry(),
        new THREE.ConeGeometry(),
        new THREE.CylinderGeometry(),
        new THREE.TorusGeometry(),
        new THREE.CapsuleGeometry()
    ]

    // configure basic phong material and light sources
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x77dd99, 
        shininess: 80
    })

    // create meshes for each geometry and add to the scene
    geometries.forEach((geometry, index) => {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = (index % 3 - 1) * 3
        mesh.position.y = Math.floor(index / 3) * -3 + 1.5
        scene.add(mesh)
    })

    // --- DOM overlay labels ---
    // parent must be positioned to allow absolute overlay
    const canvasParent = renderer.domElement.parentElement || document.body
    if (!canvasParent.style.position) canvasParent.style.position = 'relative'

    const labelContainer = document.createElement('div')
    labelContainer.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;'
    canvasParent.appendChild(labelContainer)

    const labelTexts = [
        'THREE.BoxGeometry()',
        'THREE.SphereGeometry()',
        'THREE.ConeGeometry()',
        'THREE.CylinderGeometry()',
        'THREE.TorusGeometry()',
        'THREE.CapsuleGeometry()'
    ]

    const labels = []
    labelTexts.forEach((text) => {
        const el = document.createElement('div')
        el.className = 'three-label'
        el.textContent = text
        el.style.cssText = 'position:absolute;transform:translate(-50%, -50%);background:rgba(255,255,255,0.85);padding:4px 8px;border-radius:4px;font-size:12px;pointer-events:auto;'
        labelContainer.appendChild(el)
        labels.push(el)
    })

    // helper vector reused each frame
    const _labelPos = new THREE.Vector3()

    camera.position.z = 5

    const ambientLight = new THREE.AmbientLight(0x404040) // soft white light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0.1)
    pointLight.position.set(0, 1, 2)
    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)

    // change the rotation of the objects over time
    function animate() {
        geometries.forEach((geometry, index) => {
            const mesh = scene.children[index]
            mesh.rotation.x += 0.002
            mesh.rotation.y += 0.005

            // project mesh position to 2D and position label
            mesh.getWorldPosition(_labelPos)
            _labelPos.project(camera)
            const x = (_labelPos.x * 0.5 + 0.5) * renderer.domElement.clientWidth
            const y = (-_labelPos.y * 0.5 + 0.5) * renderer.domElement.clientHeight
            const label = labels[index]
            // top row (indices 0..2) show label above object; bottom row below
            const offsetY = index < 3 ? -20 : 20
            label.style.left = `${x}px`
            label.style.top = `${y + offsetY}px`
        })

        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()

    // keep renderer/camera in sync with canvas size
    function onWindowResize() {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onWindowResize)
}
