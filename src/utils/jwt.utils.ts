import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export function isTokenValid(token: string): boolean {
  if (!token) return false;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    
    return payload.exp ? payload.exp > now : false;
  } catch {
    return false;
  }
}

export function getTokenExpiryInfo(token: string): string {
  if (!token) return "No token";

  try {
    const payload = jwtDecode<JwtPayload>(token);
    
    if (!payload.exp) return "No expiration";

    const expiresAt = new Date(payload.exp * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    if (timeUntilExpiry <= 0) {
      return "Expired";
    }

    const minutes = Math.floor(timeUntilExpiry / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s)`;
    if (hours > 0) return `${hours} hour(s)`;
    return `${minutes} minute(s)`;
  } catch {
    return "Invalid token";
  }
}

export function needsRefresh(token: string): boolean {
  if (!token) return false;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    
    if (!payload.exp) return false;

    const now = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - now;
    
    // Refresh if expires in less than 5 minutes
    return timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60;
  } catch {
    return false;
  }
}
