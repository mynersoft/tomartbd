import {
  Calendar,
  Copy,
  DollarSign,
  Edit2,
  Eye,
  Percent,
  Tag,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useDeleteVoucher } from '@/hooks/useVoucher';
import {StatusToggle} from "./StatusToggle";

const VoucherTable = ({
  handleSelectAll,
  selectedVouchers,
  filteredVouchers,
}) => {
  const [editingVoucher, setEditingVoucher] = useState(null);
  const deleteVoucher = useDeleteVoucher();

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        text: 'Active',
        className: 'bg-green-100 text-green-800',
      },
      scheduled: {
        text: 'Scheduled',
        className: 'bg-blue-100 text-blue-800',
      },
      used: { text: 'Used', className: 'bg-purple-100 text-purple-800' },
      expired: { text: 'Expired', className: 'bg-red-100 text-red-800' },
      draft: { text: 'Draft', className: 'bg-gray-100 text-gray-800' },
    };
    const config = statusConfig[status] || {
      text: status,
      className: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  const getDiscountIcon = (type) => {
    if (type === 'percentage') return <Percent className="w-4 h-4" />;
    if (type === 'fixed') return <DollarSign className="w-4 h-4" />;
    return <Tag className="w-4 h-4" />;
  };

	const handleDeleteVoucher = (id) => {
	  
    if (confirm('Are you sure you want to delete this voucher?')) {
      deleteVoucher.mutate(id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Code
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                usege limit
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Validity
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVouchers.map((voucher) => (
              <tr key={voucher.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-gray-900">
                        {voucher.code}
                      </div>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(voucher.code)
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">{voucher.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full">
                      {voucher.discountType}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {voucher.discountType === 'percentage'
                        ? `${voucher.discountValue}%`
                        : voucher.discountType === 'fixed'
                          ? `${voucher.discountValue}`
                          : 'Free Shipping'}
                    </div>
                    {voucher.minPurchase && (
                      <div className="text-xs text-gray-500">
                        Min: ${voucher.minOrderAmount}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {voucher.usedCount}/{voucher.usageLimit || '∞'}
                    </div>

                    {voucher.usageLimit && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (voucher.usedCount / voucher.usageLimit) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(voucher.isActive)}


 
<td className="px-6 py-4 whitespace-nowrap">
  <StatusToggle voucher={voucher} />
</td>




                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {voucher.customerLimit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar className="w-3 h-3" />
                      {new Date(voucher.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(voucher.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingVoucher(voucher)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        alert(`Viewing analytics for ${voucher.code}`)
                      }
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                      title="Analytics"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVoucher(voucher._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherTable;
