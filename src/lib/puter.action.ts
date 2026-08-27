import puter from '@heyputer/puter.js';
import { AuthState, DesignItem } from '../types';
import { SAMPLE_PROJECTS } from './sampleData';

const LOCAL_STORAGE_KEY = 'perspective_ai_projects';
const PUTER_WORKER_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PUTER_WORKER_URL) || '';

export const getStoredProjectsLocal = (): DesignItem[] => {
  if (typeof window === 'undefined') return SAMPLE_PROJECTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_PROJECTS;
  } catch (err) {
    console.error('Failed to read projects from local storage:', err);
    return SAMPLE_PROJECTS;
  }
};

export const saveProjectsLocal = (projects: DesignItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to local storage:', err);
  }
};

// Auth Actions
export const checkPuterAuth = async (): Promise<AuthState> => {
  try {
    if (puter && puter.auth && typeof puter.auth.isSignedIn === 'function') {
      const signedIn = await puter.auth.isSignedIn();
      if (signedIn) {
        const user = await puter.auth.getUser();
        return {
          isSignedIn: true,
          userName: user?.username || 'Puter Architect',
          userId: user?.uuid || 'user_' + (user?.username || 'puter'),
        };
      }
    }
  } catch (err) {
    console.info('Puter auth check info:', err);
  }
  
  // Local guest user fallback
  const guestUser = typeof window !== 'undefined' ? localStorage.getItem('perspective_guest_user') : null;
  if (guestUser) {
    try {
      const parsed = JSON.parse(guestUser);
      return {
        isSignedIn: true,
        userName: parsed.name || 'Architect Studio',
        userId: parsed.id || 'guest_architect',
      };
    } catch {
      // ignore
    }
  }

  return {
    isSignedIn: false,
    userName: null,
    userId: null,
  };
};

export const signInWithPuter = async (): Promise<AuthState> => {
  try {
    if (puter && puter.auth && typeof puter.auth.signIn === 'function') {
      await puter.auth.signIn();
      return await checkPuterAuth();
    }
  } catch (err) {
    console.warn('Puter sign in popup not available or closed, creating studio profile:', err);
  }

  // Fallback to local studio account
  const guest = { id: 'user_' + Math.random().toString(36).substring(2, 8), name: 'Studio Architect' };
  if (typeof window !== 'undefined') {
    localStorage.setItem('perspective_guest_user', JSON.stringify(guest));
  }
  return {
    isSignedIn: true,
    userName: guest.name,
    userId: guest.id,
  };
};

export const signOutPuter = async (): Promise<boolean> => {
  try {
    if (puter && puter.auth && typeof puter.auth.signOut === 'function') {
      await puter.auth.signOut();
    }
  } catch (err) {
    console.info('Puter sign out info:', err);
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('perspective_guest_user');
  }
  return true;
};

// Project CRUD Operations
export const createProject = async (project: DesignItem): Promise<DesignItem | null> => {
  // 1. Try Puter Worker if configured
  if (PUTER_WORKER_URL) {
    try {
      const res = await fetch(`${PUTER_WORKER_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        const saved = await res.json();
        saveProjectsLocal([saved, ...getStoredProjectsLocal().filter(p => p.id !== saved.id)]);
        return saved;
      }
    } catch (err) {
      console.warn('Puter Worker create failed, falling back to local:', err);
    }
  }

  // 2. Puter KV storage if available
  try {
    if (puter && puter.kv && typeof puter.kv.set === 'function') {
      await puter.kv.set(`proj_${project.id}`, JSON.stringify(project));
    }
  } catch (err) {
    console.info('Puter KV note:', err);
  }

  // 3. Local persistence
  const current = getStoredProjectsLocal();
  const updated = [project, ...current.filter(p => p.id !== project.id)];
  saveProjectsLocal(updated);
  return project;
};

export const getProjectById = async (id: string): Promise<DesignItem | null> => {
  // 1. Try Puter Worker
  if (PUTER_WORKER_URL) {
    try {
      const res = await fetch(`${PUTER_WORKER_URL}/api/projects/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Puter worker fetch note:', err);
    }
  }

  // 2. Try Puter KV
  try {
    if (puter && puter.kv && typeof puter.kv.get === 'function') {
      const val = await puter.kv.get(`proj_${id}`);
      if (val) return JSON.parse(val as string);
    }
  } catch (err) {
    console.info('Puter KV read note:', err);
  }

  // 3. Try LocalStorage
  const localProjects = getStoredProjectsLocal();
  const found = localProjects.find(p => p.id === id);
  if (found) return found;

  // 4. Sample project match
  const sample = SAMPLE_PROJECTS.find(p => p.id === id);
  return sample || null;
};

export const getAllProjects = async (): Promise<DesignItem[]> => {
  if (PUTER_WORKER_URL) {
    try {
      const res = await fetch(`${PUTER_WORKER_URL}/api/projects`);
      if (res.ok) {
        const remote = await res.json();
        if (Array.isArray(remote)) return remote;
      }
    } catch (err) {
      console.warn('Puter worker fetch all note:', err);
    }
  }
  return getStoredProjectsLocal();
};

export const updateProject = async (id: string, updates: Partial<DesignItem>): Promise<DesignItem | null> => {
  const current = getStoredProjectsLocal();
  const index = current.findIndex(p => p.id === id);
  if (index === -1) {
    const sample = SAMPLE_PROJECTS.find(p => p.id === id);
    if (sample) {
      const merged = { ...sample, ...updates };
      saveProjectsLocal([merged, ...current]);
      return merged;
    }
    return null;
  }
  const updated = { ...current[index], ...updates };
  current[index] = updated;
  saveProjectsLocal([...current]);

  try {
    if (puter && puter.kv && typeof puter.kv.set === 'function') {
      await puter.kv.set(`proj_${id}`, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }

  return updated;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const current = getStoredProjectsLocal();
  saveProjectsLocal(current.filter(p => p.id !== id));
  try {
    const kv = (puter as any)?.kv;
    if (kv && typeof kv.del === 'function') {
      await kv.del(`proj_${id}`);
    } else if (kv && typeof kv.delete === 'function') {
      await kv.delete(`proj_${id}`);
    }
  } catch {
    // ignore
  }
  return true;
};
