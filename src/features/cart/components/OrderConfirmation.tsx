"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface OrderConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
  language: "id" | "en";
  theme: "minimalist" | "colorful";
}

export default function OrderConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
  language,
  theme,
}: OrderConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "id" ? "Konfirmasi Pesanan" : "Confirm Order"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "id"
              ? "Sudah yakin dengan pesanan anda?"
              : "Are you sure about your order?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>
            {language === "id" ? "Batal" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={`${
              theme === "colorful" ? "bg-purple-600" : "bg-green-600"
            } text-white`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "id" ? "Memproses..." : "Processing..."}
              </>
            ) : language === "id" ? (
              "Pesan via Whatsapp"
            ) : (
              "Order via Whatsapp"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
