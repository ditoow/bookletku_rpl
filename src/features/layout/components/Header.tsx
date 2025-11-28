"use client";

import { useState } from "react";
import { Menu, Search, Palette, Globe, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type ThemeType = "minimalist" | "colorful";

interface HeaderProps {
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
  showLanguageMenu: boolean;
  setShowLanguageMenu: (value: boolean | ((prev: boolean) => boolean)) => void;
  search: string;
  setSearch: (value: string) => void;
  cartItems: any[];
  setCartItems: (value: any) => void;
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
}

export default function Header({
  language,
  setLanguage,
  showLanguageMenu,
  setShowLanguageMenu,
  search,
  setSearch,
  cartItems,
  setCartItems,
  theme,
  setTheme,
}: HeaderProps) {
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isLangDialogOpen, setIsLangDialogOpen] = useState(false);

  const openThemeDialog = () => {
    setShowLanguageMenu(false);
    setIsThemeDialogOpen(true);
  };

  const openLangDialog = () => {
    setShowLanguageMenu(false);
    setIsLangDialogOpen(true);
  };

  const menuButtonClass =
    theme === "colorful"
      ? "bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30"
      : "bg-gradient-to-br from-[#A27B5C] to-[#8d6a4d] hover:from-[#8d6a4d] hover:to-[#7a5d44] shadow-lg shadow-[#A27B5C]/30";

  const searchBgClass =
    theme === "colorful"
      ? "bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-200/50 focus-within:border-purple-400"
      : "bg-gradient-to-r from-[#F5F5F0] to-[#E8E4DD] border-[#A27B5C]/20 focus-within:border-[#A27B5C]";

  return (
    <>
      <div className="flex items-center gap-3 md:gap-4">
        {/* Tombol Menu Utama */}
        <div className="relative">
          <Button
            className={`
              ${menuButtonClass}
              text-white w-12 h-12 rounded-xl 
              transition-all duration-300
              hover:scale-105 active:scale-95
              border-0
              group
            `}
            onClick={() => setShowLanguageMenu((prev) => !prev)}
          >
            <Menu className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300" />
          </Button>

          {/* Dropdown Menu (Tema & Bahasa) */}
          {showLanguageMenu && (
            <>
              {/* Backdrop untuk mobile */}
              <div
                className="fixed inset-0 bg-black/20 z-10 md:hidden"
                onClick={() => setShowLanguageMenu(false)}
              />

              <div className="absolute left-0 mt-2 w-56 rounded-2xl border-2 bg-white/95 backdrop-blur-md text-gray-800 shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header dropdown */}
                <div
                  className={`
                  px-4 py-3 border-b
                  ${
                    theme === "colorful"
                      ? "bg-gradient-to-r from-purple-100/50 to-pink-100/50"
                      : "bg-gradient-to-r from-[#DCD7C9]/30 to-[#C9C0B3]/30"
                  }
                `}
                >
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Settings
                  </p>
                </div>

                <div className="p-2">
                  <button
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-3 rounded-xl transition-all group"
                    onClick={openThemeDialog}
                  >
                    <div
                      className={`
                      p-2 rounded-lg transition-colors
                      ${
                        theme === "colorful"
                          ? "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                          : "bg-[#A27B5C]/10 text-[#A27B5C] group-hover:bg-[#A27B5C]/20"
                      }
                    `}
                    >
                      <Palette className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Ganti Tema</p>
                      <p className="text-xs text-gray-500">
                        {theme === "minimalist" ? "Minimalist" : "Colorful"}
                      </p>
                    </div>
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </button>

                  <button
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-3 rounded-xl transition-all group"
                    onClick={openLangDialog}
                  >
                    <div
                      className={`
                      p-2 rounded-lg transition-colors
                      ${
                        theme === "colorful"
                          ? "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                          : "bg-[#A27B5C]/10 text-[#A27B5C] group-hover:bg-[#A27B5C]/20"
                      }
                    `}
                    >
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Ganti Bahasa
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === "id" ? "🇮🇩 Indonesia" : "🇬🇧 English"}
                      </p>
                    </div>
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative group pr-1">
          <Search
            className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
            transition-colors duration-300
            ${
              theme === "colorful"
                ? "text-purple-400 group-focus-within:text-purple-600"
                : "text-gray-400 group-focus-within:text-[#A27B5C]"
            }
          `}
          />
          <Input
            placeholder={
              language === "id" ? "Cari produk..." : "Search product here..."
            }
            className={`
              pl-10 pr-10 h-12 rounded-xl
              border-2 transition-all duration-300
              ${searchBgClass}
              focus:shadow-lg
              ${
                theme === "colorful"
                  ? "focus:shadow-purple-200/50"
                  : "focus:shadow-[#A27B5C]/20"
              }
            `}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2
                p-1 rounded-full transition-all
                ${
                  theme === "colorful"
                    ? "hover:bg-purple-100 text-purple-400 hover:text-purple-600"
                    : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                }
              `}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- DIALOG TEMA (Bottom Sheet di Mobile) --- */}
      <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
        <DialogContent className="sm:max-w-md bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 translate-y-0 top-auto fixed w-full rounded-t-2xl sm:rounded-2xl border-0 p-0 gap-0 bg-white shadow-2xl">
          <div className="p-6">
            <DialogHeader className="mb-5 text-left">
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                <div
                  className={`
                  p-2 rounded-xl
                  ${theme === "colorful" ? "bg-purple-100" : "bg-[#A27B5C]/10"}
                `}
                >
                  <Palette
                    className={`w-5 h-5 ${
                      theme === "colorful"
                        ? "text-purple-600"
                        : "text-[#A27B5C]"
                    }`}
                  />
                </div>
                Pilih Tampilan
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              {/* Opsi Minimalist */}
              <button
                onClick={() => {
                  setTheme("minimalist");
                  setIsThemeDialogOpen(false);
                }}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border-2 
                  transition-all duration-300
                  ${
                    theme === "minimalist"
                      ? "border-[#A27B5C] bg-gradient-to-br from-[#DCD7C9]/30 to-[#C9C0B3]/30 ring-2 ring-[#A27B5C]/20 shadow-lg"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DCD7C9] to-[#C9C0B3] border-2 border-[#A27B5C]/30 flex items-center justify-center text-sm font-black text-[#A27B5C] shadow-md">
                    M
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Minimalist</p>
                    <p className="text-xs text-gray-500">
                      Warna kalem & elegan
                    </p>
                  </div>
                </div>
                {theme === "minimalist" && (
                  <div className="bg-[#A27B5C] text-white p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* Opsi Colorful */}
              <button
                onClick={() => {
                  setTheme("colorful");
                  setIsThemeDialogOpen(false);
                }}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border-2
                  transition-all duration-300
                  ${
                    theme === "colorful"
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 ring-2 ring-purple-500/20 shadow-lg"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 border-2 border-purple-500/30 flex items-center justify-center text-sm font-black text-white shadow-md">
                    C
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Colorful</p>
                    <p className="text-xs text-gray-500">Ceria & penuh warna</p>
                  </div>
                </div>
                {theme === "colorful" && (
                  <div className="bg-purple-600 text-white p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- DIALOG BAHASA (Bottom Sheet di Mobile) --- */}
      <Dialog open={isLangDialogOpen} onOpenChange={setIsLangDialogOpen}>
        <DialogContent className="sm:max-w-md bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 translate-y-0 top-auto fixed w-full rounded-t-2xl sm:rounded-2xl border-0 p-0 gap-0 bg-white shadow-2xl">
          <div className="p-6">
            <DialogHeader className="mb-5 text-left">
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                <div
                  className={`
                  p-2 rounded-xl
                  ${theme === "colorful" ? "bg-blue-100" : "bg-[#A27B5C]/10"}
                `}
                >
                  <Globe
                    className={`w-5 h-5 ${
                      theme === "colorful" ? "text-blue-600" : "text-[#A27B5C]"
                    }`}
                  />
                </div>
                Pilih Bahasa
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              <button
                onClick={() => {
                  setLanguage("id");
                  setIsLangDialogOpen(false);
                }}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border-2
                  transition-all duration-300
                  ${
                    language === "id"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 ring-2 ring-blue-500/20 shadow-lg"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🇮🇩</div>
                  <span className="font-bold text-gray-900">Indonesia</span>
                </div>
                {language === "id" && (
                  <div className="bg-blue-600 text-white p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>

              <button
                onClick={() => {
                  setLanguage("en");
                  setIsLangDialogOpen(false);
                }}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border-2
                  transition-all duration-300
                  ${
                    language === "en"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 ring-2 ring-blue-500/20 shadow-lg"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🇬🇧</div>
                  <span className="font-bold text-gray-900">English</span>
                </div>
                {language === "en" && (
                  <div className="bg-blue-600 text-white p-1.5 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
