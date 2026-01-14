'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddBogo } from '@/hooks/useBogo';

export const BogoForm = () => {
  const { products } = useSelector((state) => state.product);
  const { mutate, isPending } = useAddBogo();

  const [formData, setFormData] = useState({
    name: '',
    mainItem: '',
    freeItem: '',
    buyQty: 1,
    getQty: 1,
    sameProductOnly: true,
    featureImage: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.mainItem) {
      toast.error('Name & main product required');
      return;
    }

    if (!formData.sameProductOnly && !formData.freeItem) {
      toast.error('Free product required');
      return;
    }

    mutate(formData, {
      onSuccess: () => toast.success('BOGO created'),
      onError: () => toast.error('Failed to create BOGO'),
    });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-bold">Create BOGO Offer</h2>

      <input
        className="input"
        placeholder="BOGO Title (Buy 1 Get 1)"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />

      {/* Main Product */}
      <select
        className="input"
        value={formData.mainItem}
        onChange={(e) =>
          setFormData({ ...formData, mainItem: e.target.value })
        }
      >
        <option value="">Select Main Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Same / Different Product */}
      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={formData.sameProductOnly}
          onChange={(e) =>
            setFormData({
              ...formData,
              sameProductOnly: e.target.checked,
            })
          }
        />
        Buy & Get Same Product
      </label>

      {!formData.sameProductOnly && (
        <select
          className="input"
          value={formData.freeItem}
          onChange={(e) =>
            setFormData({ ...formData, freeItem: e.target.value })
          }
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
          value={formData.buyQty}
          onChange={(e) =>
            setFormData({ ...formData, buyQty: +e.target.value })
          }
          placeholder="Buy Qty"
        />
        <input
          type="number"
          className="input"
          value={formData.getQty}
          onChange={(e) =>
            setFormData({ ...formData, getQty: +e.target.value })
          }
          placeholder="Get Qty"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="btn-primary flex items-center gap-2"
      >
        <Save size={18} />
        Create BOGO
      </button>
    </div>
  );
};