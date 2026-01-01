// Role definitions for the application
export const ROLES = {
	ADMIN: 'admin',
	AUTHOR: 'author',
	USER: 'user'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<Role, number> = {
	admin: 3,
	author: 2,
	user: 1
};

// Check if user has at least the specified role level
export function hasRole(userRole: string | null | undefined, requiredRole: Role): boolean {
	if (!userRole) return false;
	const userLevel = ROLE_HIERARCHY[userRole as Role] ?? 0;
	const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
	return userLevel >= requiredLevel;
}

// Check if user is admin
export function isAdmin(role: string | null | undefined): boolean {
	return role === ROLES.ADMIN;
}

// Check if user is author or higher
export function isAuthor(role: string | null | undefined): boolean {
	return hasRole(role, ROLES.AUTHOR);
}

// Dashboard sidebar items based on role
export interface SidebarItem {
	label: string;
	href: string;
	icon: string;
	roles?: Role[];
}

export const DASHBOARD_ITEMS: SidebarItem[] = [
	{ label: 'Overview', href: '/dashboard', icon: 'home' },
	{ label: 'My Posts', href: '/dashboard/posts', icon: 'file-text', roles: ['author', 'admin'] },
	{ label: 'Create Post', href: '/dashboard/posts/new', icon: 'plus', roles: ['author', 'admin'] },
	{
		label: 'Analytics',
		href: '/dashboard/analytics',
		icon: 'bar-chart',
		roles: ['author', 'admin']
	},
	{ label: 'Bookmarks', href: '/dashboard/bookmarks', icon: 'bookmark' },
	{ label: 'Reading History', href: '/dashboard/history', icon: 'clock' },
	{ label: 'Comments', href: '/dashboard/comments', icon: 'message-circle' },
	{ label: 'Settings', href: '/dashboard/settings', icon: 'settings' }
];

export const ADMIN_ITEMS: SidebarItem[] = [
	{ label: 'Dashboard', href: '/admin', icon: 'layout-dashboard' },
	{ label: 'Users', href: '/admin/users', icon: 'users' },
	{ label: 'All Posts', href: '/admin/posts', icon: 'file-text' },
	{ label: 'Tags', href: '/admin/tags', icon: 'tag' },
	{ label: 'Comments', href: '/admin/comments', icon: 'message-circle' },
	{ label: 'Site Settings', href: '/admin/settings', icon: 'settings' }
];
