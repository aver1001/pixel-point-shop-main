import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const USERS_STORAGE_KEY = "azel-point-shop-users";
const SESSION_STORAGE_KEY = "azel-point-shop-session";
const ADMIN_USER_ID = "admin-account";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin1234";

type UserRole = "admin" | "user";

type StoredUser = {
  id: string;
  username: string;
  displayName: string;
  password: string;
  createdAt: string;
  role?: UserRole;
};

export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  role: UserRole;
};

type LoginPayload = {
  username: string;
  password: string;
};

type SignupPayload = {
  username: string;
  password: string;
  displayName: string;
};

type AuthContextValue = {
  isReady: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSubmitting: boolean;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<boolean>;
  signup: (payload: SignupPayload) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_USER: AuthUser = {
  id: ADMIN_USER_ID,
  username: ADMIN_USERNAME,
  displayName: "ADMIN",
  createdAt: "2026-03-11T00:00:00.000Z",
  role: "admin",
};

const readUsers = (): StoredUser[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const normalizeUser = (user: StoredUser): AuthUser => ({
  id: user.id,
  username: user.username,
  displayName: user.displayName,
  createdAt: user.createdAt,
  role: user.role ?? "user",
});

export const getRegisteredUsers = (): AuthUser[] =>
  readUsers()
    .map(normalizeUser)
    .filter((user) => user.role === "user");

const createUserId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsReady(true);
      return;
    }

    const users = readUsers();
    const sessionUserId = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (sessionUserId) {
      if (sessionUserId === ADMIN_USER_ID) {
        setUser(ADMIN_USER);
        setIsReady(true);
        return;
      }

      const existingUser = users.find((item) => item.id === sessionUserId);

      if (existingUser) {
        setUser(normalizeUser(existingUser));
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    setIsReady(true);
  }, []);

  const login = useCallback(async ({ username, password }: LoginPayload) => {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password) {
      toast.error("아이디와 비밀번호를 모두 입력해 주세요.");
      return false;
    }

    setIsSubmitting(true);

    try {
      if (normalizedUsername.toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, ADMIN_USER_ID);
        setUser(ADMIN_USER);
        toast.success("관리자 로그인이 완료되었습니다!");
        return true;
      }

      const users = readUsers();
      const existingUser = users.find(
        (item) => item.username.toLowerCase() === normalizedUsername.toLowerCase(),
      );

      if (!existingUser || existingUser.password !== password) {
        toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
        return false;
      }

      window.localStorage.setItem(SESSION_STORAGE_KEY, existingUser.id);
      setUser(normalizeUser(existingUser));
      toast.success("로그인이 완료되었습니다!");

      return true;
    } catch {
      toast.error("로그인 정보를 저장하는 중 문제가 발생했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signup = useCallback(async ({ username, password, displayName }: SignupPayload) => {
    const normalizedUsername = username.trim();
    const normalizedDisplayName = displayName.trim();

    if (!normalizedDisplayName || !normalizedUsername || !password) {
      toast.error("이름, 아이디, 비밀번호를 모두 입력해 주세요.");
      return false;
    }

    if (password.length < 4) {
      toast.error("비밀번호는 4자 이상으로 입력해 주세요.");
      return false;
    }

    setIsSubmitting(true);

    try {
      const users = readUsers();
      const duplicate = users.some(
        (item) => item.username.toLowerCase() === normalizedUsername.toLowerCase(),
      );

      if (duplicate || normalizedUsername.toLowerCase() === ADMIN_USERNAME) {
        toast.error("이미 사용 중인 아이디입니다.");
        return false;
      }

      const newUser: StoredUser = {
        id: createUserId(),
        username: normalizedUsername,
        displayName: normalizedDisplayName,
        password,
        createdAt: new Date().toISOString(),
        role: "user",
      };

      const nextUsers = [...users, newUser];
      writeUsers(nextUsers);
      window.localStorage.setItem(SESSION_STORAGE_KEY, newUser.id);
      setUser(normalizeUser(newUser));
      toast.success("회원가입이 완료되었습니다!");

      return true;
    } catch {
      toast.error("회원가입 정보를 저장하는 중 문제가 발생했습니다.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    toast("로그아웃되었습니다.");
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      isLoggedIn: Boolean(user),
      isAdmin: user?.role === "admin",
      isSubmitting,
      user,
      login,
      signup,
      logout,
    }),
    [isReady, isSubmitting, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
