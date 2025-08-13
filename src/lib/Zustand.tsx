"use client";
 
import { create } from "zustand";
import jwt from "jsonwebtoken";
 
interface DecodedToken {
  uid: string;
  rid: string;
  exp: number;
}
 
interface AuthState {
  userId: string | null;
  roleId: string | null;
  exp: number | null;
  isAuthenticated: boolean;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
  switchAccount: (token: string) => void;
}
 
const getTabId = (): string => {
  if (typeof window === "undefined") return "";
  let tabId = sessionStorage.getItem("tabId");
 
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("tabId", tabId);
  }
 
  return tabId;
};
 
const getActiveAccounts = (): Record<string, any> => {
  if (typeof window === "undefined") return {};
  const accounts = localStorage.getItem("activeAccounts");
  return accounts ? JSON.parse(accounts) : {};
};
 
const setActiveAccount = (tabId: string, info: any) => {
  if (typeof window === "undefined") return;
  const accounts = getActiveAccounts();
  accounts[tabId] = {
    ...info,
    lastActive: Date.now(),
  };
  localStorage.setItem("activeAccounts", JSON.stringify(accounts));
};
 
const removeActiveAccount = (tabId: string) => {
  if (typeof window === "undefined") return;
  const accounts = getActiveAccounts();
  delete accounts[tabId];
  localStorage.setItem("activeAccounts", JSON.stringify(accounts));
};
 
const useStore = create<AuthState>((set, get) => ({
  userId: null,
  roleId: null,
  exp: null,
  isAuthenticated: false,
 
  login: (token: string, rememberMe = true) => {
    if (!token) {
      console.error("No token received");
      return;
    }
 
    try {
      const decoded = jwt.decode(token) as DecodedToken | null;
 
      if (decoded?.uid && decoded?.rid) {
        const tabId = getTabId();
 
        const userInfo = {
          userId: decoded.uid,
          roleId: decoded.rid,
          exp: decoded.exp,
          token,
        };
 
        set({
          userId: decoded.uid,
          roleId: decoded.rid,
          exp: decoded.exp,
          isAuthenticated: true,
        });
 
        if (rememberMe) {
          localStorage.setItem(`auth_${tabId}`, JSON.stringify(userInfo));
        }
 
        sessionStorage.setItem("currentAuth", JSON.stringify(userInfo));
        setActiveAccount(tabId, userInfo);
      } else {
        console.error("Invalid token format", decoded);
      }
    } catch (error) {
      console.error("Token decoding error:", error);
    }
  },
 
  switchAccount: (token: string) => {
    const tabId = getTabId();
    sessionStorage.removeItem("currentAuth");
    removeActiveAccount(tabId);
    get().login(token, true);
  },
 
  logout: () => {
    const tabId = getTabId();
    set({
      userId: null,
      roleId: null,
      exp: null,
      isAuthenticated: false,
    });
 
    localStorage.removeItem(`auth_${tabId}`);
    sessionStorage.removeItem("currentAuth");
    removeActiveAccount(tabId);
  },
 
  checkAuth: () => {
    if (typeof window === "undefined") return;
 
    const tabId = getTabId();
    let authData = sessionStorage.getItem("currentAuth") || localStorage.getItem(`auth_${tabId}`);
 
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const { token, userId, roleId, exp } = parsed;
 
        if (exp && exp * 1000 < Date.now()) {
          console.log("Token expired, logging out");
          get().logout();
          return;
        }
 
        const decoded = jwt.decode(token) as DecodedToken | null;
 
        if (decoded && decoded.uid === userId && decoded.rid === roleId) {
          set({
            userId,
            roleId,
            exp,
            isAuthenticated: true,
          });
 
          setActiveAccount(tabId, parsed);
        } else {
          console.error("Token validation failed");
          get().logout();
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        get().logout();
      }
    }
  },
}));
 
if (typeof window !== "undefined") {
  const cleanupInactiveTabs = () => {
    const accounts = getActiveAccounts();
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;
 
    Object.keys(accounts).forEach((tabId) => {
      if (accounts[tabId].lastActive < cutoffTime) {
        localStorage.removeItem(`auth_${tabId}`);
        delete accounts[tabId];
      }
    });
 
    localStorage.setItem("activeAccounts", JSON.stringify(accounts));
  };
 
  cleanupInactiveTabs();
 
  window.addEventListener("beforeunload", () => {
    const tabId = getTabId();
    removeActiveAccount(tabId);
  });
}
 
useStore.getState().checkAuth();
 
export default useStore;
 
export const getActiveAccountsList = () => {
  const accounts = getActiveAccounts();
 
  return Object.entries(accounts).map(([tabId, info]: [string, any]) => ({
    tabId,
    userId: info.userId,
    roleId: info.roleId,
    lastActive: info.lastActive,
  }));
};
 
export const switchToAccount = (targetUserId: string) => {
  const accounts = getActiveAccounts();
 
  const targetAccount = Object.values(accounts).find(
    (acc: any) => acc.userId === targetUserId
  );
 
  if (targetAccount) {
    useStore.getState().switchAccount((targetAccount as any).token);
  }
};
 
 