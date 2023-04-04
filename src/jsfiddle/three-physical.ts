import { THREE_VERSION } from './constants'

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
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GUI } from 'lil-gui'

let scene, camera, renderer
let orbitControls, clock
let params

const GLTF = 'https://rawcdn.githack.com/mrdoob/three.js/0fbae6f682f6e13dd9eb8acde02e4f50c0b73935/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf'
const HDRI = 'https://rawcdn.githack.com/mrdoob/three.js/0fbae6f682f6e13dd9eb8acde02e4f50c0b73935/examples/textures/equirectangular/venice_sunset_1k.hdr'

THREE.ColorManagement.enabled = true;

init().then(animate)

async function init() {

	params = {
	}
	
	scene = new THREE.Scene()

	camera = new THREE.PerspectiveCamera(75, undefined, 0.1, 1000)
	camera.position.set(1, 2, 3)
	
	clock = new THREE.Clock()

	const directionalLight = new THREE.DirectionalLight('white')
	directionalLight.position.set(2, 3, 4)
	scene.add(directionalLight)

	const ambientLight = new THREE.AmbientLight('white', 0.3)
	scene.add(ambientLight)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	document.body.appendChild(renderer.domElement)

	orbitControls = new OrbitControls(camera, renderer.domElement)
	
	const rgbeLoader = new RGBELoader()
	const gltfLoader = new GLTFLoader()
	
	const [ hdri, gltf ] = await Promise.all([
		rgbeLoader.loadAsync(HDRI),
		gltfLoader.loadAsync(GLTF),
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
