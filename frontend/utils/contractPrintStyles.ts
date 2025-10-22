export const contractPrintStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { margin: 0; padding: 20px; font-family: 'Times New Roman', serif; }

  .rental-contract {
    max-width: 8.5in;
    margin: 0 auto;
    padding: 0.75in;
    background: white;
    color: black;
    font-family: 'Times New Roman', serif;
    line-height: 1.6;
  }

  .contract-header {
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

  .contract-title {
    text-align: center;
    margin: 2rem 0;
  }

  .contract-title h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .contract-number,
  .contract-date {
    font-size: 14px;
    color: #555;
    margin: 0.25rem 0;
  }

  .contract-section {
    margin: 2rem 0;
    page-break-inside: avoid;
  }

  .contract-section h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #333;
  }

  .section-content {
    padding-left: 1rem;
  }

  .party {
    margin: 0.5rem 0;
  }

  .party p {
    margin: 0.25rem 0;
    color: #333;
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
  }

  .pricing-table .amount {
    text-align: right;
    font-family: monospace;
  }

  .total-row {
    border-top: 2px solid #333;
    font-size: 18px;
  }

  .total-row td {
    padding-top: 1rem;
  }

  .rich-content {
    color: #333;
  }

  .rich-content h1,
  .rich-content h2,
  .rich-content h3 {
    font-weight: bold;
    margin: 1em 0 0.5em 0;
    color: #1a1a1a;
  }

  .rich-content h1 {
    font-size: 24px;
  }

  .rich-content h2 {
    font-size: 20px;
  }

  .rich-content h3 {
    font-size: 18px;
  }

  .rich-content p {
    margin: 0.75rem 0;
    line-height: 1.6;
  }

  .rich-content ul,
  .rich-content ol {
    padding-left: 1.5rem;
    margin: 1rem 0;
  }

  .rich-content li {
    margin: 0.5rem 0;
  }

  .rich-content strong {
    font-weight: bold;
  }

  .rich-content em {
    font-style: italic;
  }

  .rich-content u {
    text-decoration: underline;
  }

  .rich-content hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 1.5rem 0;
  }

  .signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 3rem;
  }

  .signature-box {
    text-align: center;
  }

  .signature-line {
    border-bottom: 2px solid #333;
    margin: 3rem 0 1rem 0;
    height: 50px;
  }

  .signature-box p {
    margin: 0.5rem 0;
    font-size: 14px;
  }

  .contract-footer {
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid #ddd;
    font-size: 12px;
  }

  .v-divider {
    display: none;
  }

  @media print {
    body { padding: 0; }
    .rental-contract { padding: 0; max-width: none; }
    .contract-section { page-break-inside: avoid; }
    .signatures { page-break-before: avoid; }
  }
`
