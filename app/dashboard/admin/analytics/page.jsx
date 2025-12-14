"use client";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

import AdminAnalytics from " @/components/Dashboard/AdminAnalytics";



const stats = [
  {
    title: "Total Users",
    value: "12,450",
    icon: Users,
    growth: "+8.2%",
  },
  {
    title: "Orders",
    value: "3,210",
    icon: ShoppingCart,
    growth: "+5.4%",
  },
  {
    title: "Revenue",
    value: "৳ 1,25,000",
    icon: DollarSign,
    growth: "+12.6%",
  },
  {
    title: "Conversion Rate",
    value: "3.4%",
    icon: TrendingUp,
    growth: "+1.1%",
  },
];

export default function AnalyticsPage() {
  return (
    <AdminAnalytics/>
  );
}