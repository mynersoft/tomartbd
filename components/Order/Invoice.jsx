import React, { useRef, useState } from "react";
import { 
  Download, 
  Printer, 
  Mail, 
  FileText, 
  User, 
  MapPin, 
  Phone, 
  Calendar,
  CheckCircle,
  Package,
  ChevronRight,
  Copy,
  Check
} from "lucide-react";

const Invoice = ({ order }) => {
  const invoiceRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownloadPDF = () => {
    // Implement PDF generation logic here
    console.log("Downloading PDF...");
  };

  const handleEmailInvoice = () => {
    // Implement email sending logic here
    const subject = `Invoice #${order.invoice} - ${order.customer.name}`;
    const body = `Dear ${order.customer.name},\n\nPlease find your invoice attached.\n\nInvoice #: ${order.invoice}\nTotal: ${formatCurrency(order.total)}\n\nThank you for your business!`;
    window.location.href = `mailto:${order.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate subtotal from items
  const calculateSubtotal = () => {
    return order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div ref={invoiceRef} className="max-w-4xl mx-auto">
        {/* Invoice Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                </div>
                <p className="text-blue-100">Thank you for your business</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    <CheckCircle className={`h-5 w-5 ${order.paymentStatus === 'paid' ? 'text-green-300' : 'text-yellow-300'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Status</p>
                    <p className={`text-lg font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-green-300' : 'text-yellow-300'}`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-blue-200">Invoice #</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold">{order.invoice}</p>
                    <button
                      onClick={() => copyToClipboard(order.invoice)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors"
                      title="Copy invoice number"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-300" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 p-6 bg-gray-50 border-b">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-md"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={handleEmailInvoice}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all hover:shadow-md"
            >
              <Mail className="h-4 w-4" />
              Email Invoice
            </button>
          </div>

          {/* Company & Customer Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                From
              </h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-xl font-bold text-gray-900 mb-1">Your Company Name</p>
                <p className="text-gray-600">123 Business Street</p>
                <p className="text-gray-600">New York, NY 10001</p>
                <p className="text-gray-600">contact@company.com</p>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                Bill To
              </h2>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-xl font-bold text-gray-900 mb-1">{order.customer.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-1" />
                    <div>
                      <p>{order.shipping.address}</p>
                      {order.shipping.city && <p>{order.shipping.city}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="px-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-blue-600" />
              <p className="text-gray-700">
                Invoice Date: <span className="font-semibold">{formatDate(order.createdAt)}</span>
              </p>
              {order.dueDate && (
                <>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-700">
                    Due Date: <span className="font-semibold">{formatDate(order.dueDate)}</span>
                  </p>
                </>
              )}
            </div>

            {/* Order Items Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">Quantity</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">Unit Price</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.orderItems.map((item, index) => (
                      <tr 
                        key={item._id} 
                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center min-w-10 h-10 bg-blue-100 text-blue-700 rounded-lg font-medium">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-gray-700">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full md:w-96 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {order.taxAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Tax ({order.taxRate || 0}%)</span>
                      <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
                    </div>
                  )}
                  
                  {order.shippingCost > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{formatCurrency(order.shippingCost)}</span>
                    </div>
                  )}
                  
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            {order.paymentStatus !== 'paid' && (
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h3 className="font-semibold text-yellow-800 mb-2">Payment Instructions</h3>
                <p className="text-yellow-700 mb-3">
                  Please complete your payment within 30 days. Use the invoice number as reference.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm text-gray-600">Bank Transfer</p>
                    <p className="font-mono text-sm mt-1">Account: 1234 5678 9012</p>
                    <p className="font-mono text-sm">Routing: 021000021</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm text-gray-600">PayPal</p>
                    <p className="font-medium mt-1">payments@company.com</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 p-8 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                If you have any questions about this invoice, please contact:
              </p>
              <p className="text-blue-600 font-medium">support@company.com • (555) 123-4567</p>
              
              <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">30</div>
                  <div className="text-sm text-gray-500">Days Payment Term</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">24/7</div>
                  <div className="text-sm text-gray-500">Support Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-500">Satisfaction Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code for Mobile Payment (Optional) */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <p className="text-sm text-gray-600 mb-3">Scan to pay with mobile</p>
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">QR</div>
                <div className="text-xs text-gray-500 mt-1">Code Here</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Generated for invoice #{order.invoice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;