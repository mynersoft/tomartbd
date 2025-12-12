type Order = {
        id: string | number;
        invoice: string;
        customer: string;
        total: number;
        status: string;
};

interface RecentOrdersProps {
        orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
        return (
                <div className="bg-white shadow rounded p-4 mt-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                        <table className="w-full text-left border-collapse">
                                <thead>
                                        <tr className="border-b">
                                                <th className="py-2">Invoice</th>
                                                <th className="py-2">Customer</th>
                                                <th className="py-2">Total</th>
                                                <th className="py-2">Status</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        {orders?.map((o) => (
                                                <tr key={o.id} className="border-b hover:bg-gray-50">
                                                        <td className="py-2">{o.invoice}</td>
                                                        <td className="py-2">{o.customer}</td>
                                                        <td className="py-2">${o.total}</td>
                                                        <td className="py-2">{o.status}</td>
                                                </tr>
                                        ))}
                                </tbody>
                        </table>
                </div>
        );
}