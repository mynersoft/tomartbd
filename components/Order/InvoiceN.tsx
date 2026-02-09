// app/invoice/page.tsx (or components/Invoice.tsx)
import React from 'react';

interface OrderInfo {
  orderId: string;
  invoiceNo: string;
  orderDate: string;
  invoiceDate: string;
}

interface CompanyInfo {
  name: string;
  phone: string;
  website: string;
  address: string;
  bin: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface Product {
  id: number;
  name: string;
  quantity: string;
  mrp: number;
  discount: number;
  amount: number;
}

interface Summary {
  subtotal: number;
  discount: number;
  rounding: number;
  delivery: number;
  total: number;
}

const TomartBDInvoice: React.FC = () => {
  const orderInfo: OrderInfo = {
    orderId: '#4050831',
    invoiceNo: '4050831',
    orderDate: '19/01/2026',
    invoiceDate: '19/01/2026',
  };

  const companyInfo: CompanyInfo = {
    name: 'TomartBD',
    phone: '01600000000',
    website: 'www.tomartbd.com',
    address: '123/A, Mirpur Road, Dhaka-1207',
    bin: '004687255-0303',
  };

  const customerInfo: CustomerInfo = {
    name: 'Md Mahir',
    phone: '+8801868944080',
    address: 'Notun bazar, Kakraid (Modhupur), Tangail, Dhaka',
  };

  const products: Product[] = [
    { id: 1, name: 'Terbimax Cream', quantity: '2 x 10gm tubes', mrp: 160, discount: 14.56, amount: 145.44 },
    { id: 2, name: 'Timex 25', quantity: '1 x Strip (10 Tablet)', mrp: 90, discount: 8.19, amount: 81.81 },
    { id: 3, name: 'Edysta 2.5', quantity: '2 x Strips (20 Tablet)', mrp: 200, discount: 18.2, amount: 181.8 },
    { id: 4, name: 'Alcet', quantity: '1 x Strip (10 Tablet)', mrp: 45, discount: 4.1, amount: 40.9 },
  ];

  const summary: Summary = {
    subtotal: 495.0,
    discount: -45.05,
    rounding: -0.95,
    delivery: 59.0,
    total: 508.0,
  };

  const formatCurrency = (amount: number): string => {
    return `৳${amount.toFixed(2)}`;
  };

  const handleDownload = (): void => {
    // Implement download functionality
    console.log('Downloading invoice...');
    // You can implement PDF generation or print functionality here
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-green-600">TomartBD</h1>
              <p className="text-gray-600 mt-1">Your Trusted Pharmacy Partner</p>
            </div>
            <div className="mt-4 md:mt-0">
              <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-gray-500 text-sm mt-1">Invoice No: {orderInfo.invoiceNo}</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <InfoRow label="Order ID:" value={orderInfo.orderId} />
              <InfoRow label="Order Date:" value={orderInfo.orderDate} />
            </div>
            <div className="space-y-2">
              <InfoRow label="Invoice No:" value={orderInfo.invoiceNo} />
              <InfoRow label="Invoice Date:" value={orderInfo.invoiceDate} />
            </div>
          </div>
        </div>

        {/* Company & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Bill From */}
          <InfoCard title="Bill From">
            <div className="space-y-2">
              <p className="font-bold text-green-700">{companyInfo.name}</p>
              <p className="text-gray-600">{companyInfo.phone}</p>
              <p className="text-gray-600">{companyInfo.website}</p>
              <p className="text-gray-600">{companyInfo.address}</p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">BIN Number:</span> {companyInfo.bin}
              </p>
            </div>
          </InfoCard>

          {/* Customer Info */}
          <InfoCard title="Customer Information">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Billed To</h3>
                <div className="space-y-2">
                  <p className="font-medium">{customerInfo.name}</p>
                  <p className="text-gray-600">{customerInfo.phone}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Deliver To</h3>
                <div className="space-y-2">
                  <p className="font-medium">{customerInfo.name}</p>
                  <p className="text-gray-600">{customerInfo.phone}</p>
                  <p className="text-gray-600">{customerInfo.address}</p>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Products Table */}
        <div className="mb-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
          <ProductsTable products={products} />
        </div>

        {/* Summary */}
        <div className="md:w-1/2 ml-auto mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
            <SummarySection summary={summary} />
          </div>
        </div>

        {/* Footer Notes */}
        <div className="border-t pt-6 text-sm text-gray-600">
          <p className="mb-3">
            This service falls under services code S0099.60 of VAT and the VAT has been calculated according to explanation letter No. 02/ Mushak / 2019.
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="font-medium"># 0 Taka Cashback Rewarded For This Order</p>
              <p className="text-gray-500 italic">* N.B: This cashback will be applicable at your next order</p>
            </div>
            <button 
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Download Invoice
            </button>
          </div>
        </div>

        {/* Watermark/Logo */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-400">Thank you for choosing TomartBD</p>
          <p className="text-sm text-gray-400 mt-1">For any queries, contact: support@tomartbd.com</p>
        </div>
      </div>
    </div>
  );
};

// Reusable Components with TypeScript interfaces

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="flex">
      <span className="w-32 text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
};

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-green-50">
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SL No.</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Products</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">MRP</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Discount</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50">
            <td className="px-4 py-4 text-sm text-gray-900">{product.id}</td>
            <td className="px-4 py-4">
              <div className="text-sm font-medium text-gray-900">{product.name}</div>
            </td>
            <td className="px-4 py-4 text-sm text-gray-700">{product.quantity}</td>
            <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(product.mrp)}</td>
            <td className="px-4 py-4 text-sm text-green-600">-{formatCurrency(product.discount)}</td>
            <td className="px-4 py-4 text-sm font-medium text-gray-900">{formatCurrency(product.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface SummarySectionProps {
  summary: Summary;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  const formatCurrency = (amount: number): string => {
    return `৳${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatCurrency(summary.subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Discount applied</span>
        <span className="text-green-600">-{formatCurrency(Math.abs(summary.discount))}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Rounding Off</span>
        <span className="text-green-600">-{formatCurrency(Math.abs(summary.rounding))}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Estimated Delivery 1-5 Days (Outside Dhaka)</span>
        <span>{formatCurrency(summary.delivery)}</span>
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">Amount Payable</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-700">{formatCurrency(summary.total)}</div>
            <div className="text-sm text-green-600 font-medium">(Paid)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function (defined outside component)
const formatCurrency = (amount: number): string => {
  return `৳${amount.toFixed(2)}`;
};

export default TomartBDInvoice;