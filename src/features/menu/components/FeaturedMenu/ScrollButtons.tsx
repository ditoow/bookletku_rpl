// Scroll Arrow Buttons Component
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollButtonsProps {
    showLeft: boolean;
    showRight: boolean;
    onScrollLeft: () => void;
    onScrollRight: () => void;
    theme: "minimalist" | "colorful";
    language: "id" | "en";
}

export function ScrollButtons({
    showLeft,
    showRight,
    onScrollLeft,
    onScrollRight,
    theme,
    language,
}: ScrollButtonsProps) {
    const buttonColor = theme === "minimalist"
        ? "bg-[#A27B5C]"
        : "bg-gradient-to-r from-pink-500 to-purple-500";

    return (
        <>
            {/* Left Arrow Button */}
            {showLeft && (
                <button
                    onClick={onScrollLeft}
                    className={`
            mx-3.5
            absolute left-0 top-1/2 -translate-y-1/2 z-10
            ${buttonColor}
            text-white p-2 rounded-full shadow-lg
            hover:scale-110 transition-all duration-300
            opacity-90 hover:opacity-100
          `}
                    aria-label={language === "id" ? "Geser ke kiri" : "Scroll left"}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            {/* Right Arrow Button */}
            {showRight && (
                <button
                    onClick={onScrollRight}
                    className={`
            mx-2
            absolute right-0 top-1/2 -translate-y-1/2 z-10
            ${buttonColor}
            text-white p-2 rounded-full shadow-lg
            hover:scale-110 transition-all duration-300
            opacity-90 hover:opacity-100
          `}
                    aria-label={language === "id" ? "Geser ke kanan" : "Scroll right"}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </>
    );
}
