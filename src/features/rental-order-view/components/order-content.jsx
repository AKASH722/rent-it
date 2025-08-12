import React, { useState } from 'react';
import { ShoppingCart, FileText, MessageSquare } from 'lucide-react';

const OrderContent = ({ orderLines, untaxedTotal, totalTax, total }) => {
  const [activeTab, setActiveTab] = useState('lines');

  const tabs = [
    { key: 'lines', label: 'Order Lines', icon: ShoppingCart },
    { key: 'details', label: 'Other Details', icon: FileText },
    { key: 'notes', label: 'Rental Notes', icon: MessageSquare }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lines':
        return (
          <div className="space-y-6">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tax</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sub Total</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {orderLines.map((line) => (
                    <tr key={line.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{line.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{line.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${line.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${line.tax.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">${line.subTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {orderLines.map((line) => (
                <div key={line.id} className="bg-background border border-border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-foreground">{line.product}</h3>
                    <span className="text-lg font-bold text-foreground">${line.subTotal.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="ml-2 font-medium">{line.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Unit Price:</span>
                      <span className="ml-2 font-medium">${line.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Tax:</span>
                      <span className="ml-2 font-medium">${line.tax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-sm text-gray-600">Payment due within 30 days. Late fees may apply for overdue payments.</p>
                </div>
                <div className="min-w-0 sm:min-w-[250px] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Untaxed Total:</span>
                    <span className="font-medium">${untaxedTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-purple-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
                    <p className="text-sm text-gray-600">Standard Delivery</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <p className="text-sm text-gray-600">2025-01-15</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <p className="text-sm text-gray-600">2025-01-29</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact</label>
                    <p className="text-sm text-gray-600">Sarah Johnson</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-600">sarah.johnson@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Important Notes</h3>
              <p className="text-sm text-yellow-700">
                Equipment must be returned in same condition. Any damage will be charged to the customer.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Internal Notes</h3>
              <textarea
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add internal notes here..."
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Customer Instructions</h3>
              <textarea
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Special instructions for the customer..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OrderContent;
