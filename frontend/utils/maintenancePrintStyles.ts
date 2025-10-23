export const maintenancePrintStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 20px; font-family: 'Times New Roman', serif; }

  .maintenance-report {
    max-width: 8.5in;
    margin: 0 auto;
    padding: 0.75in;
    background: white;
    color: black;
    font-family: 'Times New Roman', serif;
    line-height: 1.6;
  }

  .report-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .company-name {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .company-info {
    font-size: 14px;
    color: #555;
  }

  .company-info p {
    margin: 0.25rem 0;
  }

  .report-title {
    text-align: center;
    margin: 2rem 0;
  }

  .report-title h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .report-number,
  .report-date {
    font-size: 14px;
    color: #555;
    margin: 0.25rem 0;
  }

  .report-section {
    margin: 2rem 0;
    page-break-inside: avoid;
  }

  .report-section h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #333;
  }

  .section-content {
    padding-left: 1rem;
  }

  .section-content p {
    margin: 0.5rem 0;
    color: #333;
    line-height: 1.6;
  }

  .info-table,
  .pricing-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .info-table td,
  .pricing-table td {
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }

  .info-table td:first-child {
    width: 40%;
  }

  .pricing-table td {
    padding: 0.75rem 0.5rem;
    font-size: 16px;
    font-weight: bold;
  }

  .pricing-table .amount {
    text-align: right;
    font-family: monospace;
  }

  .report-footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
    font-size: 12px;
    color: #555;
  }

  .v-divider {
    display: none;
  }

  @media print {
    body { padding: 0; }
    .maintenance-report { padding: 0; max-width: none; }
    .report-section { page-break-inside: avoid; }
  }
`
