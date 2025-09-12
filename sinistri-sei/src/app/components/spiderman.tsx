import Lottie from "lottie-react";
import animationSpider from '../../../public/animation_spider.json';
import { useEffect } from "react";
import { ISpiderman } from "../types/chatTypes/chat";

export default function Spiderman({villainState, setShowLottie}: ISpiderman) {

    useEffect(() => {
        if (!villainState) return;
        if (villainState.currentIndex === 0) return;
    
        setShowLottie(true);
        const timer = setTimeout(() => setShowLottie(false), 2000);
        return () => clearTimeout(timer);
    }, [villainState.currentIndex]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full h-full">
                <Lottie animationData={animationSpider} loop={true} />
            </div>
        </div>
    );
}
