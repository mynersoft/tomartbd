'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BogoListPage() {
  const [bogos, setBogos] = useState([]);

  useEffect(() => {
    fetch('/api/bogo')
      .then((res) => res.json())
      .then((data) => setBogos(data));
  }, []);

  const deleteHandler = async (id) => {
    await fetch(`/api/bogo/${id}`, { method: 'DELETE' });
    setBogos(bogos.filter((b) => b._id !== id));
    toast.success('Deleted');
  };

  return (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">BOGO Offers</h1>
        <Link href="/admin/bogo/create" className="btn-primary">
          Add BOGO
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th>Name</th>
            <th>Offer</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {bogos.map((b) => (
            <tr key={b._id} className="border-t">
              <td>{b.name}</td>
              <td>
                Buy {b.buyQty} Get {b.getQty}
              </td>
              <td>{b.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <button
                  onClick={() => deleteHandler(b._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}