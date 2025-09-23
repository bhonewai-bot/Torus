import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatCurrency, formatOrderDate } from "@/lib/utils/format.utils";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 32,
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  companyDetails: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.4,
    marginBottom: 2,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    minWidth: 200,
  },
  invoiceLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  invoiceValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  addressBox: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },
  addressTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  addressText: {
    fontSize: 9,
    marginBottom: 2,
    color: '#374151',
  },
  addressName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#000000',
  },
  statusSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  statusRight: {
    fontSize: 8,
    color: '#6B7280',
  },
  itemsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  itemCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  itemPrice: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
  },
  itemRight: {
    flexDirection: 'row',
  },
  itemDetail: {
    fontSize: 8,
    color: '#6B7280',
    marginRight: 16,
  },
  itemDetailBold: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  paymentSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  paymentContent: {
    flexDirection: 'row',
  },
  paymentLeft: {
    flex: 1,
    paddingRight: 24,
  },
  paymentGrid: {
    flexDirection: 'row',
  },
  paymentColumn: {
    flex: 1,
    paddingRight: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  paymentValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
  },
  paymentValueSmall: {
    fontSize: 8,
    fontFamily: 'Courier',
  },
  summarySection: {
    minWidth: 200,
    paddingLeft: 32,
  },
  summaryBox: {
    minWidth: 200,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: 'medium',
  },
  summaryDiscount: {
    fontSize: 9,
    fontWeight: 'medium',
    color: '#059669',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTop: '1 solid #E5E7EB',
    marginTop: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  paidValue: {
    fontSize: 9,
    fontWeight: 'medium',
    color: '#059669',
  },
  termsSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  termsContent: {
    flexDirection: 'row',
  },
  termsColumn: {
    flex: 1,
    paddingRight: 24,
  },
  termsTitle: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#000000',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    textAlign: 'center',
    borderTop: '1 solid #E5E7EB',
  },
  footerTitle: {
    fontSize: 9,
    fontWeight: 'medium',
    color: '#000000',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
  },
});

interface InvoicePDFDocumentProps {
  order: any; // Replace with your actual order type
}

const InvoicePDFDocument: React.FC<InvoicePDFDocumentProps> = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header - Matches web version exactly */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>ACME Corporation</Text>
          <Text style={styles.companyDetails}>123 Business Avenue</Text>
          <Text style={styles.companyDetails}>Los Angeles, CA 90001</Text>
          <Text style={styles.companyDetails}>Phone: +1 (555) 123-4567 | Email: hello@acmecorp.com</Text>
          <Text style={styles.companyDetails}>Website: www.acmecorp.com | Tax ID: 12-3456789</Text>
        </View>
        
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceTitle}>Invoice</Text>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Invoice No:</Text>
            <Text style={styles.invoiceValue}>INV-{order.orderNumber}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Order No:</Text>
            <Text style={styles.invoiceValue}>ORD-{order.orderNumber}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Order Date:</Text>
            <Text style={styles.invoiceValue}>{formatOrderDate(order.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Billing and Shipping Address - Matches web version */}
      <View style={styles.addressSection}>
        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>Bill To</Text>
          <Text style={styles.addressName}>{order.user.name}</Text>
          <Text style={styles.addressText}>{order.user.email}</Text>
          <Text style={styles.addressText}>{order.user.phone}</Text>
          <Text style={styles.addressText}>ID: {order.user.id}</Text>
        </View>
        
        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>Ship To</Text>
          <Text style={styles.addressName}>{order.user.name}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}
          </Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
          </Text>
          <Text style={styles.addressText}>{order.shippingAddress?.country}</Text>
          <Text style={styles.addressText}>{order.shippingAddress?.phone}</Text>
        </View>
      </View>

      {/* Order Status - Matches web version */}
      <View style={styles.statusSection}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusLabel}>Order Status:</Text>
            <View style={styles.statusBadge}>
              <Text>{order.orderStatus}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.statusRight}>
              Shipping: Standard Delivery (3-5 days)     Tracking: TRK{order.orderNumber}
            </Text>
          </View>
        </View>
      </View>

      {/* Items Section - Matches web version with card layout */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>Items</Text>
        
        {order.items.map((item: any, index: number) => (
          <View key={index} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.productTitle}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.lineTotal)}</Text>
            </View>
            
            <View style={styles.itemDetails}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemDetail}>SKU: {item.productSku}</Text>
                <Text style={styles.itemDetail}>Qty: {item.quantity}</Text>
                <Text style={styles.itemDetail}>Price: {formatCurrency(item.unitPrice)}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemDetailBold}>Total: {formatCurrency(item.lineTotal)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Payment Information and Summary - Matches web version layout */}
      <View style={styles.paymentSection}>
        <View style={styles.paymentContent}>
          <View style={styles.paymentLeft}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <View style={styles.paymentGrid}>
              <View style={styles.paymentColumn}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Payment Method:</Text>
                  <Text style={styles.paymentValue}>{order.payments?.[0]?.method || 'N/A'}</Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Status:</Text>
                  <Text style={styles.paymentValue}>{order.orderStatus}</Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Transaction:</Text>
                  <Text style={styles.paymentValueSmall}>{order.payments?.[0]?.transactionId || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.paymentColumn}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Payment Date:</Text>
                  <Text style={styles.paymentValue}>
                    {order.payments?.[0]?.createdAt ? formatOrderDate(order.payments[0].createdAt) : 'N/A'}
                  </Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Provider:</Text>
                  <Text style={styles.paymentValue}>{order.payments?.[0]?.provider || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Summary Section - Matches web version exactly */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.pricing.subtotal)}</Text>
              </View>
              
              {order.pricing.discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={styles.summaryDiscount}>-{formatCurrency(order.pricing.discountAmount)}</Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.pricing.taxAmount)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping & Handling</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.pricing.shippingAmount)}</Text>
              </View>
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(order.pricing.total)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={styles.paidValue}>{formatCurrency(order.pricing.total)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Balance Due</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Terms & Information - Matches web version */}
      <View style={styles.termsSection}>
        <Text style={styles.sectionTitle}>Terms & Information</Text>
        <View style={styles.termsContent}>
          <View style={styles.termsColumn}>
            <Text style={styles.termsTitle}>Business Terms</Text>
            <Text style={styles.termsText}>Payment Terms: Net 30 days</Text>
            <Text style={styles.termsText}>Late Payment Fee: 1.5% per month</Text>
            <Text style={styles.termsText}>Return Policy: 30-day return window</Text>
          </View>
          <View style={styles.termsColumn}>
            <Text style={styles.termsTitle}>Contact Information</Text>
            <Text style={styles.termsText}>Customer Service: support@acmecorp.com</Text>
            <Text style={styles.termsText}>Phone: 1-800-555-0123</Text>
            <Text style={styles.termsText}>Website: www.acmecorp.com</Text>
            <Text style={styles.termsText}>Business Hours: Mon-Fri 9AM-6PM EST</Text>
          </View>
        </View>

        {/* Footer - Matches web version */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Thank you for your business!</Text>
          <Text style={styles.footerText}>
            All sales are final unless otherwise stated • Please retain this invoice for your records
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDFDocument;