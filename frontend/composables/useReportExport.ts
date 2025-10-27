import type { Ref } from 'vue'

interface ExportData {
  filters: Ref<any>
  totalRevenue: Ref<number>
  totalRentals: Ref<number>
  avgUtilization: Ref<number>
  totalMaintenanceCost: Ref<number>
  rentalStatusBreakdown: Ref<any[]>
  paymentStatusOverview: Ref<any[]>
  vehicleUtilization: Ref<any[]>
  topCustomers: Ref<any[]>
  locationPerformance: Ref<any[]>
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}

export const useReportExport = (data: ExportData) => {
  const {
    filters,
    totalRevenue,
    totalRentals,
    avgUtilization,
    totalMaintenanceCost,
    rentalStatusBreakdown,
    paymentStatusOverview,
    vehicleUtilization,
    topCustomers,
    locationPerformance,
    formatCurrency,
    formatDate,
  } = data

  const exportToCSV = async () => {
    const csvData: string[][] = [
      ['Vehicle Rental Management System - Reports'],
      ['Period', `${filters.value.startDate} to ${filters.value.endDate}`],
      [''],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total Revenue', formatCurrency(totalRevenue.value)],
      ['Total Rentals', totalRentals.value.toString()],
      ['Average Utilization', `${avgUtilization.value}%`],
      ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
      [''],
      ['Rental Status Breakdown'],
      ['Status', 'Count', 'Percentage'],
      ...rentalStatusBreakdown.value.map(r => [r.status, r.count.toString(), `${r.percentage}%`]),
      [''],
      ['Payment Status Overview'],
      ['Status', 'Count', 'Percentage'],
      ...paymentStatusOverview.value.map(p => [p.status, p.count.toString(), `${p.percentage}%`]),
      [''],
      ['Vehicle Utilization'],
      ['Vehicle', 'Total Days', 'Rented Days', 'Utilization Rate', 'Revenue'],
      ...vehicleUtilization.value.map(v => [
        v.vehicleName,
        v.totalDays.toString(),
        v.rentedDays.toString(),
        `${v.utilizationRate}%`,
        formatCurrency(v.revenue),
      ]),
      [''],
      ['Top Customers'],
      ['Customer', 'Total Rentals', 'Total Spent', 'Avg Rental Value', 'Last Rental'],
      ...topCustomers.value.map(c => [
        c.customerName,
        c.totalRentals.toString(),
        formatCurrency(c.totalSpent),
        formatCurrency(c.avgRentalValue),
        formatDate(c.lastRentalDate),
      ]),
      [''],
      ['Location Performance'],
      ['Location', 'Rentals', 'Revenue/Remain', 'Utilization Rate'],
      ...locationPerformance.value.map(l => [
        l.location,
        l.rentals.toString(),
        l.revenue ? formatCurrency(l.revenue) : l.remain?.toString() || '0',
        `${l.utilization}%`,
      ]),
    ]

    const csvContent = csvData
      .map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rental-report-${filters.value.startDate}-${filters.value.endDate}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToExcel = async () => {
    const XLSX = await import('xlsx/dist/xlsx.mini.min.js')
    const wb = XLSX.utils.book_new()

    // Summary Statistics sheet
    const summaryData = [
      ['Vehicle Rental Management System - Reports'],
      ['Period', `${filters.value.startDate} to ${filters.value.endDate}`],
      [],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total Revenue', formatCurrency(totalRevenue.value)],
      ['Total Rentals', totalRentals.value],
      ['Average Utilization', `${avgUtilization.value}%`],
      ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Summary')

    // Rental Status sheet
    const rentalStatusData = [
      ['Rental Status Breakdown'],
      ['Status', 'Count', 'Percentage'],
      ...rentalStatusBreakdown.value.map(r => [r.status, r.count, `${r.percentage}%`]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rentalStatusData), 'Rental Status')

    // Payment Status sheet
    const paymentStatusData = [
      ['Payment Status Overview'],
      ['Status', 'Count', 'Percentage'],
      ...paymentStatusOverview.value.map(p => [p.status, p.count, `${p.percentage}%`]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(paymentStatusData), 'Payment Status')

    // Vehicle Utilization sheet
    const vehicleData = [
      ['Vehicle Utilization'],
      ['Vehicle', 'Total Days', 'Rented Days', 'Utilization Rate', 'Revenue'],
      ...vehicleUtilization.value.map(v => [
        v.vehicleName,
        v.totalDays,
        v.rentedDays,
        `${v.utilizationRate}%`,
        v.revenue,
      ]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(vehicleData), 'Vehicle Utilization')

    // Top Customers sheet
    const customersData = [
      ['Top Customers'],
      ['Customer', 'Total Rentals', 'Total Spent', 'Avg Rental Value', 'Last Rental'],
      ...topCustomers.value.map(c => [
        c.customerName,
        c.totalRentals,
        c.totalSpent,
        c.avgRentalValue,
        formatDate(c.lastRentalDate),
      ]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(customersData), 'Top Customers')

    // Location Performance sheet
    const locationData = [
      ['Location Performance'],
      ['Location', 'Rentals', 'Revenue/Remain', 'Utilization Rate'],
      ...locationPerformance.value.map(l => [
        l.location,
        l.rentals,
        l.revenue || l.remain || 0,
        `${l.utilization}%`,
      ]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(locationData), 'Location Performance')

    XLSX.writeFile(wb, `rental-report-${filters.value.startDate}-${filters.value.endDate}.xlsx`)
  }

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Vehicle Rental Management System', 14, 20)
    doc.setFontSize(14)
    doc.text('Analytics Report', 14, 28)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Period: ${filters.value.startDate} to ${filters.value.endDate}`, 14, 36)

    let yPos = 45

    // Summary Statistics
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary Statistics', 14, yPos)
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', formatCurrency(totalRevenue.value)],
        ['Total Rentals', totalRentals.value.toString()],
        ['Average Utilization', `${avgUtilization.value}%`],
        ['Total Maintenance Cost', formatCurrency(totalMaintenanceCost.value)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Rental Status Breakdown
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Rental Status Breakdown', 14, yPos)
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Status', 'Count', 'Percentage']],
      body: rentalStatusBreakdown.value.map(r => [r.status, r.count.toString(), `${r.percentage}%`]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Payment Status Overview
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Status Overview', 14, yPos)
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Status', 'Count', 'Percentage']],
      body: paymentStatusOverview.value.map(p => [p.status, p.count.toString(), `${p.percentage}%`]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    })

    // Vehicle Utilization (new page)
    doc.addPage()
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Vehicle Utilization', 14, 20)
    autoTable(doc, {
      startY: 25,
      head: [['Vehicle', 'Total Days', 'Rented Days', 'Utilization', 'Revenue']],
      body: vehicleUtilization.value.map(v => [
        v.vehicleName,
        v.totalDays.toString(),
        v.rentedDays.toString(),
        `${v.utilizationRate}%`,
        formatCurrency(v.revenue),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    })

    // Top Customers (new page)
    doc.addPage()
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Top Customers', 14, 20)
    autoTable(doc, {
      startY: 25,
      head: [['Customer', 'Total Rentals', 'Total Spent', 'Avg Value', 'Last Rental']],
      body: topCustomers.value.map(c => [
        c.customerName,
        c.totalRentals.toString(),
        formatCurrency(c.totalSpent),
        formatCurrency(c.avgRentalValue),
        formatDate(c.lastRentalDate),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Location Performance
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Location Performance', 14, yPos)
    autoTable(doc, {
      startY: yPos + 5,
      head: [['Location', 'Rentals', 'Revenue/Remain', 'Utilization']],
      body: locationPerformance.value.map(l => [
        l.location,
        l.rentals.toString(),
        l.revenue ? formatCurrency(l.revenue) : l.remain?.toString() || '0',
        `${l.utilization}%`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    })

    doc.save(`rental-report-${filters.value.startDate}-${filters.value.endDate}.pdf`)
  }

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF,
  }
}
