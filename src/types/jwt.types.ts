// JWT Types for Token Management

export interface JwtPayload {
  // Standard JWT claims
  iss?: string; // Issuer
  sub?: string; // Subject (user ID)
  aud?: string; // Audience
  exp?: number; // Expiration time (Unix timestamp)
  iat?: number; // Issued at (Unix timestamp)
  nbf?: number; // Not before (Unix timestamp)
  jti?: string; // JWT ID
  
  // Custom claims (adjust based on your backend)
  userId?: string;
  email?: string;
  role?: string;
  permissions?: string[];
}

export interface TokenInfo {
  payload: JwtPayload;
  isValid: boolean;
  isExpired: boolean;
  expiresAt: Date | null;
  timeUntilExpiry: number; // milliseconds
  shouldRefresh: boolean; // true if expires in < 5 minutes
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string; // Optional if backend rotates refresh tokens
  expiresIn: number; // seconds
}

// Token refresh states
export type TokenRefreshState = 
  | 'idle'           // Not refreshing
  | 'refreshing'     // Currently refreshing
  | 'success'        // Refresh successful
  | 'failed'         // Refresh failed
  | 'expired';       // Refresh token expired

export interface TokenRefreshStatus {
  state: TokenRefreshState;
  lastRefresh: Date | null;
  nextRefresh: Date | null;
  retryCount: number;
  error: string | null;
}
