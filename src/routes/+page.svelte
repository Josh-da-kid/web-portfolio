<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { browser } from '$app/environment';

	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Contact from '$lib/components/Contact.svelte';

	import { lenisInstance, isLoaded, currentSection } from '$lib/stores';

	onMount(async () => {
		const gsapModule = await import('gsap');
		const gsap = gsapModule.default;
		const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

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

		lenis.on('scroll', (e) => {
			currentSection.set(e.direction);
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		isLoaded.set(true);

		gsap.ticker.add((time) => {
			lenis.raf(time);
		});

		gsap.ticker.lagSmoothing(0);
	});
</script>

<Navbar />

<main>
	<Hero />
	<About />
	<Projects />
	<Contact />
</main>
