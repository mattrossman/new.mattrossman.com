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

<template id="vertex-shader">
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
</template>

<template id="fragment-shader">
uniform vec3 color;

void main() {
	gl_FragColor = vec4(color, 1.0);
}
</template>
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
import { GUI } from 'lil-gui'

let scene, camera, renderer
let mesh, orbitControls, clock
let params

init().then(animate)

async function init() {

	params = {
		color: "#ff0000"
	}
	
	scene = new THREE.Scene()
	scene.background = new THREE.Color('black')

	camera = new THREE.PerspectiveCamera(75, undefined, 0.1, 1000)
	camera.position.set(1, 2, 3)
	
	clock = new THREE.Clock()

	const directionalLight = new THREE.DirectionalLight('white', Math.PI)
	directionalLight.position.set(2, 3, 4)
	scene.add(directionalLight)

	const ambientLight = new THREE.AmbientLight('white', 0.3 * Math.PI)
	scene.add(ambientLight)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	document.body.appendChild(renderer.domElement)

	orbitControls = new OrbitControls(camera, renderer.domElement)

	const grid = new THREE.GridHelper()
	grid.position.y = -1
	scene.add(grid)
	
	const vertexShader = document.querySelector("#vertex-shader").content.textContent
	const fragmentShader = document.querySelector("#fragment-shader").content.textContent
	const uniforms = {
		color: { value: new THREE.Color(params.color) }
	}
	
	const geometry = new THREE.SphereGeometry()
	const material = new THREE.ShaderMaterial({
		uniforms,
		vertexShader,
		fragmentShader
	})
	
	mesh = new THREE.Mesh(geometry, material)
	scene.add(mesh)

	const gui = new GUI()
	gui.addColor(params, "color").onChange(value => uniforms.color.value.set(value))
	
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
