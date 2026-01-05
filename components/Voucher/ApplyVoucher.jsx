import { useState } from 'react';
import { useApplyVoucher } from '../../hooks/useVoucher';

function ApplyVoucher({ subtotal, cartItems, }) {
  const applyVoucher = useApplyVoucher();

  const [voucher, setVoucher] = useState('');

  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
  };

  const data = {
    subtotal,
    voucher,
    cartItems,
  };

  console.log(data);
  
  const handleVoucherSubmit = () => {
    applyVoucher.mutate(data, {
      onSuccess: (data) => {
        // console.log(data);
      },
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex items-center gap-2">Voucher</div>
      </label>
      <input
        type="text"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="Enter voucher"
        name="voucher"
        value={voucher}
        onChange={handleVoucherChange}
      />
      <button onClick={handleVoucherSubmit}>Apply voucher</button>
    </div>
  );
}

export default ApplyVoucher;
