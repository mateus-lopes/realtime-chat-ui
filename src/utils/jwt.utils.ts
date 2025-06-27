// JWT Utilities for Token Management
// 🎓 Educational: Learn how JWT tokens work!

import { jwtDecode } from "jwt-decode";
import type { JwtPayload, TokenInfo } from "@/types/jwt.types";

/**
 * 🔍 Decode and analyze a JWT token
 *
 * @param token - The JWT token string
 * @returns TokenInfo object with all token details
 */
export function analyzeToken(token: string): TokenInfo {
  try {
    // 📚 Decode the JWT payload (this doesn't verify signature!)
    const payload = jwtDecode<JwtPayload>(token);

    // 📅 Get expiration time
    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : null;
    const now = new Date();

    // ⏰ Calculate time until expiry
    const timeUntilExpiry = expiresAt ? expiresAt.getTime() - now.getTime() : 0;

    // ✅ Check if token is valid and not expired
    const isExpired = expiresAt ? now >= expiresAt : false;
    const isValid = !isExpired && timeUntilExpiry > 0;

    // 🔄 Should we refresh? (if expires in less than 5 minutes)
    const shouldRefresh =
      timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000;

    return {
      payload,
      isValid,
      isExpired,
      expiresAt,
      timeUntilExpiry,
      shouldRefresh,
    };
  } catch (error) {
    console.error("❌ Failed to decode JWT token:", error);

    // Return invalid token info
    return {
      payload: {},
      isValid: false,
      isExpired: true,
      expiresAt: null,
      timeUntilExpiry: 0,
      shouldRefresh: false,
    };
  }
}

/**
 * 🕐 Check if token needs refresh (expires in < 5 minutes)
 *
 * @param token - The JWT token string
 * @returns boolean indicating if refresh is needed
 */
export function needsRefresh(token: string): boolean {
  if (!token) return false;

  const tokenInfo = analyzeToken(token);
  return tokenInfo.shouldRefresh;
}

/**
 * ✅ Check if token is valid (not expired)
 *
 * @param token - The JWT token string
 * @returns boolean indicating if token is valid
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;

  const tokenInfo = analyzeToken(token);
  return tokenInfo.isValid;
}

/**
 * 📊 Get human-readable token expiry info
 *
 * @param token - The JWT token string
 * @returns string with expiry information
 */
export function getTokenExpiryInfo(token: string): string {
  if (!token) return "No token";

  const tokenInfo = analyzeToken(token);

  if (tokenInfo.isExpired) {
    return "Token expired";
  }

  if (!tokenInfo.expiresAt) {
    return "No expiration";
  }

  const minutes = Math.floor(tokenInfo.timeUntilExpiry / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `Expires in ${hours}h ${minutes % 60}m`;
  } else {
    return `Expires in ${minutes}m`;
  }
}

/**
 * 🔢 Get user ID from token
 *
 * @param token - The JWT token string
 * @returns user ID or null
 */
export function getUserIdFromToken(token: string): string | null {
  if (!token) return null;

  const tokenInfo = analyzeToken(token);
  return tokenInfo.payload.userId || tokenInfo.payload.sub || null;
}

/**
 * 📧 Get user email from token
 *
 * @param token - The JWT token string
 * @returns user email or null
 */
export function getUserEmailFromToken(token: string): string | null {
  if (!token) return null;

  const tokenInfo = analyzeToken(token);
  return tokenInfo.payload.email || null;
}

/**
 * 🎯 Calculate next refresh time (when token has 10 minutes left)
 *
 * @param token - The JWT token string
 * @returns Date when refresh should happen, or null
 */
export function getNextRefreshTime(token: string): Date | null {
  if (!token) return null;

  const tokenInfo = analyzeToken(token);

  if (!tokenInfo.expiresAt || tokenInfo.isExpired) {
    return null;
  }

  // Schedule refresh when token has 10 minutes left
  const refreshTime = new Date(tokenInfo.expiresAt.getTime() - 10 * 60 * 1000);
  const now = new Date();

  // If refresh time is in the past, refresh immediately
  return refreshTime > now ? refreshTime : now;
}

/**
 * 🐛 Debug function to log token information
 *
 * @param token - The JWT token string
 * @param label - Optional label for the log
 */
export function debugToken(token: string, label = "Token"): void {
  if (!token) {
    console.log(`🔍 ${label}: No token provided`);
    return;
  }

  const tokenInfo = analyzeToken(token);

  console.group(`🔍 ${label} Analysis`);
  console.log("📄 Payload:", tokenInfo.payload);
  console.log("✅ Valid:", tokenInfo.isValid);
  console.log("⏰ Expired:", tokenInfo.isExpired);
  console.log("📅 Expires at:", tokenInfo.expiresAt?.toLocaleString());
  console.log("⏱️ Time until expiry:", getTokenExpiryInfo(token));
  console.log("🔄 Should refresh:", tokenInfo.shouldRefresh);
  console.groupEnd();
}
