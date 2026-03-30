export interface Project {
	id: number;
	title: string;
	description: string;
	tech: string[];
	image: string;
	liveUrl?: string;
	githubUrl?: string;
	color: string;
}

export interface Skill {
	name: string;
	icon: string;
	level: number;
	color: string;
}

export interface SectionRefs {
	hero: HTMLElement | null;
	about: HTMLElement | null;
	projects: HTMLElement | null;
	contact: HTMLElement | null;
}

export interface CursorPosition {
	x: number;
	y: number;
}
