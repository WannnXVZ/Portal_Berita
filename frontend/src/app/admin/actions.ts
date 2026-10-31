"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";

type LoginResponse = {
  access_token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    slug?: string;
  };
};

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const response = await api.post<LoginResponse>("/auth/login", { email, password });
    
    if (response && response.access_token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "admin_token",
        value: response.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 minggu
        path: "/",
      });
      cookieStore.set({
        name: "admin_client_token",
        value: response.access_token,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      if (response.user) {
        cookieStore.set({
          name: "admin_user",
          value: JSON.stringify(response.user),
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
      
      return { success: true };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    console.error("Login API Error:", message);
    const isInvalidCredentials = message.toLowerCase().includes("invalid credentials");

    return {
      success: false,
      error: isInvalidCredentials
        ? "Email atau password salah"
        : "Server login belum tersambung. Pastikan backend dan database berjalan.",
    };
  }

  return { success: false, error: "Terjadi kesalahan sistem" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("admin_client_token");
  cookieStore.delete("admin_user");
  redirect("/admin/login");
}
