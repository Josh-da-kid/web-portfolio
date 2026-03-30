<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import {
		cursorLabel,
		hasInteracted,
		hasScrolledDown,
		currentSection,
		sectionDescriptions
	} from '$lib/stores';
	import { onMount, onDestroy } from 'svelte';

	let { children } = $props();

	let cursorX = $state(0);
	let cursorY = $state(0);
	let labelElement: HTMLElement;
	let labelValue = 'You';
	let labelDescription = '';
	let gsapModule: typeof import('gsap').default;
	let labelColor = '#ffffff';
	let hasScrolledValue = $state(false);
	let currentSectionValue = $state('hero');

	// Subscribe to store changes
	const unsubscribe = cursorLabel.subscribe((value) => {
		labelValue = value;
	});

	// Track current section - this should update based on IntersectionObserver
	const sectionUnsubscribe = currentSection.subscribe((section) => {
		currentSectionValue = section;
		if (section && hasScrolledValue && section !== 'hero') {
			const desc = sectionDescriptions[section];
			if (desc) {
				labelValue = desc.label;
				labelDescription = desc.description;
				labelColor = desc.color;
			}
		}
	});

	// Track hasScrolledDown
	const scrollUnsubscribe = hasScrolledDown.subscribe((value) => {
		hasScrolledValue = value;
		if (value) {
			// Show scroll down prompt
			cursorLabel.set('Scroll down ↓');
		}
	});

	// Track hasInteracted - only trigger once
	let hasInteractedTriggered = false;
	const interactUnsubscribe = hasInteracted.subscribe((value) => {
		if (value && !hasInteractedTriggered) {
			hasInteractedTriggered = true;
			hasScrolledDown.set(true);
		}
	});

	onDestroy(() => {
		unsubscribe();
		sectionUnsubscribe();
		scrollUnsubscribe();
		interactUnsubscribe();
	});

	onMount(async () => {
		if (browser) {
			const gsapImport = await import('gsap');
			gsapModule = gsapImport.default;
		}
	});

	function handleMouseMove(e: MouseEvent) {
		cursorX = e.clientX;
		cursorY = e.clientY;
	}

	function handleScroll() {
		if (!hasScrolledValue) return;

		// Use IntersectionObserver-like logic to detect current section
		const sectionElements = ['hero', 'about', 'projects', 'contact'];

		for (const id of sectionElements) {
			const el = document.getElementById(id);
			if (el) {
				const rect = el.getBoundingClientRect();
				const isVisible =
					rect.top <= window.innerHeight * 0.6 && rect.bottom >= window.innerHeight * 0.2;

				if (isVisible) {
					if (id === 'hero') {
						// In hero, show prompt to scroll or hover message
						if (labelValue === 'Scroll down ↓' || labelValue === 'You') {
							labelValue = 'Hover over my name';
							labelDescription = '';
						}
					} else {
						const desc = sectionDescriptions[id];
						if (desc && labelValue !== desc.label) {
							labelValue = desc.label;
							labelDescription = desc.description;
							labelColor = desc.color;
						}
					}
					break;
				}
			}
		}
	}

	// Reactive effect when labelValue changes
	$effect(() => {
		const currentLabel = labelValue;
		if (labelElement && gsapModule) {
			// Jaw-dropping animation
			gsapModule.fromTo(
				labelElement,
				{ scale: 0.1, opacity: 0, y: -50, rotation: -25 },
				{ scale: 1, opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' }
			);

			// Determine colors based on label
			if (currentLabel === 'Cool right?') {
				gsapModule.to(labelElement, {
					backgroundColor: '#00ffff',
					color: '#000',
					boxShadow:
						'0 0 60px rgba(0,255,255,1), 0 0 120px rgba(0,255,255,0.8), inset 0 0 30px rgba(255,255,255,0.5)',
					duration: 0.4
				});
				// Pulse effect
				gsapModule.to(labelElement, {
					scale: 1.1,
					duration: 0.3,
					yoyo: true,
					repeat: 1,
					ease: 'power2.inOut'
				});
			} else if (currentLabel === 'Hover over my name') {
				gsapModule.to(labelElement, {
					backgroundColor: '#ff00ff',
					color: '#fff',
					boxShadow: '0 0 60px rgba(255,0,255,1), 0 0 120px rgba(255,0,255,0.8)',
					duration: 0.4
				});
			} else if (currentLabel === 'Scroll down ↓') {
				gsapModule.to(labelElement, {
					backgroundColor: '#1a1a2e',
					color: '#fff',
					boxShadow: '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)',
					duration: 0.4
				});
			} else if (currentLabel === 'Welcome') {
				gsapModule?.to(labelElement, {
					backgroundColor: '#00ffff',
					color: '#000',
					boxShadow: '0 0 60px rgba(0,255,255,1), 0 0 120px rgba(0,255,255,0.6)',
					duration: 0.4
				});
			} else if (currentLabel === 'About Me') {
				gsapModule?.to(labelElement, {
					backgroundColor: '#ff00ff',
					color: '#fff',
					boxShadow: '0 0 60px rgba(255,0,255,1), 0 0 120px rgba(255,0,255,0.6)',
					duration: 0.4
				});
			} else if (currentLabel === 'Projects') {
				gsapModule?.to(labelElement, {
					backgroundColor: '#00ff88',
					color: '#000',
					boxShadow: '0 0 60px rgba(0,255,136,1), 0 0 120px rgba(0,255,136,0.6)',
					duration: 0.4
				});
			} else if (currentLabel === 'Contact') {
				gsapModule?.to(labelElement, {
					backgroundColor: '#ff8800',
					color: '#000',
					boxShadow: '0 0 60px rgba(255,136,0,1), 0 0 120px rgba(255,136,0,0.6)',
					duration: 0.4
				});
			} else if (currentLabel === 'You') {
				gsapModule?.to(labelElement, {
					backgroundColor: '#ffffff',
					color: '#000000',
					boxShadow: '0 0 20px rgba(255,255,255,0.8), 0 2px 20px rgba(0,0,0,0.5)',
					duration: 0.3
				});
			}
		}
	});
</script>

<svelte:window onmousemove={handleMouseMove} onscroll={handleScroll} />

<svelte:head><link rel="icon" href="favicon.png" /></svelte:head>

<!-- Cursor Glow Effect -->
<div class="cursor-glow" style="left: {cursorX}px; top: {cursorY}px;"></div>

<!-- Custom Cursor with dynamic label -->
<div class="cursor-container" style="left: {cursorX}px; top: {cursorY}px;">
	<svg
		class="cursor-icon"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
	>
		<path
			fill="currentColor"
			d="M7.921 2.3C6.936 1.532 5.5 2.234 5.5 3.482v17.009c0 1.422 1.795 2.046 2.677.93l4.19-5.3a1.65 1.65 0 0 1 1.295-.626h6.852c1.428 0 2.049-1.808.921-2.684z"
		/>
	</svg>
	<div class="cursor-label" bind:this={labelElement}>
		<span class="label-main">{labelValue}</span>
		{#if labelDescription}
			<span class="label-desc">{labelDescription}</span>
		{/if}
	</div>
</div>

<main class="custom-cursor">
	{@render children()}
</main>

<style>
	:global(html),
	:global(body) {
		cursor: none !important;
	}

	:global(*) {
		cursor: none !important;
	}

	:global(a),
	:global(button),
	:global([role='button']) {
		cursor: none !important;
	}

	.custom-cursor {
		cursor: none;
	}

	.cursor-container {
		position: fixed !important;
		pointer-events: none !important;
		z-index: 999999 !important;
		transform: translate(-50%, -50%) !important;
		mix-blend-mode: normal;
		display: flex;
		align-items: flex-start;
	}

	.cursor-icon {
		color: white;
		width: 24px;
		height: 24px;
		filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
	}

	.cursor-label {
		position: absolute;
		left: 26px;
		top: 16px;
		background: white !important;
		color: black !important;
		padding: 8px 14px;
		font-size: 12px;
		font-weight: 700;
		border-radius: 8px;
		white-space: nowrap;
		font-family: 'Manrope', sans-serif;
		box-shadow:
			0 0 25px rgba(255, 255, 255, 1),
			0 6px 30px rgba(0, 0, 0, 0.7),
			inset 0 0 25px rgba(255, 255, 255, 0.3) !important;
		z-index: 10000000 !important;
		display: flex;
		flex-direction: column;
		gap: 3px;
		width: fit-content;
		min-width: auto;
	}

	.cursor-label .label-main {
		display: block;
	}

	.cursor-label .label-desc {
		display: block;
		font-size: 10px;
		font-weight: 500;
		opacity: 0.7;
	}

	@media (hover: none) {
		.cursor-container,
		.cursor-glow {
			display: none;
		}
	}

	.cursor-glow {
		position: fixed !important;
		pointer-events: none !important;
		z-index: 999998 !important;
		width: 400px;
		height: 400px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			rgba(0, 255, 255, 0.15) 0%,
			rgba(255, 0, 255, 0.08) 40%,
			transparent 70%
		);
		mix-blend-mode: screen;
	}
</style>
