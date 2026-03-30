<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as THREE from 'three';
	import {
		createScene,
		createCamera,
		createRenderer,
		createFloatingShapes,
		createParticleSystem,
		createLights,
		updateFloatingShapes,
		handleResize
	} from '$lib/three/scene';
	import {
		cursorPosition,
		currentSection,
		cursorLabel,
		activeElement,
		hasInteracted
	} from '$lib/stores';

	let canvasRef: HTMLCanvasElement;
	let heroRef: HTMLElement;

	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let floatingShapes: THREE.Group;
	let particles: THREE.Points;
	let lights: THREE.Group;
	let animationId: number;
	let clock: THREE.Clock;
	let gsapModule: typeof import('gsap').default;

	const developerName = 'Josiah Andrew';
	const firstName = developerName.split(' ')[0];
	const lastName = developerName.split(' ')[1];
	const tagline = 'Building digital experiences that feel like magic';

	let mouseX = $state(0);
	let mouseY = $state(0);
	let isHoveringFirst = $state(false);
	let isHoveringLast = $state(false);
	let hasHovered = $state(false);

	onMount(async () => {
		if (!browser || !canvasRef) return;

		const gsapImport = await import('gsap');
		gsapModule = gsapImport.default;
		const gsap = gsapImport.default;
		const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Initialize Three.js scene
		scene = createScene();
		camera = createCamera(window.innerWidth / window.innerHeight);
		renderer = createRenderer(canvasRef);

		// Add elements to scene
		lights = createLights();
		scene.add(lights);

		floatingShapes = createFloatingShapes();
		scene.add(floatingShapes);

		particles = createParticleSystem(2000);
		scene.add(particles);

		clock = new THREE.Clock();

		// Enhanced entrance animation with staggered letters
		const tl = gsapModule.timeline({ delay: 0.2 });

		// Animate each letter of first name with 3D flip
		tl.fromTo(
			'.first-name span',
			{
				y: 120,
				opacity: 0,
				rotateX: -90,
				scale: 0.5,
				filter: 'blur(10px)'
			},
			{
				y: 0,
				opacity: 1,
				rotateX: 0,
				scale: 1,
				filter: 'blur(0px)',
				duration: 1.2,
				stagger: 0.08,
				ease: 'power4.out'
			}
		)
			// Animate each letter of last name
			.fromTo(
				'.last-name span',
				{
					y: 120,
					opacity: 0,
					rotateX: -90,
					scale: 0.5,
					filter: 'blur(10px)'
				},
				{
					y: 0,
					opacity: 1,
					rotateX: 0,
					scale: 1,
					filter: 'blur(0px)',
					duration: 1.2,
					stagger: 0.08,
					ease: 'power4.out'
				},
				'-=0.8'
			)
			// Tagline fade in
			.fromTo(
				'.hero-tagline',
				{ opacity: 0, y: 30, filter: 'blur(5px)' },
				{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
				'-=0.5'
			)
			// CTA buttons
			.fromTo(
				'.hero-cta',
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
				'-=0.4'
			)
			// Scroll indicator
			.fromTo(
				'.scroll-indicator',
				{ opacity: 0 },
				{ opacity: 1, duration: 0.6, ease: 'power2.out' },
				'-=0.3'
			);

		// Animate particles rotation
		gsapModule?.fromTo(
			particles.rotation,
			{ y: 0 },
			{ y: Math.PI * 2, duration: 60, repeat: -1, ease: 'none' }
		);

		// Animation loop
		function animate() {
			animationId = requestAnimationFrame(animate);

			const time = clock.getElapsedTime();

			// Update floating shapes
			updateFloatingShapes(floatingShapes, time);

			// Subtle camera movement based on cursor
			const cursorInfluence = 0.03;
			camera.position.x += ($cursorPosition.x * cursorInfluence - camera.position.x) * 0.02;
			camera.position.y += (-$cursorPosition.y * cursorInfluence - camera.position.y) * 0.02;
			camera.lookAt(scene.position);

			// Subtle particle movement
			particles.rotation.x = time * 0.02;
			particles.rotation.y = time * 0.01;

			renderer.render(scene, camera);
		}

		animate();

		// Handle resize
		window.addEventListener('resize', () => handleResize(camera, renderer));

		// Update current section
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						currentSection.set('hero');
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (heroRef) observer.observe(heroRef);

		return () => {
			window.removeEventListener('resize', () => handleResize(camera, renderer));
			observer.disconnect();
			if (animationId) cancelAnimationFrame(animationId);
			renderer.dispose();
		};
	});

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;

		cursorPosition.set({
			x: (event.clientX / window.innerWidth) * 2 - 1,
			y: (event.clientY / window.innerHeight) * 2 - 1
		});
	}

	function handleEnterFirst() {
		console.log('🎯 Enter First Name');
		isHoveringFirst = true;
		hasHovered = true;
		activeElement.set('hero-name');
		hasInteracted.set(true);
		cursorLabel.set('Cool right?');
		console.log('Label set to: Cool right?');

		gsapModule?.to('.first-name span span', {
			y: -15,
			scale: 1.1,
			textShadow: '0 0 30px rgba(255,255,255,0.5)',
			duration: 0.4,
			stagger: 0.03,
			ease: 'power2.out'
		});
	}

	function handleLeaveFirst() {
		isHoveringFirst = false;
		cursorLabel.set('Hover over my name');
		activeElement.set('');

		gsapModule?.to('.first-name span span', {
			y: 0,
			scale: 1,
			textShadow: '0 0 0px rgba(255,255,255,0)',
			duration: 0.4,
			stagger: 0.02,
			ease: 'power2.out'
		});
	}

	function handleEnterLast() {
		isHoveringLast = true;
		hasHovered = true;
		activeElement.set('hero-name');
		cursorLabel.set('Cool right?');

		gsapModule?.to('.last-name > span:first-child span', {
			y: -15,
			scale: 1.1,
			duration: 0.4,
			stagger: 0.03,
			ease: 'power2.out'
		});

		gsapModule?.fromTo(
			'.glitch-layer',
			{ opacity: 0, x: -5 },
			{
				opacity: [0, 1, 0, 1, 0],
				x: [-3, 3, -3, 3, 0],
				duration: 0.4,
				ease: 'power2.inOut'
			}
		);
	}

	function handleLeaveLast() {
		isHoveringLast = false;
		cursorLabel.set('Hover over my name');
		activeElement.set('');

		gsapModule?.to('.last-name > span:first-child span', {
			y: 0,
			scale: 1,
			duration: 0.4,
			stagger: 0.02,
			ease: 'power2.out'
		});
	}

	function scrollToProjects() {
		const projectsSection = document.getElementById('projects');
		if (projectsSection) {
			projectsSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section
	id="hero"
	aria-label="Hero"
	bind:this={heroRef}
	class="relative h-screen w-full overflow-hidden"
	onmousemove={handleMouseMove}
	onmouseleave={() => {
		isHoveringFirst = false;
		isHoveringLast = false;
		cursorLabel.set('You');
		activeElement.set('');
	}}
>
	<!-- Three.js Canvas Background -->
	<canvas bind:this={canvasRef} class="absolute inset-0 h-full w-full"></canvas>

	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-linear-to-b from-dark/80 via-dark/40 to-dark"></div>

	<!-- Hero Content -->
	<div class="relative z-10 flex h-full flex-col items-center justify-center px-6">
		<!-- Main heading with letter-by-letter animation -->
		<h1
			class="hero-title font-syne mb-8 text-center text-7xl leading-[0.9] font-bold tracking-tight md:text-[7rem] lg:text-[9rem] xl:text-[10rem]"
		>
			<!-- First Name - White -->
			<span class="first-name perspective-1000 block">
				<span
					class="inline-block cursor-pointer select-none"
					onmouseenter={handleEnterFirst}
					onmouseleave={handleLeaveFirst}
				>
					{#each firstName.split('') as char, i}
						<span class="inline-block text-white">{char}</span>
					{/each}
				</span>
			</span>

			<!-- Last Name - Gradient with effects -->
			<span class="last-name relative block">
				<span
					class="via-magenta-400 bg-300% animate-gradient relative z-10 inline-block cursor-pointer bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent select-none"
					onmouseenter={handleEnterLast}
					onmouseleave={handleLeaveLast}
				>
					{#each lastName.split('') as char, i}
						<span class="inline-block text-cyan-400">{char}</span>
					{/each}
				</span>

				<!-- Glitch layers -->
				<span class="glitch-layer pointer-events-none absolute inset-0 z-0">
					<span class="absolute top-0 left-0 text-cyan-400 mix-blend-screen">{lastName}</span>
					<span class="text-magenta-400 absolute top-0 left-0 mix-blend-screen">{lastName}</span>
				</span>
			</span>
		</h1>

		<!-- Tagline -->
		<p
			class="hero-tagline font-space mb-12 max-w-xl text-center text-lg tracking-wide text-gray-400 md:text-xl"
		>
			{tagline}
		</p>

		<!-- CTA Buttons -->
		<div class="hero-cta relative z-20 flex items-center gap-6">
			<button
				onclick={scrollToProjects}
				class="group relative overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-dark transition-all duration-500 hover:scale-105"
			>
				<span class="relative z-10">View Work</span>
				<div
					class="to-magenta-400 absolute inset-0 -translate-x-full bg-linear-to-r from-cyan-400 transition-transform duration-500 group-hover:translate-x-0"
				></div>
			</button>

			<a
				href="#contact"
				class="group flex items-center gap-3 font-medium text-white transition-colors duration-300 hover:text-cyan-400"
			>
				<span>Get in touch</span>
				<span
					class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 transition-all duration-300 group-hover:translate-x-1 group-hover:border-cyan-400"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						></path>
					</svg>
				</span>
			</a>
		</div>

		<!-- Scroll indicator -->
		<div class="scroll-indicator absolute bottom-12 left-1/2 z-10 -translate-x-1/2">
			<div class="flex flex-col items-center gap-3">
				<span class="font-manrope text-xs tracking-[0.2em] text-gray-500 uppercase">Scroll</span>
				<div class="h-12 w-px overflow-hidden bg-gray-800">
					<div
						class="animate-scroll-down to-magenta-400 h-full w-full bg-gradient-to-b from-cyan-400"
					></div>
				</div>
			</div>
		</div>

		<!-- Hint - Interactive tooltip -->
		{#if !isHoveringFirst && !isHoveringLast}
			<p
				class="font-manrope absolute top-1/2 right-4 -translate-y-1/2 animate-pulse text-sm text-gray-500"
				style="writing-mode: vertical-rl; text-orientation: mixed;"
			>
				{hasHovered ? 'Hover again →' : 'Hover over my name →'}
			</p>
		{/if}
	</div>
</section>

<style>
	@keyframes gradient {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	@keyframes scroll-down {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(100%);
		}
	}

	.animate-gradient {
		background-size: 200% 200%;
		animation: gradient 4s ease infinite;
		-webkit-background-clip: text;
		background-clip: text;
	}

	.animate-scroll-down {
		animation: scroll-down 2s ease-in-out infinite;
	}

	.font-syne {
		font-family: 'Syne', sans-serif;
	}
	.font-space {
		font-family: 'Space Grotesk', sans-serif;
	}
	.font-manrope {
		font-family: 'Manrope', sans-serif;
	}
	.perspective-1000 {
		perspective: 1000px;
	}
</style>
