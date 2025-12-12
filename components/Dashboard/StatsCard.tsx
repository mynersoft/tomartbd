import { ReactNode } from "react";

interface StatsCardProps {
        title: string;
        value: number | string;
        icon: ReactNode; // Any JSX icon
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
        return (
                <div className="bg-white shadow rounded p-4 flex items-center justify-between">
                        <div>
                                <p className="text-gray-500">{title}</p>
                                <p className="text-2xl font-bold">{value}</p>
                        </div>
                        <div className="text-3xl text-gray-400">{icon}</div>
                </div>
        );
}