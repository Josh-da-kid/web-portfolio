<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { currentSection, lenisInstance } from '$lib/stores';

	let isScrolled = $state(false);
	let isMobileMenuOpen = $state(false);
	let navRef: HTMLElement;

	const navItems = [
		{ id: 'hero', label: 'Home', href: '#hero' },
		{ id: 'about', label: 'About', href: '#about' },
		{ id: 'projects', label: 'Work', href: '#projects' },
		{ id: 'contact', label: 'Contact', href: '#contact' }
	];

	function scrollToSection(href: string) {
		const id = href.replace('#', '');
		const element = document.getElementById(id);

		if (element && $lenisInstance) {
			$lenisInstance.scrollTo(element, { offset: -80 });
		} else if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}

		isMobileMenuOpen = false;
	}

	onMount(async () => {
		const gsapModule = await import('gsap');
		const gsap = gsapModule.default;
		gsap.fromTo(
			navRef,
			{ y: -100, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
		);

		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav
	bind:this={navRef}
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-500 {isScrolled
		? 'border-b border-white/5 bg-dark/90 backdrop-blur-xl'
		: 'bg-transparent'}"
>
	<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
		<!-- Logo -->
		<a href="#hero" class="font-syne text-xl font-bold tracking-tight">
			<span class="text-white">Josiah</span>
			<span class="text-cyan-400">.</span>
		</a>

		<!-- Desktop Navigation -->
		<ul class="hidden items-center gap-8 md:flex">
			{#each navItems as item}
				<li>
					<button
						onclick={() => scrollToSection(item.href)}
						class="font-manrope relative text-sm tracking-widest text-gray-400 uppercase transition-colors duration-300 hover:text-white"
						class:text-cyan-400={$currentSection === item.id}
					>
						<span class="relative">
							{item.label}
							<span
								class="absolute -bottom-2 left-0 h-px w-0 bg-cyan-400 transition-all duration-300 hover:w-full"
								class:w-full={$currentSection === item.id}
							></span>
						</span>
					</button>
				</li>
			{/each}
		</ul>

		<!-- Mobile Menu Button -->
		<button
			class="p-2 text-white md:hidden"
			onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-label="Toggle menu"
		>
			<div class="flex h-6 w-6 flex-col justify-between">
				<span
					class="h-0.5 w-full bg-white transition-all duration-300"
					class:rotate-45={isMobileMenuOpen}
					class:translate-y-2.5={isMobileMenuOpen}
				></span>
				<span
					class="h-0.5 w-full bg-white transition-all duration-300"
					class:opacity-0={isMobileMenuOpen}
				></span>
				<span
					class="h-0.5 w-full bg-white transition-all duration-300"
					class:-rotate-45={isMobileMenuOpen}
					class:-translate-y-2.5={isMobileMenuOpen}
				></span>
			</div>
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if isMobileMenuOpen}
		<div
			class="absolute top-20 right-0 left-0 border-b border-white/5 bg-dark/95 backdrop-blur-xl md:hidden"
		>
			<ul class="flex flex-col gap-0 px-6 py-6">
				{#each navItems as item}
					<li>
						<button
							onclick={() => scrollToSection(item.href)}
							class="font-manrope group relative block w-full py-4 text-lg text-gray-300 transition-colors hover:text-cyan-400"
							class:text-cyan-400={$currentSection === item.id}
						>
							<span class="relative">
								{item.label}
								<span
									class="absolute -bottom-1 left-0 h-0.5 w-0 bg-cyan-400 transition-all duration-300"
									class:w-full={$currentSection === item.id}
								></span>
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>

<style>
	.font-syne {
		font-family: 'Syne', sans-serif;
	}

	.font-manrope {
		font-family: 'Manrope', sans-serif;
	}
</style>
