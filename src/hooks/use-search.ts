import { API } from "@/lib/axios-client";
import type { UserType } from "@/types/auth.type";
import { create } from "zustand";


interface SearchState {
   query: string;
   results: UserType[];
   isLoading: boolean;
   error: string | null;

   setQuery: (query: string) => void;
   setResults: (results: UserType[]) => void;
   setLoading: (isLoading: boolean) => void;
   setError: (error: string | null) => void;

   searchUsers: (query: string) => Promise<void>;
}

export const useSearch = create<SearchState>()((set) => ({
   query: "",
   results: [],
   isLoading: false,
   error: null,

   setQuery: (query: string) => set({ query }),
   setResults: (results: UserType[]) => set({ results }),
   setLoading: (isLoading: boolean) => set({ isLoading }),
   setError: (error: string | null) => set({ error }),

   searchUsers: async (query: string) => {
      set({ isLoading: true, error: null });
      try {
         const response = await API.get("/user/search", {
            params: { query: query }
         });
         set({ results: response.data.users });
      } catch (error: any) {
         console.error("Search failed:", error);
         set({ error: error?.response?.data?.message || "Search failed" });
      } finally {
         set({ isLoading: false });
      }

   },
}));  