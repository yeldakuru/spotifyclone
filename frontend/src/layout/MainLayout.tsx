import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom"
import LeftSideBar from "./components/LeftSideBar";
import { useEffect, useState } from "react";
import FriendsActivitiy from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {//bu kod, pencere boyutunu kontrol eder
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);//768px'den küçükse mobil
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);//pencere boyutu değiştiğinde kontrol et
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return (
        <div className='h-screen bg-black text-white flex flex-col'>
            <ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
                <AudioPlayer />
                {/* left sidebar */}
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={20}>
                    <LeftSideBar />
                </ResizablePanel>

                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                {/* Main content */}
                <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                    <Outlet />
                </ResizablePanel>

                {!isMobile && (
                    <>
                        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

                        {/* right sidebar */}
                        <ResizablePanel defaultSize={20} minSize={10} maxSize={25} collapsedSize={0}>
                            <FriendsActivitiy />
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>


        </div>
    )
}

export default MainLayout