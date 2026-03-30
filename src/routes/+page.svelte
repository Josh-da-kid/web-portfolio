<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';

	import { lenisInstance, isLoaded } from '$lib/stores';

	gsap.registerPlugin(ScrollTrigger);

	onMount(() => {
		// Initialize Lenis smooth scrolling
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			infinite: false
		});

		lenisInstance.set(lenis);

		// Connect Lenis to GSAP ScrollTrigger
		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);

		// Mark as loaded
		setTimeout(() => {
			isLoaded.set(true);
		}, 100);

		return () => {
			lenis.destroy();
		};
	});
</script>

<svelte:head>
	<title>Josiah Andrew | Creative Frontend Developer</title>
	<meta
		name="description"
		content="Creative frontend developer specializing in immersive 3D web experiences, interactive portfolios, and cutting-edge web applications."
	/>
	<meta
		name="keywords"
		content="frontend developer, web developer, 3D web, Three.js, GSAP, Svelte, portfolio"
	/>
	<meta property="og:title" content="Josiah Andrew | Creative Frontend Developer" />
	<meta
		property="og:description"
		content="Crafting immersive digital experiences with cutting-edge technology"
	/>
	<meta property="og:type" content="website" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Custom cursor -->
<div
	class="custom-cursor pointer-events-none fixed z-100 hidden h-4 w-4 rounded-full mix-blend-difference md:block"
	style="background: cyan; transform: translate(-50%, -50%);"
></div>

<div class="app-wrapper min-h-screen bg-dark text-white">
	<!-- Navigation -->
	<Navbar />

	<!-- Main Content -->
	<main>
		<Hero />
		<About />
		<Projects />
		<Contact />
	</main>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: auto; /* Lenis handles this */
	}

	:global(body) {
		font-family:
			'Manrope',
			system-ui,
			-apple-system,
			sans-serif;
		background: #0a0a0f;
		color: #ffffff;
		overflow-x: hidden;
	}

	/* Custom scrollbar */
	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #0a0a0f;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: linear-gradient(180deg, #00ffff, #ff00ff);
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(180deg, #00cccc, #cc00cc);
	}

	/* Selection color */
	:global(::selection) {
		background: rgba(0, 255, 255, 0.3);
		color: white;
	}

	/* Lenis recommended styles */
	:global(.lenis) {
		height: auto;
	}

	:global(.lenis.lenis-smooth) {
		scroll-behavior: auto !important;
	}

	:global(.lenis.lenis-smooth [data-lenis-prevent]) {
		overscroll-behavior: contain;
	}

	:global(.lenis.lenis-stopped) {
		overflow: hidden;
	}

	:global(.lenis.lenis-scrolling iframe) {
		pointer-events: none;
	}

	/* Custom cursor movement */
	.custom-cursor {
		transition: transform 0.1s ease-out;
	}
</style>
