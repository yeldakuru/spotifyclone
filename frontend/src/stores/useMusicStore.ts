import { axiosInstance } from "@/lib/axios";
import type { Album, Song } from "@/types"; // @ means inside src folder with chadcnui
import { create } from "zustand";

type MusicStore = {
    songs: Song[]; // custom type for songs
    albums: Album[]; // custom type for albums
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;

    fetchAlbums: () => Promise<void>;// function to fetch albums
    fetchAlbumById: (id: string) => Promise<void>;//bu function, albüm id'sine göre albüm verilerini çekmek için kullanılır
}

export const useMusicStore = create<MusicStore>((set) => ({//set state i güncellemek için kullanılır
    albums: [], // baslangıc degerleri
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,

    fetchAlbums: async () => {//apiden verileri çekmek için kullanılır
        set({ isLoading: true, error: null });//is loading true olur ve hata varsa temizlenir

        try {
            const response = await axiosInstance.get("/albums");
            set({ albums: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (id) => {//id ile belirli albümü çekmek için kullanılır
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));