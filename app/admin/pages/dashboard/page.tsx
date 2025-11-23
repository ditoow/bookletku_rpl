"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Badge,
  DollarSign,
  Package,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Dummy Data (biar tidak error)
  const recentOrders = [
    { id: 101, customer: "John Doe", total: 29.99 },
    { id: 102, customer: "Sarah Smith", total: 45.0 },
  ];

  const lowStock = [
    { id: 1, emoji: "🍔", name: "Burger", desc: "Fast food item", stock: 3 },
    { id: 2, emoji: "🍕", name: "Pizza Slice", desc: "Italian food", stock: 2 },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? "Unknown");
    };

    getUser();
  }, []);

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Alert */}
      <Alert className="mb-4 bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          Welcome Back! {userEmail}
        </AlertDescription>
      </Alert>

      {/* Dashboard Title */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Revenue</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp size={12} />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Orders</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-blue-600" size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold">320</div>
            <div className="text-xs text-blue-600 mt-2">Today</div>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Total Products</span>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="text-purple-600" size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold">84</div>
            <div className="text-xs text-gray-500 mt-2">Active products</div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Pending Orders</span>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-[#FF9B6A]" size={20} />
              </div>
            </div>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-[#FF9B6A] mt-2">Needs attention</div>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between pb-4 border-b last:border-0"
                >
                  <div>
                    <div className="font-semibold">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">
                      {order.customer}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${order.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStock.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pb-4 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.emoji}</div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800">
                      {item.stock} left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
