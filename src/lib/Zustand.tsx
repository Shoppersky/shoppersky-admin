"use client";

import { create } from "zustand";
import jwt from "jsonwebtoken";

interface UserData {
  [key: string]: any;
}

interface DecodedToken {
  sub: string;
  username: string;
  role_id: string;
  exp: number;
}

interface AuthState {
  userId: string | null;
  username: string | null;
  roleId: string | null;
  exp: number | null;
  user: UserData | null;
  isAuthenticated: boolean;
  login: (token: string, user: UserData | null, rememberMe?: boolean) => void;
  logout: () => void;
  checkAuth: () => void;
  switchAccount: (token: string, user?: UserData | null) => void;
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

const setActiveAccount = (tabId: string, userInfo: any) => {
  if (typeof window === "undefined") return;
  const accounts = getActiveAccounts();

  accounts[tabId] = {
    ...userInfo,
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
  username: null,
  roleId: null,
  exp: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: UserData | null, rememberMe = true) => {
    if (!token) {
      console.error("No token received");
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken | null;

      if (decoded?.sub && decoded?.username && decoded?.role_id) {
        const tabId = getTabId();

        const userData: UserData = user || {};

        const userInfo = {
          userId: decoded.sub,
          username: decoded.username,
          roleId: decoded.role_id,
          exp: decoded.exp,
          token,
          user: userData,
        };

        set({
          userId: decoded.sub,
          username: decoded.username,
          roleId: decoded.role_id,
          exp: decoded.exp,
          user: userData,
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

  switchAccount: (token: string, user?: UserData | null) => {
    const tabId = getTabId();
    sessionStorage.removeItem("currentAuth");
    removeActiveAccount(tabId);

    let userData: UserData = user || {};
    if (!user) {
      const accounts = getActiveAccounts();
      const account = Object.values(accounts).find(
        (acc: any) => acc.token === token
      );
      if (account && account.user) {
        userData = account.user;
      }
    }

    get().login(token, userData, true);
  },

  logout: () => {
    const tabId = getTabId();
    set({
      userId: null,
      username: null,
      roleId: null,
      exp: null,
      user: null,
      isAuthenticated: false,
    });

    localStorage.removeItem(`auth_${tabId}`);
    sessionStorage.removeItem("currentAuth");
    removeActiveAccount(tabId);
  },

  checkAuth: () => {
    if (typeof window === "undefined") return;

    const tabId = getTabId();
    let authData = sessionStorage.getItem("currentAuth");

    if (!authData) {
      authData = localStorage.getItem(`auth_${tabId}`);
      if (authData) {
        sessionStorage.setItem("currentAuth", authData);
      }
    }

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const { token, userId, username, roleId, exp, user } = parsed;

        if (exp && exp * 1000 < Date.now()) {
          console.log("Token expired, logging out");
          get().logout();
          return;
        }

        const decoded = jwt.decode(token) as DecodedToken | null;

        if (
          decoded &&
          decoded.sub === userId &&
          decoded.username === username &&
          decoded.role_id === roleId
        ) {
          set({
            userId,
            username,
            roleId,
            exp,
            user,
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
    username: info.username,
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
    useStore
      .getState()
      .switchAccount((targetAccount as any).token, (targetAccount as any).user);
  }
};
