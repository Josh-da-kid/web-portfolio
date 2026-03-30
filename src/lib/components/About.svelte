<script lang="ts">
	import { onMount } from 'svelte';
	import { currentSection, cursorPosition } from '$lib/stores';
	import type { Skill } from '$lib/types';

	let aboutRef: HTMLElement;
	let hoveredSkill: number | null = $state(null);

	const skills: Skill[] = [
		{ name: 'Svelte', icon: 'S', level: 90, color: '#FF3E00' },
		{ name: 'CSS', icon: 'CSS', level: 95, color: '#61DAFB' },
		{ name: 'TypeScript', icon: 'TS', level: 92, color: '#3178C6' },
		{ name: 'Three.js', icon: '3D', level: 85, color: '#000000' },
		{ name: 'GSAP', icon: 'G', level: 88, color: '#88CE02' },
		{ name: 'Tailwind', icon: 'TW', level: 95, color: '#06B6D4' },
		{ name: 'Node.js', icon: 'N', level: 85, color: '#339933' },
		{
			name: 'HTML 5',
			icon: 'H',
			level: 80,
			color: '#f03413'
		}
	];

	onMount(async () => {
		const gsapModule = await import('gsap');
		const gsap = gsapModule.default;
		// @ts-ignore - ScrollTrigger is available on the gsap object
		const ScrollTrigger = gsap.ScrollTrigger || (await import('gsap')).ScrollTrigger;
		gsap.registerPlugin(ScrollTrigger);

		// GSAP scroll-triggered animations
		if (aboutRef) {
			gsap.fromTo(
				'.about-label',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					scrollTrigger: {
						trigger: aboutRef,
						start: 'top 80%'
					}
				}
			);

			gsap.fromTo(
				'.about-title',
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					scrollTrigger: {
						trigger: aboutRef,
						start: 'top 70%'
					}
				}
			);

			gsap.fromTo(
				'.about-text',
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					delay: 0.2,
					scrollTrigger: {
						trigger: aboutRef,
						start: 'top 60%'
					}
				}
			);

			gsap.fromTo(
				'.skill-card',
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.08,
					scrollTrigger: {
						trigger: '.skills-grid',
						start: 'top 85%'
					}
				}
			);
		}

		// Section observer
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						currentSection.set('about');
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (aboutRef) observer.observe(aboutRef);

		return () => observer.disconnect();
	});
</script>

<section id="about" bind:this={aboutRef} class="relative min-h-screen px-6 py-32 md:px-12 lg:px-24">
	<!-- Background accents -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl"
			style="transform: translate({$cursorPosition.x * 10}px, {$cursorPosition.y * 10}px)"
		></div>
		<div
			class="bg-magenta-500/5 absolute top-1/2 -right-32 h-80 w-80 rounded-full blur-3xl"
			style="transform: translate({-$cursorPosition.x * 15}px, {-$cursorPosition.y * 15}px)"
		></div>
	</div>

	<div class="relative z-10 mx-auto max-w-6xl">
		<!-- Section header -->
		<div class="mb-20 md:mb-32">
			<span
				class="about-label mb-4 block font-manrope text-sm font-medium tracking-widest text-cyan-400 uppercase"
			>
				About
			</span>
			<h2
				class="about-title font-syne text-5xl leading-tight font-bold text-white md:text-7xl lg:text-8xl"
			>
				Building the<br />
				<span class="text-gray-600">future of web</span>
			</h2>
		</div>

		<!-- Bio and stats -->
		<div class="mb-24 grid gap-12 md:grid-cols-2 md:gap-24">
			<div class="about-text">
				<p class="mb-6 font-space text-xl leading-relaxed text-gray-300 md:text-2xl">
					I'm a creative frontend developer specializing in building immersive, interactive web
					experiences that push the boundaries of what's possible in the browser.
				</p>
				<p class="font-manrope text-lg leading-relaxed text-gray-500">
					With expertise in modern JavaScript frameworks, WebGL, and creative coding, I transform
					complex ideas into elegant, performant, and unforgettable digital experiences.
				</p>

				<!-- Stats -->
				<div class="mt-12 flex gap-12">
					<div>
						<span class="font-syne text-4xl font-bold text-white">2+</span>
						<p class="mt-1 font-manrope text-sm text-gray-500">Years Experience</p>
					</div>
					<div>
						<span class="font-syne text-4xl font-bold text-white">30+</span>
						<p class="mt-1 font-manrope text-sm text-gray-500">Projects</p>
					</div>
					<div>
						<span class="font-syne text-4xl font-bold text-white">10+</span>
						<p class="mt-1 font-manrope text-sm text-gray-500">Clients</p>
					</div>
				</div>
			</div>

			<!-- Visual element -->
			<div class="relative flex items-center justify-center">
				<div class="relative h-64 w-64 md:h-80 md:w-80">
					<div class="absolute inset-0 rotate-12 rounded-2xl border border-cyan-500/20"></div>
					<div class="border-magenta-500/20 absolute inset-0 -rotate-12 rounded-2xl border"></div>
					<div
						class="to-magenta-500/10 absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10"
					>
						<div
							class="to-magenta-500 h-32 w-32 animate-pulse rounded-2xl bg-gradient-to-br from-cyan-500"
						></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Skills -->
		<div>
			<h3 class="mb-12 font-manrope text-lg font-medium tracking-widest text-gray-500 uppercase">
				Technical Skills
			</h3>
			<div class="skills-grid grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
				{#each skills as skill, index}
					<button
						class="skill-card group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-left transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.05]"
						onmouseenter={() => (hoveredSkill = index)}
						onmouseleave={() => (hoveredSkill = null)}
					>
						<div
							class="absolute inset-0 opacity-0 transition-opacity duration-500"
							style="background: radial-gradient(circle at center, {skill.color}15 0%, transparent 70%)"
							class:opacity-100={hoveredSkill === index}
						></div>

						<div class="relative z-10">
							<span
								class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold"
								style="background: {skill.color}20; color: {skill.color}; border: 1px solid {skill.color}40"
								>{skill.icon}</span
							>
							<h4 class="font-syne text-lg font-semibold text-white">{skill.name}</h4>
							<div class="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-800">
								<div
									class="h-full rounded-full transition-all duration-1000 ease-out"
									style="width: {hoveredSkill === index
										? skill.level
										: 0}%; background: {skill.color}"
								></div>
							</div>
							<span class="mt-1 block text-xs text-gray-500">{skill.level}%</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.font-syne {
		font-family: 'Syne', sans-serif;
	}

	.font-space {
		font-family: 'Space Grotesk', sans-serif;
	}

	.font-manrope {
		font-family: 'Manrope', sans-serif;
	}
</style>
