"use client";

import { SWRConfig } from "swr";
import { api } from "@/lib/api-client";

import { toast } from "sonner";

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => api.get(url),
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        onError: (error: any, key: string) => {
          if (error.status !== 404) {
            console.error(`SWR Error [${key}]:`, error);
            toast.error("Gagal sinkronisasi data dengan server.");
          }
        }
      }}
    >
      {children}
    </SWRConfig>
  );
};
