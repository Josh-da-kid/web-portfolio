<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { currentSection, lenisInstance, isModalOpen } from '$lib/stores';
	import type { Project } from '$lib/types';

	let projectsRef: HTMLElement;
	let expandedProject: Project | null = $state(null);
	let lenis: any;

	// Get lenis instance from store
	lenisInstance.subscribe((value) => {
		lenis = value;
	});

	// Prevent body scroll when modal is open
	$effect(() => {
		if (!browser) return;

		if (expandedProject) {
			if (lenis) lenis.stop();
			isModalOpen.set(true);
		} else {
			if (lenis) lenis.start();
			isModalOpen.set(false);
		}
	});
	let gsapModule: typeof import('gsap').default;

	const projects: Project[] = [
		{
			id: 1,
			title: 'Nebula Dashboard',
			description:
				'A futuristic analytics dashboard with real-time data visualization, 3D charts, and AI-powered insights.',
			tech: ['React', 'Three.js', 'D3.js'],
			image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
			color: '#00ffff',
			liveUrl: '#',
			githubUrl: '#'
		},
		{
			id: 2,
			title: 'Quantum Commerce',
			description:
				'An immersive shopping experience with 3D product previews and AR try-on features.',
			tech: ['Svelte', 'WebXR', 'Stripe'],
			image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200',
			color: '#ff00ff',
			liveUrl: '#',
			githubUrl: '#'
		},
		{
			id: 3,
			title: 'Synapse Social',
			description:
				'A next-generation social platform with 3D virtual spaces and real-time collaboration.',
			tech: ['Next.js', 'Socket.io', 'Three.js'],
			image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200',
			color: '#00ff88',
			liveUrl: '#',
			githubUrl: '#'
		},
		{
			id: 4,
			title: 'Vortex Portfolio',
			description:
				'An award-winning portfolio template featuring particle physics and WebGL effects.',
			tech: ['Svelte', 'GSAP', 'Three.js'],
			image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200',
			color: '#ff8800',
			liveUrl: '#',
			githubUrl: '#'
		}
	];

	onMount(async () => {
		const gsapImport = await import('gsap');
		gsapModule = gsapImport.default;
		const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
		gsapModule.registerPlugin(ScrollTrigger);

		if (projectsRef) {
			gsapModule.fromTo(
				'.projects-label',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					scrollTrigger: {
						trigger: projectsRef,
						start: 'top 80%'
					}
				}
			);

			gsapModule.fromTo(
				'.projects-title',
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					scrollTrigger: {
						trigger: projectsRef,
						start: 'top 70%'
					}
				}
			);

			gsapModule.fromTo(
				'.project-card',
				{ opacity: 0, y: 60 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					stagger: 0.15,
					scrollTrigger: {
						trigger: '.projects-grid',
						start: 'top 80%'
					}
				}
			);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						currentSection.set('projects');
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (projectsRef) observer.observe(projectsRef);

		return () => observer.disconnect();
	});

	function openProject(project: Project) {
		expandedProject = project;
		document.body.style.overflow = 'hidden';

		gsapModule?.fromTo(
			'.project-overlay',
			{ opacity: 0 },
			{ opacity: 1, duration: 0.4, ease: 'power2.out' }
		);

		gsapModule?.fromTo(
			'.project-modal',
			{ opacity: 0, y: 50, scale: 0.95 },
			{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
		);
	}

	function closeProject() {
		gsapModule?.to('.project-modal', {
			opacity: 0,
			y: 30,
			scale: 0.95,
			duration: 0.3,
			ease: 'power2.in'
		});

		gsapModule?.to('.project-overlay', {
			opacity: 0,
			duration: 0.3,
			onComplete: () => {
				expandedProject = null;
				document.body.style.overflow = '';
			}
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && expandedProject) {
			closeProject();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<section
	id="projects"
	bind:this={projectsRef}
	class="relative min-h-screen px-6 py-32 md:px-12 lg:px-24"
>
	<!-- Background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="bg-magenta-500/5 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl"></div>
		<div class="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl">
		<!-- Section header -->
		<div class="mb-20 md:mb-32">
			<span
				class="projects-label mb-4 block font-manrope text-sm font-medium tracking-widest text-cyan-400 uppercase"
			>
				Projects
			</span>
			<h2 class="projects-title font-syne text-5xl font-bold text-white md:text-7xl lg:text-8xl">
				Selected<br /><span class="text-gray-600">Work</span>
			</h2>
		</div>

		<!-- Projects grid -->
		<div class="projects-grid grid gap-8 md:grid-cols-2">
			{#each projects as project, index}
				<div
					class="project-card group relative cursor-pointer overflow-hidden rounded-3xl bg-white/[0.02] text-left transition-all duration-500 hover:bg-white/[0.05]"
					onclick={() => openProject(project)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && openProject(project)}
				>
					<!-- Image container -->
					<div class="relative aspect-[4/3] overflow-hidden">
						<img
							src={project.image}
							alt={project.title}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
						/>
						<div
							class="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent"
						></div>

						<!-- Project number -->
						<div
							class="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-md"
						>
							<span class="font-syne text-sm font-bold text-white">0{index + 1}</span>
						</div>
					</div>

					<!-- Content -->
					<div class="relative p-8">
						<h3
							class="mb-3 font-syne text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400"
						>
							{project.title}
						</h3>
						<p class="mb-6 font-space text-base leading-relaxed text-gray-400">
							{project.description}
						</p>

						<!-- Tech tags -->
						<div class="flex flex-wrap gap-2">
							{#each project.tech as tech}
								<span
									class="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-manrope text-xs text-gray-400"
								>
									{tech}
								</span>
							{/each}
						</div>

						<!-- Arrow - links to demo -->
						<a
							href={project.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="group arrow-link absolute right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-300 hover:translate-x-1 hover:border-cyan-400 hover:bg-cyan-400/20"
						>
							<svg
								class="group-hover:arrow-bounce h-5 w-5 text-white transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								></path>
							</svg>
						</a>
					</div>

					<!-- Hover glow -->
					<div
						class="absolute inset-0 opacity-0 transition-opacity duration-500"
						style="background: radial-gradient(circle at 50% 50%, {project.color}10 0%, transparent 70%)"
						class:opacity-100={false}
					></div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Project overlay -->
	{#if expandedProject}
		<div
			class="project-overlay fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
			role="dialog"
			aria-modal="true"
		>
			<button
				class="absolute inset-0 bg-dark/95 backdrop-blur-xl"
				onclick={closeProject}
				aria-label="Close"
			></button>

			<div
				class="project-modal relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-dark"
				onwheel={(e) => e.stopPropagation()}
			>
				<!-- Image -->
				<div class="relative aspect-video">
					<img
						src={expandedProject.image}
						alt={expandedProject.title}
						class="h-full w-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>

					<!-- Close button (X) -->
					<button
						class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-white/20"
						onclick={closeProject}
						aria-label="Close"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>

				<!-- Content -->
				<div class="p-6 md:p-10 lg:p-12">
					<h3 class="mb-3 font-syne text-3xl font-bold text-white md:text-4xl lg:text-5xl">
						{expandedProject.title}
					</h3>

					<p class="mb-6 font-space text-base leading-relaxed text-gray-300 md:text-lg lg:text-xl">
						{expandedProject.description}
					</p>

					<!-- Tech stack -->
					<div class="mb-6 md:mb-8">
						<h4
							class="mb-3 font-manrope text-sm font-medium tracking-widest text-gray-500 uppercase md:mb-4"
						>
							Technologies
						</h4>
						<div class="flex flex-wrap gap-2 md:gap-3">
							{#each expandedProject.tech as tech}
								<span
									class="rounded-full border px-3 py-1.5 font-manrope text-xs md:px-5 md:py-2 md:text-sm"
									style="border-color: {expandedProject.color}40; background: {expandedProject.color}10; color: {expandedProject.color}"
								>
									{tech}
								</span>
							{/each}
						</div>
					</div>

					<!-- Links -->
					<div class="flex gap-4">
						<a
							href={expandedProject.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-dark transition-all hover:scale-105"
						>
							<span>View Live</span>
							<svg
								class="h-5 w-5 transition-transform group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								></path>
							</svg>
						</a>
						<a
							href={expandedProject.githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 font-semibold text-white transition-all hover:border-white/60 hover:bg-white/5"
						>
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
								></path>
							</svg>
							<span>GitHub</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
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

	@keyframes arrow-bounce {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}

	.arrow-link:hover .arrow-bounce {
		animation: arrow-bounce 0.5s ease-in-out infinite;
	}

	.project-modal::-webkit-scrollbar {
		width: 6px;
	}

	.project-modal::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
	}

	.project-modal::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #00ffff, #ff00ff);
		border-radius: 3px;
	}
</style>
