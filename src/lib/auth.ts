export type UserRole =
  | 'junior_moderator'
  | 'moderator'
  | 'junior_admin'
  | 'admin'
  | 'deputy_chief_admin'
  | 'chief_admin';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  junior_moderator: 1,
  moderator: 2,
  junior_admin: 3,
  admin: 4,
  deputy_chief_admin: 5,
  chief_admin: 6,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  junior_moderator: 'Мл. Модератор',
  moderator: 'Модератор',
  junior_admin: 'Мл. Администратор',
  admin: 'Администратор',
  deputy_chief_admin: 'Заместитель Главного Администратора',
  chief_admin: 'Главный Администратор',
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] || role;
}

export function canManageRole(userRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

const AUTH_STORAGE_KEY = 'newsportal_auth';

export function saveAuthData(user: User, token: string): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
}

export function getAuthData(): { user: User; token: string } | null {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearAuthData(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthData() !== null;
}
