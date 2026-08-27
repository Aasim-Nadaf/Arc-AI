export interface DesignItem {
  id: string;
  name?: string | null;
  sourceImage: string;
  sourcePath?: string | null;
  renderedImage?: string | null;
  renderedPath?: string | null;
  modelUrl?: string | null;
  publicPath?: string | null;
  timestamp: number;
  ownerId?: string | null;
  sharedBy?: string | null;
  sharedAt?: string | null;
  isPublic?: boolean;
}

export interface Generate3DViewParams {
  sourceImage: string;
  projectId?: string | null;
}

export interface AuthState {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
}

export type AuthContext = {
  isSignedIn: boolean;
  userName: string | null;
  userId: string | null;
  refreshAuth: () => Promise<boolean>;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
};
