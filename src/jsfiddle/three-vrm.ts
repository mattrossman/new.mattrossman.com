export const html = /* html */ `
<base href="https://rawcdn.githack.com/mrdoob/three.js/r151/examples/" />
<script async src="https://cdn.jsdelivr.net/npm/es-module-shims@1.3.6/dist/es-module-shims.js"></script>
<script type="importmap">
	{
		"imports": {
			"three": "https://cdn.jsdelivr.net/npm/three@^0.151.0/build/three.module.js",
			"three/addons/": "https://cdn.jsdelivr.net/npm/three@^0.151.0/examples/jsm/",
			"@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@1.0.10/lib/three-vrm.module.min.js"
		}
	}
</script>
`

export const css = /* css */ `
body {
	background-color: lightblue;
}

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
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const VRM_URL = "https://rawcdn.githack.com/pixiv/three-vrm/0f9fd31a0baeb16587365eb5597ebb4012f42e46/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm"

let scene, camera, renderer
let orbitControls, clock
let currentVrm

init().then(animate)

async function init() {

	scene = new THREE.Scene()

	camera = new THREE.PerspectiveCamera(75, undefined, 0.1, 1000)
	camera.position.set(-0.2, 1.5, 1)
	
	clock = new THREE.Clock()

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.outputEncoding = THREE.sRGBEncoding
	document.body.appendChild(renderer.domElement)

	orbitControls = new OrbitControls(camera, renderer.domElement)
	orbitControls.target.set(0, 1, 0)
	
	const ambientLight = new THREE.AmbientLight()
	scene.add(ambientLight)
	
	const directionalLight = new THREE.DirectionalLight()
	scene.add(directionalLight)
	
	const gltfLoader = new GLTFLoader()
	gltfLoader.register( ( parser ) => {
		return new VRMLoaderPlugin( parser );
	} );
	
	const gltf = await gltfLoader.loadAsync(VRM_URL)
	currentVrm = gltf.userData.vrm
	
	VRMUtils.removeUnnecessaryVertices( gltf.scene );
	VRMUtils.removeUnnecessaryJoints( gltf.scene );
	VRMUtils.rotateVRM0( gltf.scene )
	
	scene.add(gltf.scene)

	onWindowResize()
	
	window.addEventListener('resize', onWindowResize, false)
	
}

function animate() {

	const dt = clock.getDelta()

	orbitControls.update()
	
	if (currentVrm) {
		currentVrm.update(dt)
	}

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
