import * as THREE from 'three';

/**
 * Creates a Three.js scene with optimized settings for performance
 */
export function createScene(): THREE.Scene {
	const scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x0a0a0f, 0.002);
	return scene;
}

/**
 * Creates a perspective camera with cinematic settings
 */
export function createCamera(aspect: number): THREE.PerspectiveCamera {
	const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
	camera.position.z = 30;
	return camera;
}

/**
 * Creates WebGL renderer with antialiasing and performance optimizations
 */
export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
		powerPreference: 'high-performance'
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x0a0a0f, 1);
	return renderer;
}

/**
 * Creates floating geometric shapes with glowing materials
 */
export function createFloatingShapes(): THREE.Group {
	const group = new THREE.Group();

	const geometries = [
		new THREE.IcosahedronGeometry(1, 0),
		new THREE.OctahedronGeometry(1, 0),
		new THREE.TetrahedronGeometry(1, 0),
		new THREE.TorusGeometry(0.7, 0.3, 16, 32),
		new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8)
	];

	const colors = [
		0x00ffff, // cyan
		0xff00ff, // magenta
		0x00ff88, // neon green
		0xff8800, // orange
		0x8800ff // purple
	];

	// Create 15 floating shapes
	for (let i = 0; i < 15; i++) {
		const geometry = geometries[i % geometries.length];
		const color = colors[i % colors.length];

		// Create glowing material using MeshStandardMaterial with emissive
		const material = new THREE.MeshStandardMaterial({
			color: color,
			emissive: color,
			emissiveIntensity: 0.5,
			metalness: 0.8,
			roughness: 0.2,
			transparent: true,
			opacity: 0.8
		});

		const mesh = new THREE.Mesh(geometry, material);

		// Random position within a large sphere
		mesh.position.set(
			(Math.random() - 0.5) * 60,
			(Math.random() - 0.5) * 40,
			(Math.random() - 0.5) * 30
		);

		// Random scale
		const scale = 0.5 + Math.random() * 1.5;
		mesh.scale.set(scale, scale, scale);

		// Random rotation
		mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

		// Store animation properties
		(mesh as any).rotationSpeed = {
			x: (Math.random() - 0.5) * 0.02,
			y: (Math.random() - 0.5) * 0.02,
			z: (Math.random() - 0.5) * 0.02
		};

		(mesh as any).floatSpeed = 0.001 + Math.random() * 0.002;
		(mesh as any).initialY = mesh.position.y;

		group.add(mesh);
	}

	return group;
}

/**
 * Creates a particle system for background effects
 */
export function createParticleSystem(count: number = 2000): THREE.Points {
	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);
	const colors = new Float32Array(count * 3);

	for (let i = 0; i < count; i++) {
		// Position in a large sphere
		positions[i * 3] = (Math.random() - 0.5) * 100;
		positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
		positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

		// Color variation - cyan to magenta
		const color = new THREE.Color();
		color.setHSL(0.5 + Math.random() * 0.3, 1, 0.5 + Math.random() * 0.3);
		colors[i * 3] = color.r;
		colors[i * 3 + 1] = color.g;
		colors[i * 3 + 2] = color.b;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

	const material = new THREE.PointsMaterial({
		size: 0.1,
		vertexColors: true,
		transparent: true,
		opacity: 0.6,
		blending: THREE.AdditiveBlending
	});

	return new THREE.Points(geometry, material);
}

/**
 * Creates ambient and point lights for dramatic lighting
 */
export function createLights(): THREE.Group {
	const group = new THREE.Group();

	// Ambient light for base illumination
	const ambient = new THREE.AmbientLight(0x404040, 0.5);
	group.add(ambient);

	// Main directional light
	const directional = new THREE.DirectionalLight(0xffffff, 1);
	directional.position.set(10, 10, 10);
	group.add(directional);

	// Colored point lights for neon effect
	const colors = [0x00ffff, 0xff00ff, 0x00ff88];
	const positions = [
		{ x: -20, y: 10, z: 10 },
		{ x: 20, y: -10, z: 10 },
		{ x: 0, y: 20, z: -10 }
	];

	positions.forEach((pos, i) => {
		const light = new THREE.PointLight(colors[i], 2, 50);
		light.position.set(pos.x, pos.y, pos.z);
		group.add(light);
	});

	return group;
}

/**
 * Updates floating shapes animation
 */
export function updateFloatingShapes(group: THREE.Group, time: number): void {
	group.children.forEach((child) => {
		if (child instanceof THREE.Mesh) {
			const props = child as any;

			// Rotation
			child.rotation.x += props.rotationSpeed?.x || 0;
			child.rotation.y += props.rotationSpeed?.y || 0;
			child.rotation.z += props.rotationSpeed?.z || 0;

			// Floating motion
			if (props.initialY !== undefined && props.floatSpeed) {
				child.position.y = props.initialY + Math.sin(time * props.floatSpeed * 1000) * 2;
			}
		}
	});
}

/**
 * Handles window resize for Three.js
 */
export function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
