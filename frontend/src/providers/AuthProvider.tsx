import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore.ts";
import { axiosInstance } from "../lib/axios.ts"

const updateApiToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;// bu kod axios instance'inin default header'ına token ekliyor
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];// token yoksa header'dan siliniyor
    }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const { checkAdminStatus } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();//kullanıcıdan token alınıyor
                updateApiToken(token);// token axios instance'ine ekleniyor
                if (token) {
                    await checkAdminStatus();
                }
            } catch (error: any) {
                updateApiToken(null);
                console.log("Error in auth provider", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [getToken]);

    if (loading)
        return (
            <div className='h-screen w-full flex items-center justify-center'>
                <Loader className='size-8 text-emerald-500 animate-spin' />
            </div>
        );

    return (
        <>
            {children}
        </>
    );
};
export default AuthProvider;