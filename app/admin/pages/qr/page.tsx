"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, Link as LinkIcon, Printer } from "lucide-react";

export default function QrManagementPage() {
  const [url, setUrl] = useState("https://bookletku3.vercel.app/");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "menu-qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">QR Management</h2>
        <p className="text-gray-500 mt-1">
          Buat dan unduh QR Code untuk akses menu restoran
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Konfigurasi */}
        <Card>
          <CardHeader>
            <CardTitle>Konfigurasi URL</CardTitle>
            <CardDescription>
              Masukkan alamat website restoran Anda di sini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Website URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10"
                  placeholder="https://..."
                />
              </div>
              <p className="text-xs text-gray-500">
                *Pastikan URL diawali dengan http:// atau https://
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-[#FF9B6A] hover:bg-[#FF8A55]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Preview QR */}
        <Card className="flex items-center justify-center bg-white">
          <CardContent className="p-8 text-center">
            <div
              ref={qrRef}
              className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 inline-block"
            >
              <div className="bg-white p-2">
                <QRCode
                  value={url}
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                  level="H"
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-bold text-lg text-gray-800">Scan Menu</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto break-all">
                {url}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
