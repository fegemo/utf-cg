import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js'

export async function initialize(canvas) {
    if (typeof canvas === 'string') {
        canvas = document.querySelector(canvas)
    }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0); 
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
        new THREE.CapsuleGeometry(1, 1, 8, 24)
    ]

    // create a color palette with six values of pastel colors
    const palette = [
        0xffb3ba,
        0xfffac9,
        0xffbdfb,
        0xbaffc9,
        0xbae1ff,
        0xa6f5d8 
    ]
    
    // create meshes for each geometry and add to the scene
    geometries.forEach((geometry, index) => {
        // configure basic phong material
        const material = new THREE.MeshPhongMaterial({ 
            color: palette[index % palette.length], 
            shininess: 80
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = (index % 3 - 1) * 3
        mesh.position.y = Math.floor(index / 3) * -3 + 1.5
        scene.add(mesh)

        const wireframeGeo = new THREE.WireframeGeometry(geometry)
        const wireframe = new THREE.LineSegments(wireframeGeo, new THREE.LineBasicMaterial({ color: 0x333333, opacity: 0.5, transparent: true }))
        mesh.add(wireframe)
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
        const el = document.createElement('code')
        el.className = 'three-label'
        el.textContent = text
        el.style.cssText = 'position:absolute;transform:translate(-50%, -50%);font-size:16px;box-shadow:unset;background-color:transparent;border-width:0;pointer-events:auto;'
        labelContainer.appendChild(el)
        labels.push(el)
    })

    // helper vector reused each frame
    const _labelPos = new THREE.Vector3()

    camera.position.z = 5

    const ambientLight = new THREE.AmbientLight(0x666666) // soft white light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75)
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
            let offsetY = index < 3 ? -90 : 110
            offsetY = offsetY * ([1, 4].includes(index) ? 1.2 : 1)
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
