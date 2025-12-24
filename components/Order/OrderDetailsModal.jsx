// components/orders/OrderDetailsModal.jsx
import { X, Printer, Truck, CreditCard } from "lucide-react";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600">Order #{order.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Order Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Status Timeline */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
                  <div className="space-y-4">
                    {['ordered', 'processing', 'shipped', 'delivered'].map((status, index) => (
                      <div key={status} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= ['ordered', 'processing', 'shipped', 'delivered'].indexOf(order.status)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{status}</p>
                          <p className="text-sm text-gray-600">
                            {status === 'delivered' && order.deliveryDate
                              ? `Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}`
                              : status === 'shipped' && order.estimatedDelivery
                              ? `Shipped - Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`
                              : `Order ${status} successfully`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Items in this order</h3>
                  <div className="space-y-4">
                    {order.itemsList.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${(order.total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${(order.total * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Payment</h4>
                    </div>
                    <p className="text-gray-700">{order.paymentMethod}</p>
                    <p className="text-sm text-gray-600 mt-1">Paid on {new Date(order.date).toLocaleDateString()}</p>
                  </div>

                  {order.trackingNumber && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">Shipping</h4>
                      </div>
                      <p className="text-sm text-gray-700">Tracking Number:</p>
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded block mt-1">
                        {order.trackingNumber}
                      </code>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </button>
                  <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                    Need Help?
                  </button>
                  <button className="w-full px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                    Reorder Items
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;