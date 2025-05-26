import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore"
import { Loader } from "lucide-react";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
const HomePage = () => {
    const { featuredSongs, fetchFeaturedSongs, trendingSongs, fetchTrendingSongs, madeForYouSongs, fetchMadeForYou, isLoading } = useMusicStore();

    const { initializeQueue } = usePlayerStore();

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchFeaturedSongs(),
                fetchTrendingSongs(),
                fetchMadeForYou()
            ]);
        };

        fetchData();
    }, [fetchFeaturedSongs, fetchTrendingSongs, fetchMadeForYou]);

    useEffect(() => {
        if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
            const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
            initializeQueue(allSongs);
        }
    }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

    // Determine greeting message based on current hour
    const currentHour = new Date().getHours();
    let greetingMessage = "";

    if (currentHour < 12) {
        greetingMessage = "Good morning";
    } else if (currentHour < 18) {
        greetingMessage = "Good afternoon";
    } else {
        greetingMessage = "Good evening";
    }


    // Log the fetched data for debugging
    // console.log({madeForYou, trendingSongs, featuredSongs});

    // If data is still loading, you can return a loading state or spinner
    if (isLoading)
        return (
            <div className='h-screen w-full flex items-center justify-center'>
                <Loader className='size-8 text-emerald-500 animate-spin' />
            </div>
        );

    return (
        <main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900'>
            <Topbar />
            <ScrollArea className='h-[calc(100vh-180px)]'>
                <div className='p-4 sm:p-6'>
                    <h1 className='text-2xl sm:text-3xl font-bold mb-6'>{greetingMessage}</h1>
                    <FeaturedSection />

                    <div className='space-y-8'>
                        <SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
                        <SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
                    </div>
                </div>
            </ScrollArea>
        </main>
    )
}

export default HomePage