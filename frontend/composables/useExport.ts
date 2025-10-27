/**
 * Reusable export composable for CSV and PDF exports
 * Works with any entity type
 */

export type ExportFormat = 'csv' | 'pdf' | 'excel'

export interface ExportOptions {
  filename?: string
  columns?: Array<{
    key: string
    label: string
    format?: (value: any) => string
  }>
  title?: string
  orientation?: 'portrait' | 'landscape'
  includeTimestamp?: boolean
}

/**
 * Export data to CSV format
 */
export const useCSVExport = () => {
  const exportToCSV = (data: any[], options: ExportOptions = {}) => {
    if (!data || data.length === 0) {
      throw new Error('No data to export')
    }

    const {
      filename = 'export',
      columns,
      includeTimestamp = true,
    } = options

    // Determine columns from data or use provided columns
    const exportColumns = columns || Object.keys(data[0]).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))

    // Create CSV header
    const headers = exportColumns.map(col => col.label)
    const csvRows = [headers.join(',')]

    // Add data rows
    data.forEach(item => {
      const values = exportColumns.map(col => {
        let value = item[col.key]

        // Apply custom formatting if provided
        if (col.format && value !== undefined && value !== null) {
          value = col.format(value)
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          return ''
        }

        // Escape commas and quotes in strings
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }

        return stringValue
      })

      csvRows.push(values.join(','))
    })

    // Create CSV content
    const csvContent = csvRows.join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : ''
    const fullFilename = `${filename}${timestamp}.csv`

    link.href = URL.createObjectURL(blob)
    link.download = fullFilename
    link.click()

    // Cleanup
    URL.revokeObjectURL(link.href)

    return {
      success: true,
      filename: fullFilename,
      rowCount: data.length,
    }
  }

  return {
    exportToCSV,
  }
}

/**
 * Export data to PDF format
 * Note: Requires jsPDF library to be installed
 */
export const usePDFExport = () => {
  const exportToPDF = async (data: any[], options: ExportOptions = {}) => {
    if (!data || data.length === 0) {
      throw new Error('No data to export')
    }

    // Dynamic import of jsPDF to avoid loading it unless needed
    const { default: jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const {
      filename = 'export',
      columns,
      title = 'Export Report',
      orientation = 'landscape',
      includeTimestamp = true,
    } = options

    // Determine columns
    const exportColumns = columns || Object.keys(data[0]).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }))

    // Create PDF document
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    })

    // Add title
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text(title, 14, 15)

    // Add timestamp
    if (includeTimestamp) {
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const timestamp = new Date().toLocaleString()
      doc.text(`Generated: ${timestamp}`, 14, 22)
    }

    // Prepare table data
    const headers = exportColumns.map(col => col.label)
    const body = data.map(item =>
      exportColumns.map(col => {
        let value = item[col.key]

        // Apply custom formatting if provided
        if (col.format && value !== undefined && value !== null) {
          value = col.format(value)
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          return '-'
        }

        return String(value)
      }),
    )

    // Add table using autoTable plugin
    autoTable(doc, {
      head: [headers],
      body,
      startY: includeTimestamp ? 28 : 22,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 28 },
    })

    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' },
      )
    }

    // Save PDF
    const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : ''
    const fullFilename = `${filename}${timestamp}.pdf`
    doc.save(fullFilename)

    return {
      success: true,
      filename: fullFilename,
      rowCount: data.length,
      pageCount,
    }
  }

  return {
    exportToPDF,
  }
}

/**
 * Generic export function that handles multiple formats
 */
export const useExport = () => {
  const { exportToCSV } = useCSVExport()
  const { exportToPDF } = usePDFExport()

  const exportData = async (
    data: any[],
    format: ExportFormat,
    options: ExportOptions = {},
  ) => {
    try {
      switch (format) {
        case 'csv':
          return exportToCSV(data, options)
        case 'pdf':
          return await exportToPDF(data, options)
        case 'excel':
          // Excel export would use a library like xlsx
          throw new Error('Excel export not yet implemented')
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      throw error
    }
  }

  return {
    exportData,
    exportToCSV,
    exportToPDF,
  }
}
