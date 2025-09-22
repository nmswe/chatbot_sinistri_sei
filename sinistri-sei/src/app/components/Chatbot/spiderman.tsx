import Lottie from "lottie-react";
import animationSpider from '../../../../public/animation_spider.json';

export default function Spiderman() {

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-[400px] h-full">
                <Lottie animationData={animationSpider} loop={true} />
            </div>
        </div>
    );
}
