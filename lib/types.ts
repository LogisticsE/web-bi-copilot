// User Types
export interface User {
  email: string;
  role: 'admin' | 'user';
  name: string;
}

// Menu Item Types
export type MenuItemType = 'copilot' | 'powerbi';

export interface CopilotConfig {
  embedUrl: string;
}

export interface PowerBIConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  workspaceId: string;
  reportId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  type: MenuItemType;
  config: CopilotConfig | PowerBIConfig;
  order: number;
  createdAt: string;
  createdBy: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Power BI Embed Info
export interface PowerBIEmbedInfo {
  embedToken: string;
  embedUrl: string;
  reportId: string;
  expiresAt?: string;
}
