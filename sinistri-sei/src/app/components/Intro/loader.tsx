"use client";

import { LoaderProps } from "@/app/types/introTypes/intro";

export default function Loader({ logoSrc = "/logo.png" }: LoaderProps) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <img src={logoSrc} alt="Logo" />
        </div>
    );
}
