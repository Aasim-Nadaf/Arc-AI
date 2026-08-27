export interface DesignItem {
  id: string;
  name?: string | null;
  sourceImage: string;           // Original uploaded floor plan (base64 or URL)
  sourcePath?: string | null;
  renderedImage?: string | null;  // AI-generated 2D render (base64 or URL)
  renderedPath?: string | null;
  modelUrl?: string | null;       // URL to .glb 3D model file or procedural flag
  publicPath?: string | null;
  timestamp: number;
  ownerId?: string | null;
  sharedBy?: string | null;
  sharedAt?: string | null;
  isPublic?: boolean;
  notes?: string;
  tags?: string[];
  stats?: {
    roomsDetected?: number;
    estimatedAreaSqFt?: number;
    style?: string;
  };
}

export interface Generate3DViewParams {
  sourceImage: string;
  projectId?: string | null;
  stylePreset?: string;
}

export interface AuthState {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
}

export type AuthContextType = {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
  refreshAuth: () => Promise<boolean>;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

export type ViewMode = 'top-down' | '3d-model' | 'compare';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  floorMaterial: string;
  wallTone: string;
}
