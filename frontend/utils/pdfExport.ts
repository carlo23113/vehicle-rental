/**
 * PDF Export Utility
 *
 * This utility provides functions to export invoices and receipts to PDF.
 * It uses the browser's print functionality to generate PDFs.
 *
 * For production, consider using libraries like:
 * - jsPDF
 * - html2pdf
 * - pdfmake
 */

export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  // Create a print-friendly version
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            @page { size: A4; margin: 0; }
          }
          ${getComputedStyles(element)}
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export const printElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  const printContents = element.innerHTML
  const originalContents = document.body.innerHTML

  document.body.innerHTML = printContents
  window.print()
  document.body.innerHTML = originalContents
  window.location.reload()
}

export const downloadAsHTML = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function getComputedStyles(element: Element): string {
  const styles = window.getComputedStyle(element)
  let css = ''
  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i]
    css += `${prop}: ${styles.getPropertyValue(prop)};`
  }
  return css
}

/**
 * Advanced PDF Export using jsPDF (optional - requires installation)
 *
 * Installation: npm install jspdf html2canvas
 *
 * Usage:
 * import { exportToPDFAdvanced } from '~/utils/pdfExport'
 * exportToPDFAdvanced('invoice-template', 'invoice-001.pdf')
 */

export const exportToPDFAdvanced = async (elementId: string, filename: string) => {
  try {
    // This would require jsPDF and html2canvas libraries
    // For now, fall back to print
    exportToPDF(elementId, filename)
  } catch (error) {
    console.error('Failed to export PDF:', error)
  }
}
