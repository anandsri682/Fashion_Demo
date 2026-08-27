import { apiFetch, setToken } from "@/lib/api";
import { User, Role } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface BackendUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: BackendUser;
  token: string;
}

interface MeResponse {
  success: boolean;
  message: string;
  user: BackendUser;
}

function normalizeUser(user: BackendUser): User {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(
    payload: RegisterPayload
  ): Promise<{ user: User; token: string }> {
    const response = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });

    const user = normalizeUser(response.user);

    setToken(response.token);

    return {
      user,
      token: response.token,
    };
  },

  async login(
    payload: LoginPayload
  ): Promise<{ user: User; token: string }> {
    const response = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    const user = normalizeUser(response.user);

    setToken(response.token);

    return {
      user,
      token: response.token,
    };
  },

  async logout(): Promise<void> {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        auth: true,
      });
    } finally {
      setToken(null);
    }
  },

  async getMe(): Promise<User> {
    const response = await apiFetch<MeResponse>("/auth/me", {
      method: "GET",
      auth: true,
    });

    return normalizeUser(response.user);
  },

  async forgotPassword(email: string): Promise<void> {
    await apiFetch("/auth/forgot-password", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email }),
    });
  },
};