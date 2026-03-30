<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { currentSection, cursorPosition } from '$lib/stores';

	let contactRef: HTMLElement;
	let canvasRef: HTMLCanvasElement;
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	let name = $state('');
	let email = $state('');
	let message = $state('');

	let scene: THREE.Scene;
	let particles: THREE.Points;
	let renderer: THREE.WebGLRenderer;
	let animationId: number;
	let gsapModule: typeof import('gsap').default;

	const socialLinks = [
		{
			name: 'GitHub',
			icon: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>',
			href: 'https://github.com'
		},
		{
			name: 'LinkedIn',
			icon: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
			href: 'https://linkedin.com'
		},
		{
			name: 'Twitter',
			icon: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
			href: 'https://twitter.com'
		},
		{
			name: 'Email',
			icon: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
			href: 'mailto:hello@example.com'
		}
	];

	onMount(async () => {
		const gsapImport = await import('gsap');
		gsapModule = gsapImport.default;
		const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger');
		gsapModule.registerPlugin(ScrollTrigger);

		initParticles();

		if (contactRef) {
			gsapModule.fromTo(
				'.contact-label',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					scrollTrigger: {
						trigger: contactRef,
						start: 'top 80%'
					}
				}
			);

			gsapModule.fromTo(
				'.contact-title',
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					scrollTrigger: {
						trigger: contactRef,
						start: 'top 70%'
					}
				}
			);

			gsapModule.fromTo(
				'.contact-form',
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					delay: 0.2,
					scrollTrigger: {
						trigger: contactRef,
						start: 'top 60%'
					}
				}
			);

			gsapModule.fromTo(
				'.social-link',
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.1,
					delay: 0.4,
					scrollTrigger: {
						trigger: contactRef,
						start: 'top 50%'
					}
				}
			);
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						currentSection.set('contact');
					}
				});
			},
			{ threshold: 0.2 }
		);

		if (contactRef) observer.observe(contactRef);

		return () => {
			observer.disconnect();
			if (animationId) cancelAnimationFrame(animationId);
			if (renderer) renderer.dispose();
		};
	});

	function initParticles() {
		if (!canvasRef) return;

		scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			canvasRef.clientWidth / canvasRef.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 30;

		renderer = new THREE.WebGLRenderer({ canvas: canvasRef, alpha: true });
		renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const geometry = new THREE.BufferGeometry();
		const count = 400;
		const positions = new Float32Array(count * 3);

		for (let i = 0; i < count * 3; i += 3) {
			positions[i] = (Math.random() - 0.5) * 50;
			positions[i + 1] = (Math.random() - 0.5) * 50;
			positions[i + 2] = (Math.random() - 0.5) * 25;
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			size: 0.1,
			color: 0x00ffff,
			transparent: true,
			opacity: 0.4,
			blending: THREE.AdditiveBlending
		});

		particles = new THREE.Points(geometry, material);
		scene.add(particles);

		function animate() {
			animationId = requestAnimationFrame(animate);

			particles.rotation.x += 0.0003;
			particles.rotation.y += 0.0005;

			particles.position.x = $cursorPosition.x * 1.5;
			particles.position.y = -$cursorPosition.y * 1.5;

			renderer.render(scene, camera);
		}

		animate();

		window.addEventListener('resize', () => {
			if (!canvasRef) return;
			camera.aspect = canvasRef.clientWidth / canvasRef.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight);
		});
	}

	function handleFocus(fieldId: string) {
		gsapModule?.to(`#${fieldId}-label`, { y: -28, scale: 0.85, color: '#00ffff', duration: 0.3 });
		gsapModule?.to(`#${fieldId}-border`, { scaleX: 1, opacity: 1, duration: 0.3 });
	}

	function handleBlur(fieldId: string, value: string) {
		if (!value) {
			gsapModule?.to(`#${fieldId}-label`, { y: 0, scale: 1, color: '#6b7280', duration: 0.3 });
		}
		gsapModule?.to(`#${fieldId}-border`, { scaleX: 0, opacity: 0.3, duration: 0.3 });
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;

		await new Promise((resolve) => setTimeout(resolve, 2000));

		isSubmitting = false;
		isSubmitted = true;

		name = '';
		email = '';
		message = '';

		setTimeout(() => {
			isSubmitted = false;
		}, 5000);
	}
</script>

<section
	id="contact"
	bind:this={contactRef}
	class="relative min-h-screen px-6 py-24 md:px-16 lg:px-32"
