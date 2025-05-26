import { create } from "zustand";
import type { Song } from "@/types";
import { toast } from "react-hot-toast";

type PlayerStore = {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        });
    },

    playAlbum: (songs: Song[], startIndex = 0) => {
        if (songs.length === 0) return;

        const song = songs[startIndex];

        set({
            queue: songs,
            currentSong: song,
            currentIndex: startIndex,
            isPlaying: true,
        });
    },

    setCurrentSong: (song: Song | null) => {
        if (!song) return;

        const songIndex = get().queue.findIndex((s) => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
        });
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;

        set({
            isPlaying: willStartPlaying,
        });
    },

    playNext: () => {
        const { currentIndex, queue } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex];

            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        } else {
            // Last song in queue - show toast
            toast("End of the queue. You've reached the last song.", {
                icon: "🎵",
                style: {
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                },
            });

            set({ isPlaying: false });
        }
    },

    /* 
        playNext: () => {
        const { currentIndex, queue } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
            // Play next in queue
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        } else {
            // Play a random "Made For You" song from music store
            const madeForYouSongs = useMusicStore.getState().madeForYouSongs;

            if (madeForYouSongs.length > 0) {
                const randomIndex = Math.floor(Math.random() * madeForYouSongs.length);
                const randomSong = madeForYouSongs[randomIndex];

                set({
                    queue: [randomSong],
                    currentSong: randomSong,
                    currentIndex: 0,
                    isPlaying: true,
                });
            } else {
                set({ isPlaying: false });
            }
        }
    },

    */
    playPrevious: () => {
        const { currentIndex, queue } = get();
        const prevIndex = currentIndex - 1;

        // theres a prev song
        if (prevIndex >= 0) {
            const prevSong = queue[prevIndex];

            set({
                currentSong: prevSong,
                currentIndex: prevIndex,
                isPlaying: true,
            });
        } else {
            // no prev song
            toast("Start of the queue. No Previous Song", {
                icon: "🎵",
                style: {
                    borderRadius: '8px',
                    background: '#333',
                    color: '#fff',
                },
            });
            set({ isPlaying: false });

        }
    },
}));