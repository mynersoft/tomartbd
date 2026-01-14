'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function CreateBogoPage() {
  const router = useRouter();
  const { products } = useSelector((state) => state.product);

  const [data, setData] = useState({
    name: '',
    mainItem: '',
    freeItem: '',
    buyQty: 1,
    getQty: 1,
    sameProductOnly: true,
    isActive: true,
  });

  const submitHandler = async () => {
    if (!data.name || !data.mainItem) {
      toast.error('Required fields missing');
      return;
    }

    const res = await fetch('/api/bogo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success('BOGO created');
      router.push('/admin/bogo');
    } else {
      toast.error('Failed');
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl border space-y-6">
      <h1 className="text-xl font-bold">Create BOGO Offer</h1>

      <input
        className="input"
        placeholder="Offer Title (Buy 1 Get 1)"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />

      <select
        className="input"
        value={data.mainItem}
        onChange={(e) => setData({ ...data, mainItem: e.target.value })}
      >
        <option value="">Select Buy Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={data.sameProductOnly}
          onChange={(e) =>
            setData({ ...data, sameProductOnly: e.target.checked })
          }
        />
        Buy & Get Same Product
      </label>

      {!data.sameProductOnly && (
        <select
          className="input"
          value={data.freeItem}
          onChange={(e) => setData({ ...data, freeItem: e.target.value })}
        >
          <option value="">Select Free Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          className="input"
          value={data.buyQty}
          onChange={(e) =>
            setData({ ...data, buyQty: Number(e.target.value) })
          }
          placeholder="Buy Quantity"
        />
        <input
          type="number"
          className="input"
          value={data.getQty}
          onChange={(e) =>
            setData({ ...data, getQty: Number(e.target.value) })
          }
          placeholder="Get Quantity"
        />
      </div>

      <button onClick={submitHandler} className="btn-primary w-full">
        Create BOGO
      </button>
    </div>
  );
}