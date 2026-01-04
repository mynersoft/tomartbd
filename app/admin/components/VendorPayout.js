const dummyVendors = [
  { vendor: "Vendor A", earnings: 45000, status: "Pending" },
  { vendor: "Vendor B", earnings: 27000, status: "Paid" },
];

export default function VendorPayout() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Vendor Payout</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Vendor</th>
            <th className="px-4 py-2">Earnings (BDT)</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyVendors.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.vendor}</td>
              <td className="px-4 py-2">{item.earnings}</td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Mark as Paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}