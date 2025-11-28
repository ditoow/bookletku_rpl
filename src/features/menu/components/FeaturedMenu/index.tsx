"use client";
import { useRef, useState, useEffect } from "react";
import { FeaturedHeader } from "./FeaturedHeader";
import { ScrollButtons } from "./ScrollButtons";
import { FeaturedItem } from "./FeaturedItem";

interface MenuItem {
    id: string;
    nama_produk: string;
    image_url?: string;
}

interface FeaturedMenuProps {
    items: MenuItem[];
    loading?: boolean;
    error?: string | null;
    language?: "id" | "en";
    theme?: "minimalist" | "colorful";
}

export default function FeaturedMenu({
    items,
    loading,
    error,
    language = "id",
    theme = "minimalist",
}: FeaturedMenuProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScrollButtons);
            window.addEventListener("resize", checkScrollButtons);
            return () => {
                scrollContainer.removeEventListener("scroll", checkScrollButtons);
                window.removeEventListener("resize", checkScrollButtons);
            };
        }
    }, [items]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft =
                direction === "left"
                    ? scrollContainerRef.current.scrollLeft - scrollAmount
                    : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="w-full">
            <FeaturedHeader language={language} theme={theme} itemCount={items.length} />

            {loading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="text-sm text-gray-500">
                            {language === "id" ? "Memuat..." : "Loading..."}
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">Error: {error}</p>
                </div>
            ) : (
                <div className="px-0.5 pl-2 relative">
                    <ScrollButtons
                        showLeft={showLeftArrow}
                        showRight={showRightArrow}
                        onScrollLeft={() => scroll("left")}
                        onScrollRight={() => scroll("right")}
                        theme={theme}
                        language={language}
                    />

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 rounded-2xl overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {items.map((item, index) => (
                            <FeaturedItem key={item.id} item={item} index={index} theme={theme} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
