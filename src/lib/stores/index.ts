import { writable, derived } from 'svelte/store';
import type { CursorPosition, SectionRefs } from '$lib/types';

export const cursorPosition = writable<CursorPosition>({ x: 0, y: 0 });

export const currentSection = writable<string>('hero');

export const isLoaded = writable<boolean>(false);

export const sectionRefs = writable<SectionRefs>({
	hero: null,
	about: null,
	projects: null,
	contact: null
});

export const lenisInstance = writable<any>(null);

export const cursorLabel = writable<string>('You');

export const activeElement = writable<string>('');

export const hasInteracted = writable<boolean>(false);

export const hasScrolledDown = writable<boolean>(false);

export const isScrolling = writable<boolean>(false);

export const sectionDescriptions: Record<
	string,
	{ label: string; color: string; description: string }
> = {
	hero: {
		label: 'Welcome',
		color: '#00ffff',
		description: 'My digital playground'
	},
	about: {
		label: 'About Me',
		color: '#ff00ff',
		description: 'Who I am & what I do'
	},
	projects: {
		label: 'Projects',
		color: '#00ff88',
		description: "Things I've built"
	},
	contact: {
		label: 'Contact',
		color: '#ff8800',
		description: "Let's work together"
	}
};
