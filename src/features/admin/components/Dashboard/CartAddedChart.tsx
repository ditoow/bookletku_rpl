// Cart Added Chart Component (Bar Chart + List)
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CartAddedChartProps {
    mostAddedToCart: any[];
    formatNumber: (num: number) => string;
}

export default function CartAddedChart({ mostAddedToCart, formatNumber }: CartAddedChartProps) {
    if (mostAddedToCart.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <ShoppingCart className="h-5 w-5" />
                        Menu Paling Sering Ditambahkan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-8">
                        Belum ada data penambahan keranjang
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <ShoppingCart className="h-5 w-5" />
                    Menu Paling Sering Ditambahkan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="w-full h-64 md:h-full min-h-[250px] py-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={mostAddedToCart.map((i) => ({
                                    name: i.menu_items?.nama_produk,
                                    total: i.total_added,
                                }))}
                                layout="horizontal"
                                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    interval={0}
                                    tickMargin={10}
                                />
                                <YAxis width={30} />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ borderRadius: "8px" }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#4f46e5"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {mostAddedToCart.map((item: any, index: number) => (
                            <div
                                key={item.menu_item_id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate text-sm md:text-base">
                                            {item.menu_items?.nama_produk}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.menu_items?.kategori}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatNumber(item.total_added)}
                                    </p>
                                    <p className="text-[10px] md:text-xs text-gray-500">added</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
