import type { Payment } from '~/types/payment'

export interface PrintReceiptOptions {
  payment: Payment
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  getMethodLabel: (method: string) => string
  companyInfo?: {
    name: string
    address: string
    phone: string
    email: string
  }
}

export const printReceipt = (options: PrintReceiptOptions) => {
  const { payment, formatCurrency, formatDate, getMethodLabel, companyInfo } = options

  const company = companyInfo || {
    name: 'Vehicle Rental Company',
    address: '123 Main Street, City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@vehiclerental.com',
  }

  const receiptContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt - #${payment.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 40px;
            color: #1a1a1a;
            line-height: 1.6;
          }

          .receipt {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }

          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
          }

          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 8px;
          }

          .company-details {
            font-size: 13px;
            color: #666;
            line-height: 1.6;
          }

          .receipt-title {
            font-size: 24px;
            font-weight: bold;
            margin: 25px 0 8px;
            color: #1a1a1a;
          }

          .receipt-id {
            font-size: 14px;
            color: #666;
          }

          .section {
            margin-bottom: 30px;
          }

          .section-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #1a1a1a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .info-item {
            padding: 12px;
            background: #fafafa;
            border-radius: 4px;
            border: 1px solid #f0f0f0;
          }

          .info-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 4px;
            font-weight: 600;
          }

          .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .amount-section {
            margin: 30px 0;
            padding: 25px;
            background: #1a1a1a;
            border-radius: 4px;
            text-align: center;
          }

          .amount-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }

          .amount-value {
            font-size: 36px;
            font-weight: bold;
            color: white;
          }

          .status-badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .status-completed {
            background: #e8f5e9;
            color: #2e7d32;
          }

          .status-pending {
            background: #fff3e0;
            color: #e65100;
          }

          .status-failed {
            background: #ffebee;
            color: #c62828;
          }

          .status-refunded {
            background: #e3f2fd;
            color: #1565c0;
          }

          .description-box {
            padding: 15px;
            background: #fafafa;
            border-radius: 4px;
            border: 1px solid #f0f0f0;
            margin-top: 12px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }

          .description-box .info-value {
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 13px;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
          }

          .footer-note {
            margin-top: 10px;
            font-style: italic;
          }

          @media print {
            body {
              padding: 20px;
            }

            .receipt {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Header -->
          <div class="header">
            <div class="company-name">${company.name}</div>
            <div class="company-details">
              ${company.address}<br>
              ${company.phone} | ${company.email}
            </div>
            <div class="receipt-title">PAYMENT RECEIPT</div>
            <div class="receipt-id">Receipt #${payment.id}</div>
          </div>

          <!-- Payment Amount -->
          <div class="amount-section">
            <div class="amount-label">Amount Paid</div>
            <div class="amount-value">${formatCurrency(payment.amount)}</div>
          </div>

          <!-- Payment Information -->
          <div class="section">
            <div class="section-title">Payment Details</div>
            <div class="info-grid">
              ${payment.transactionId ? `
                <div class="info-item">
                  <div class="info-label">Transaction ID</div>
                  <div class="info-value">${payment.transactionId}</div>
                </div>
              ` : ''}
              <div class="info-item">
                <div class="info-label">Payment Method</div>
                <div class="info-value">${getMethodLabel(payment.paymentMethod)}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">
                  <span class="status-badge status-${payment.status}">${payment.status}</span>
                </div>
              </div>
              ${payment.paymentDate ? `
                <div class="info-item">
                  <div class="info-label">Payment Date</div>
                  <div class="info-value">${formatDate(payment.paymentDate)}</div>
                </div>
              ` : ''}
              <div class="info-item">
                <div class="info-label">Due Date</div>
                <div class="info-value">${formatDate(payment.dueDate)}</div>
              </div>
            </div>

            ${payment.description ? `
              <div class="description-box">
                <div class="info-label">Description</div>
                <div class="info-value">${payment.description}</div>
              </div>
            ` : ''}
          </div>

          <!-- Rental Information -->
          <div class="section">
            <div class="section-title">Rental Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Rental ID</div>
                <div class="info-value">#${payment.rentalId}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Customer</div>
                <div class="info-value">${payment.customerName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Vehicle</div>
                <div class="info-value">${payment.vehicleName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">License Plate</div>
                <div class="info-value">${payment.licensePlate}</div>
              </div>
            </div>
          </div>

          ${payment.refundDate && payment.refundAmount ? `
            <div class="section">
              <div class="section-title">Refund Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Refund Amount</div>
                  <div class="info-value">${formatCurrency(payment.refundAmount)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Refund Date</div>
                  <div class="info-value">${formatDate(payment.refundDate)}</div>
                </div>
              </div>
            </div>
          ` : ''}

          ${payment.notes ? `
            <div class="section">
              <div class="section-title">Notes</div>
              <div class="description-box">
                <div class="info-value">${payment.notes}</div>
              </div>
            </div>
          ` : ''}

          <!-- Footer -->
          <div class="footer">
            <div>Thank you for your business!</div>
            <div class="footer-note">
              This is an official payment receipt generated on ${formatDate(new Date().toISOString().split('T')[0])}
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    console.error('Failed to open print window')
    return
  }

  printWindow.document.write(receiptContent)
  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}
