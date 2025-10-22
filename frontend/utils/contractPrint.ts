import { contractPrintStyles } from './contractPrintStyles'

export interface PrintContractOptions {
  title?: string
  selector?: string
}

export const printContract = (options: PrintContractOptions = {}) => {
  const { title = 'Contract', selector = '.print-contract-content' } = options

  // Try multiple selectors
  let contractContent = document.querySelector(selector)
  if (!contractContent && selector === '.print-contract-content') {
    contractContent = document.querySelector('.preview-paper')
  }

  if (!contractContent) {
    console.error('Contract content not found')
    return
  }

  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    console.error('Failed to open print window')
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>${contractPrintStyles}</style>
      </head>
      <body>${contractContent.innerHTML}</body>
    </html>
  `)

  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }
}
