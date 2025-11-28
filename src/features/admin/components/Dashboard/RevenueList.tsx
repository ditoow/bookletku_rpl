// Revenue List Component
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DollarSign } from "lucide-react";
import type { MenuItemOrderStats } from "@/features/admin/services/trackingServices";

interface RevenueListProps {
    highestRevenueItems: MenuItemOrderStats[];
    formatNumber: (num: number) => string;
    formatCurrency: (amount: number) => string;
}

export default function RevenueList({ highestRevenueItems, formatNumber, formatCurrency }: RevenueListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <DollarSign className="h-5 w-5" />
                    Menu dengan Revenue Tertinggi
                </CardTitle>
            </CardHeader>
            <CardContent>
                {highestRevenueItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Belum ada data revenue
                    </p>
                ) : (
                    <div className="space-y-3">
                        {highestRevenueItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate text-sm md:text-base">
                                            {item.nama_produk}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatNumber(item.total_ordered)} pesanan
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className="text-sm font-bold text-gray-900">
                                        {formatCurrency(Number(item.total_revenue))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
