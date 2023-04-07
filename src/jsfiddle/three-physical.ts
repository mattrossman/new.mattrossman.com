import { THREE_VERSION, THREE_TAG } from './constants'

export const html = /* html */ `
<base href="https://rawcdn.githack.com/mrdoob/three.js/${THREE_TAG}/examples/" />
<script async src="https://cdn.jsdelivr.net/npm/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script type="importmap">
{
		"imports": {
			"three": "https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js",
			"three/addons/": "https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/examples/jsm/",
			"lil-gui": "https://cdn.jsdelivr.net/npm/lil-gui@0.18.1/dist/lil-gui.esm.min.js"
		}
}
</script>
`

export const css = /* css */ `
canvas {
	position: fixed;
	inset: 0;
}
`

export const js = /* js */ `
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GUI } from 'lil-gui'

let scene, camera, renderer
let orbitControls, clock
let params

THREE.ColorManagement.enabled = true;

init().then(animate)

async function init() {

	params = {
	}
	
	scene = new THREE.Scene()

	camera = new THREE.PerspectiveCamera(75, undefined, 0.1, 1000)
	camera.position.set(1, 2, 3)
	
	clock = new THREE.Clock()

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	document.body.appendChild(renderer.domElement)

	orbitControls = new OrbitControls(camera, renderer.domElement)
	
	const rgbeLoader = new RGBELoader()
	const gltfLoader = new GLTFLoader()
	
	const [ hdri, gltf ] = await Promise.all([
		rgbeLoader.loadAsync('textures/equirectangular/venice_sunset_1k.hdr'),
		gltfLoader.loadAsync('models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf'),
	])
	
	hdri.mapping = THREE.EquirectangularReflectionMapping
	
	scene.background = hdri
	scene.environment = hdri
	
	scene.add(gltf.scene)

	const gui = new GUI()
	
	onWindowResize()
	
	window.addEventListener('resize', onWindowResize, false)
	
}

function animate() {

	const dt = clock.getDelta()

	orbitControls.update()

	renderer.render(scene, camera)
	
	requestAnimationFrame(animate)

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.setSize(window.innerWidth, window.innerHeight)

}
`
