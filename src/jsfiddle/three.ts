const THREE_VERSION = '0.151.2'

export const html = /* html */ `
<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script type="importmap">
{
		"imports": {
			"three": "https://unpkg.com/three@${THREE_VERSION}/build/three.module.js",
			"three/addons/": "https://unpkg.com/three@${THREE_VERSION}/examples/jsm/",
			"lil-gui": "https://unpkg.com/lil-gui@0.18.1/dist/lil-gui.esm.min.js"
		}
}
</script>
`

export const css = /* css */ `
	canvas {
		position: absolute;
		inset: 0;
	}
`

export const js = /* js */ `
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'lil-gui'

async function main() {

	// Scene

	const scene = new THREE.Scene()
	scene.background = new THREE.Color('black')


	// Camera

	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.set(1, 2, 3)


	// WebGL renderer

	const renderer = new THREE.WebGLRenderer({ antialias: true })
	document.body.appendChild(renderer.domElement)


	// Lights

	const directionalLight = new THREE.DirectionalLight('white')
	directionalLight.position.set(2, 3, 4)
	scene.add(directionalLight)

	const ambientLight = new THREE.AmbientLight('white', 0.3)
	scene.add(ambientLight)


	// OrbitControls

	const controls = new OrbitControls(camera, renderer.domElement)


	// Grid

	const grid = new THREE.GridHelper()
	grid.position.y = -1
	scene.add(grid)


	// Mesh

	const geometry = new THREE.BoxGeometry()
	const material = new THREE.MeshStandardMaterial({ color: 'palegreen' })
	const mesh = new THREE.Mesh(geometry, material)

	scene.add(mesh)

	
	// GUI
	
	const params = {}
	const gui = new GUI()
	
	params.speed = 1
	gui.add(params, 'speed').step(0.1).min(0).max(2)


	// Render loop

	const clock = new THREE.Clock()

	let prevElapsedTime = 0

	function render() {

		const elapsedTime = clock.getElapsedTime()
		const dt = elapsedTime - prevElapsedTime
		prevElapsedTime = elapsedTime

		controls.update()

		mesh.rotation.x = mesh.rotation.y += dt * params.speed

		renderer.render(scene, camera)

	}

	renderer.setAnimationLoop(render)


	// Window sizing

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		renderer.setSize(window.innerWidth, window.innerHeight)

	}

	window.addEventListener('resize', onWindowResize, false)

	onWindowResize() // Run once to initialize

}

main()
`
