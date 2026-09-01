"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react";
import type { Locale } from "@/lib/types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profession: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  favoriteStyle?: string;
}

interface UserAPI {
  user: User | null;
  isLoggedIn: boolean;
  mounted: boolean;
  register: (data: Omit<User, "id" | "joinedAt"> & { password: string }) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const UserContext = createContext<UserAPI | null>(null);

const LS_USER_KEY = "rezi-user-v1";
const LS_USERS_KEY = "rezi-users-db-v1";
const LS_SESSION_KEY = "rezi-session-v1";

function getUsersDB(): Array<User & { password: string }> {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveUsersDB(users: Array<User & { password: string }>) {
  try {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(LS_SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        // Check if user still exists in DB
        const db = getUsersDB();
        const exists = db.find((u) => u.id === parsed.id);
        if (exists) {
          const { password, ...userData } = exists;
          setUser(userData);
        } else {
          setUser(parsed);
        }
      } else {
        const raw = localStorage.getItem(LS_USER_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
        }
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (user) {
        localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LS_USER_KEY);
        localStorage.removeItem(LS_SESSION_KEY);
      }
    } catch {}
  }, [user, mounted]);

  const register = useCallback((data: Omit<User, "id" | "joinedAt"> & { password: string }) => {
    const db = getUsersDB();
    if (db.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "این ایمیل قبلاً ثبت شده است" };
    }
    const newUser: User & { password: string } = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      profession: data.profession,
      avatar: data.avatar,
      bio: data.bio,
      favoriteStyle: data.favoriteStyle,
      joinedAt: new Date().toISOString(),
      password: data.password,
    };
    db.push(newUser);
    saveUsersDB(db);
    const { password, ...userData } = newUser;
    setUser(userData);
    return { success: true };
  }, []);

  const login = useCallback((email: string, password: string) => {
    const db = getUsersDB();
    const found = db.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: "کاربری با این ایمیل یافت نشد" };
    }
    if (found.password !== password) {
      return { success: false, error: "رمز عبور اشتباه است" };
    }
    const { password: _, ...userData } = found;
    setUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(LS_SESSION_KEY);
      localStorage.removeItem(LS_USER_KEY);
    } catch {}
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      // Update DB too
      try {
        const db = getUsersDB();
        const idx = db.findIndex((u) => u.id === prev.id);
        if (idx >= 0) {
          db[idx] = { ...db[idx], ...data };
          saveUsersDB(db);
        }
      } catch {}
      return updated;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, mounted, register, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserAPI {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
