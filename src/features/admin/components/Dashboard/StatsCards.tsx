// Stats Cards Component
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Eye, ShoppingCart, DollarSign } from "lucide-react";

interface StatsCardsProps {
    stats: {
        totalRevenue: number;
        totalOrders: number;
        totalQuantitySold: number;
        totalMenuItemViews: number;
        uniqueMenuItems: number;
    };
    formatNumber: (num: number) => string;
    formatCurrency: (amount: number) => string;
}

export default function StatsCards({ stats, formatNumber, formatCurrency }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(stats.totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Dari {formatNumber(stats.totalOrders)} pesanan
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatNumber(stats.totalOrders)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatNumber(stats.totalQuantitySold)} item terjual
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Views Menu</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatNumber(stats.totalMenuItemViews)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.uniqueMenuItems} menu berbeda
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
