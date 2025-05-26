import { axiosInstance } from "@/lib/axios";
import type { Album, Song } from "@/types"; // @ means inside src folder with chadcnui
import { create } from "zustand";

type MusicStore = {
    songs: Song[]; // custom type for songs
    albums: Album[]; // custom type for albums
    isLoading: boolean;
    error: string | null;
    currentAlbum: Album | null;
    featuredSongs: Song[]; // this is for featured songs, if you want to use it
    madeForYouSongs: Song[];
    trendingSongs: Song[]; // this is for trending songs, if you want to use it


    fetchAlbums: () => Promise<void>;// function to fetch albums
    fetchAlbumById: (id: string) => Promise<void>;//bu function, albüm id'sine göre albüm verilerini çekmek için kullanılır
    fetchMadeForYou: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({//set state i güncellemek için kullanılır
    albums: [], // baslangıc degerleri
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [], // bu, kullanıcıya özel şarkıları tutmak için eklenmiştir
    trendingSongs: [],
    featuredSongs: [],

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
    fetchMadeForYou: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({ madeForYouSongs: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({ trendingSongs: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));