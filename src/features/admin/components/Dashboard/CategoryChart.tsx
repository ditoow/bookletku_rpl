// Category Chart Component (Line Chart + List)
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Package } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
    categoryStats: Array<{
        kategori: string;
        total_ordered: number;
        total_quantity: number;
        total_revenue: number;
    }>;
    formatNumber: (num: number) => string;
    formatCurrency: (amount: number) => string;
}

export default function CategoryChart({ categoryStats, formatNumber, formatCurrency }: CategoryChartProps) {
    if (categoryStats.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Package className="h-5 w-5" />
                        Kategori Populer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-8">
                        Tidak ada data kategori
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Package className="h-5 w-5" />
                    Kategori Populer
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart */}
                    <div className="w-full h-64 md:h-full min-h-[250px] py-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={categoryStats.map((i) => ({
                                    name: i.kategori,
                                    total: i.total_quantity,
                                }))}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis width={30} fontSize={12} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {categoryStats.map((category, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                                            {category.kategori}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatNumber(category.total_quantity)} item terjual
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className="text-sm font-bold text-gray-900">
                                        {formatCurrency(category.total_revenue)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