>
	<!-- Particles Canvas -->
	<canvas bind:this={canvasRef} class="absolute inset-0 h-full w-full"></canvas>

	<div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark"></div>

	<div class="relative z-10 mx-auto max-w-6xl">
		<!-- Section header -->
		<div class="mb-20 md:mb-24">
			<span
				class="contact-label font-manrope mb-4 block text-sm font-medium tracking-widest text-cyan-400 uppercase"
			>
				Contact
			</span>
			<h2 class="contact-title font-syne text-5xl font-bold text-white md:text-7xl lg:text-8xl">
				Let's work<br /><span class="text-gray-600">together</span>
			</h2>
		</div>

		<div class="grid gap-20 lg:grid-cols-2 lg:gap-32">
			<!-- Form -->
			<div class="contact-form relative">
				<form
					onsubmit={handleSubmit}
					class="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 md:p-16"
				>
					<div class="flex flex-col gap-10">
						<!-- Name -->
						<div class="relative">
							<input
								type="text"
								id="name"
								bind:value={name}
								onfocus={() => handleFocus('name')}
								onblur={() => handleBlur('name', name)}
								required
								class="w-full border-b-2 border-gray-800 bg-transparent py-4 text-white transition-colors outline-none focus:border-cyan-500"
								placeholder=" "
							/>
							<label
								id="name-label"
								class="font-space pointer-events-none absolute top-4 left-0 text-gray-500 transition-all duration-300"
							>
								Your Name
							</label>
							<div
								id="name-border"
								class="to-magenta-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-gradient-to-r from-cyan-500 opacity-30"
							></div>
						</div>

						<!-- Email -->
						<div class="relative">
							<input
								type="email"
								id="email"
								bind:value={email}
								onfocus={() => handleFocus('email')}
								onblur={() => handleBlur('email', email)}
								required
								class="w-full border-b-2 border-gray-800 bg-transparent py-4 text-white transition-colors outline-none focus:border-cyan-500"
								placeholder=" "
							/>
							<label
								id="email-label"
								class="font-space pointer-events-none absolute top-4 left-0 text-gray-500 transition-all duration-300"
							>
								Your Email
							</label>
							<div
								id="email-border"
								class="to-magenta-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-gradient-to-r from-cyan-500 opacity-30"
							></div>
						</div>

						<!-- Message -->
						<div class="relative">
							<textarea
								id="message"
								bind:value={message}
								onfocus={() => handleFocus('message')}
								onblur={() => handleBlur('message', message)}
								rows="4"
								required
								class="w-full resize-none border-b-2 border-gray-800 bg-transparent py-4 text-white transition-colors outline-none focus:border-cyan-500"
								placeholder=" "
							></textarea>
							<label
								id="message-label"
								class="font-space pointer-events-none absolute top-4 left-0 text-gray-500 transition-all duration-300"
							>
								Your Message
							</label>
							<div
								id="message-border"
								class="to-magenta-500 absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-gradient-to-r from-cyan-500 opacity-30"
							></div>
						</div>
					</div>

					<!-- Submit -->
					<button
						type="submit"
						disabled={isSubmitting}
						class="group to-magenta-500 font-syne relative mt-12 w-full overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 py-6 text-lg font-semibold text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
					>
						<span class="relative z-10 flex items-center justify-center gap-3">
							{#if isSubmitting}
								<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
										fill="none"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Sending...
							{:else}
								Send Message
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
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							{/if}
						</span>
						<div
							class="from-magenta-500 absolute inset-0 -translate-x-full bg-gradient-to-r to-cyan-500 transition-transform duration-300 group-hover:translate-x-0"
						></div>
					</button>

					<!-- Success -->
					{#if isSubmitted}
						<div
							class="absolute inset-0 flex items-center justify-center rounded-3xl bg-dark/95 backdrop-blur-xl"
						>
							<div class="text-center">
								<div
									class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20"
								>
									<svg
										class="h-8 w-8 text-green-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										></path>
									</svg>
								</div>
								<h3 class="font-syne text-xl font-bold text-white">Message Sent!</h3>
								<p class="font-space mt-2 text-gray-400">I'll get back to you soon.</p>
							</div>
						</div>
					{/if}
				</form>
			</div>

			<!-- Info -->
			<div class="flex flex-col gap-10 lg:gap-16">
				<!-- Contact info -->
				<div class="flex flex-col gap-8">
					<div
						class="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.05]"
					>
						<div class="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
							<svg
								class="h-7 w-7 text-cyan-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								></path>
							</svg>
						</div>
						<div>
							<p class="font-manrope mb-1 text-sm text-gray-500">Email</p>
							<p class="font-space text-xl text-white">hello@example.com</p>
						</div>
					</div>

					<div
						class="hover:border-magenta-500/30 flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:bg-white/[0.05]"
					>
						<div class="bg-magenta-500/10 flex h-16 w-16 items-center justify-center rounded-full">
							<svg
								class="text-magenta-400 h-7 w-7"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								></path>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								></path>
							</svg>
						</div>
						<div>
							<p class="font-manrope mb-1 text-sm text-gray-500">Location</p>
							<p class="font-space text-xl text-white">San Francisco, CA</p>
						</div>
					</div>
				</div>

				<!-- Social links -->
				<div class="pt-8">
					<h3 class="font-manrope mb-8 text-sm font-medium tracking-widest text-gray-500 uppercase">
						Connect
					</h3>
					<div class="flex gap-6">
						{#each socialLinks as link}
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="social-link flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-gray-400 transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400"
								aria-label={link.name}
							>
								<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
									{@html link.icon}
								</svg>
							</a>
						{/each}
					</div>
				</div>

				<!-- Availability -->
				<div class="mt-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-8">
					<div class="flex items-center gap-5">
						<div class="relative">
							<div class="h-4 w-4 rounded-full bg-green-500"></div>
							<div
								class="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-green-500 opacity-75"
							></div>
						</div>
						<div>
							<p class="font-syne font-semibold text-white">Available for projects</p>
							<p class="font-manrope text-sm text-gray-400">Open to new opportunities</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<footer class="mt-24 border-t border-white/10 pt-12">
			<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
				<p class="font-manrope text-sm text-gray-500">© 2024 Andrew Ubana. All rights reserved.</p>
				<p class="font-manrope text-sm text-gray-500">
					Built with
					<span class="text-cyan-400">Svelte</span>,
					<span class="text-magenta-400">Three.js</span>,
					<span class="text-green-400">GSAP</span> & <span class="text-cyan-400">Lenis</span>
				</p>
			</div>
		</footer>
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
