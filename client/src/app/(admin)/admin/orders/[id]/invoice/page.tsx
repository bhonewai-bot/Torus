"use client";

import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { Button } from "@/components/ui/button";
import { getPaymentStatusBadge } from "@/features/orders/components/admin/details/OrderBadge";
import { useOrder } from "@/features/orders/hooks/useOrders";
import { formatCurrency, formatOrderDate } from "@/lib/utils/format.utils";
import { Download, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDFDocument from "@/components/common/InvoicePDFDocument";

interface InvoicePageProps {
    params: {
        id: string;
    }
}

export default function InvoicePage({ params }: InvoicePageProps) {
    const router = useRouter();
    const { id } = React.use(params) as { id: string };
    const { data: order, isLoading, error } = useOrder(id);

    const handleDownloadPDF = async () => {
        if (!order) return;
        
        try {
            const blob = await pdf(<InvoicePDFDocument order={order} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${order.orderNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading order</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="space-y-6 pb-6">
                <CustomBreadcrumb item={"Invoice"} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-medium">Invoice</h1>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button 
                        variant="secondary" 
                        onClick={handleDownloadPDF}
                        className="flex-1 sm:flex-none"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button 
                        variant="secondary" 
                        onClick={handlePrint}
                        className="flex-1 sm:flex-none print:hidden"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8 print:shadow-none print:p-0">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-black">ACME Corporation</h2>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 leading-relaxed">
                                <p>123 Business Avenue</p>
                                <p>Los Angeles, CA 90001</p>
                                <p>Phone: +1 (555) 123-4567 | Email: hello@acmecorp.com</p>
                                <p>Website: www.acmecorp.com | Tax ID: 12-3456789</p>
                            </div>
                        </div>

                        <div className="text-left lg:text-right space-y-2 lg:min-w-[300px]">
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between lg:justify-end gap-4">
                                    <span className="text-gray-600">Invoice No:</span>
                                    <span className="font-semibold">INV-{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between lg:justify-end gap-4">
                                    <span className="text-gray-600">Order No:</span>
                                    <span className="font-semibold">ORD-{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between lg:justify-end gap-4">
                                    <span className="text-gray-600">Order Date:</span>
                                    <span className="font-semibold">{formatOrderDate(order.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing and Shipping Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-black mb-3 text-base">Bill To</h3>
                            <div className="space-y-1 text-sm">
                                <p className="font-semibold text-black">{order.user.name}</p>
                                <p className="text-gray-600">{order.user.email}</p>
                                <p className="text-gray-600">{order.user.phone}</p>
                                <p className="text-gray-600">ID: {order.user.id}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-black mb-3 text-base">Ship To</h3>
                            <div className="space-y-1 text-sm">
                                <p className="font-semibold text-black">{order.user.name}</p>
                                <p className="text-gray-600">
                                    {order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}
                                </p>
                                <p className="text-gray-600">
                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                </p>
                                <p className="text-gray-600">{order.shippingAddress?.country}</p>
                                <p className="text-gray-600">{order.shippingAddress?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600">Order Status:</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                                <span className="text-gray-600">
                                    Shipping: <span className="text-black font-medium">Standard Delivery (3-5 days)</span>
                                </span>
                                <span className="text-gray-600">
                                    Tracking: <span className="font-mono text-black">TRK{order.orderNumber}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-black">Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gray-200 rounded-lg overflow-hidden">
                                                <img 
                                                    src={item.productImage} 
                                                    alt={item.productTitle}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-black text-sm truncate">
                                                        {item.productTitle}
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-black">
                                                        {formatCurrency(item.lineTotal)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm text-gray-600">
                                                <div className="flex flex-wrap gap-2 sm:gap-4">
                                                    <span>SKU: {item.productSku}</span>
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>Price: {formatCurrency(item.unitPrice)}</span>
                                                </div>
                                                <div className="flex gap-2 sm:gap-4">
                                                    <span className="font-semibold text-black">
                                                        Total: {formatCurrency(item.lineTotal)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Information and Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-black mb-4">Payment Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span className="font-semibold text-black">
                                                {order.payments?.[0]?.method || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span>{getPaymentStatusBadge(order.orderStatus)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Transaction:</span>
                                            <span className="font-mono text-xs break-all">
                                                {order.payments?.[0]?.transactionId || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Date:</span>
                                            <span className="font-medium">
                                                {order.payments?.[0]?.createdAt 
                                                    ? formatOrderDate(order.payments[0].createdAt) 
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Provider:</span>
                                            <span className="font-medium">
                                                {order.payments?.[0]?.provider || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:min-w-[300px]">
                                <h3 className="text-sm font-semibold text-black mb-4">Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(order.pricing.subtotal)}</span>
                                    </div>
                                    {order.pricing.discountAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="font-medium text-green-600">
                                                -{formatCurrency(order.pricing.discountAmount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium">{formatCurrency(order.pricing.taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping & Handling</span>
                                        <span className="font-medium">{formatCurrency(order.pricing.shippingAmount)}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between text-base font-bold">
                                            <span>Total</span>
                                            <span>{formatCurrency(order.pricing.total)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount Paid</span>
                                        <span className="font-medium text-green-600">
                                            {formatCurrency(order.pricing.total)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Balance Due</span>
                                        <span className="font-bold">$0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-black mb-3">Terms & Information</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-2">
                                <h4 className="font-medium text-black">Business Terms</h4>
                                <div className="space-y-1 text-gray-600">
                                    <p>Payment Terms: Net 30 days</p>
                                    <p>Late Payment Fee: 1.5% per month</p>
                                    <p>Return Policy: 30-day return window</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-black">Contact Information</h4>
                                <div className="space-y-1 text-gray-600">
                                    <p>Customer Service: support@acmecorp.com</p>
                                    <p>Phone: 1-800-555-0123</p>
                                    <p>Website: www.acmecorp.com</p>
                                    <p>Business Hours: Mon-Fri 9AM-6PM EST</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 text-center text-sm text-gray-600">
                            <p className="font-medium text-black mb-1">Thank you for your business!</p>
                            <p>All sales are final unless otherwise stated • Please retain this invoice for your records</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}