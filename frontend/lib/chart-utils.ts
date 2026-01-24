export const downloadChart = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with ID "${elementId}" not found`)
    return
  }

  try {
    const { default: html2canvas } = await import('html2canvas')
    
    // Create a canvas with better quality
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
    
    // Convert to image and download
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.png`
    
    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading chart:', error)
    // Fallback: try to create a simple CSV export if available
    const tableData = extractTableData(element)
    if (tableData) {
      downloadCSV(tableData, fileName)
    }
  }
}

// Helper function to extract table data
const extractTableData = (element: HTMLElement): string[][] | null => {
  const table = element.querySelector('table')
  if (!table) return null
  
  const rows: string[][] = []
  table.querySelectorAll('tr').forEach(row => {
    const cols: string[] = []
    row.querySelectorAll('td, th').forEach(cell => {
      cols.push(cell.textContent || '')
    })
    if (cols.length > 0) rows.push(cols)
  })
  
  return rows.length > 0 ? rows : null
}

// Helper function to download CSV
const downloadCSV = (data: string[][], fileName: string) => {
  const csv = data.map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export const toggleFullscreen = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (!element) return

  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

export const formatTime = (hours: number): string => {
  if (!hours || hours <= 0) return 'N/A'
  const days = Math.floor(hours / 24)
  const remainingHours = Math.floor(hours % 24)
  if (days > 0) {
    return `${days}d ${remainingHours}h`
  }
  return `${remainingHours}h`
}

export const formatDistance = (km: number): string => {
  if (!km) return 'N/A'
  if (km > 1000) {
    return `${(km / 1000).toFixed(1)}K km`
  }
  return `${km.toFixed(0)} km`
}

export const formatCost = (cost: number): string => {
  if (!cost) return '$0'
  if (cost >= 1000000) {
    return `$${(cost / 1000000).toFixed(1)}M`
  }
  if (cost >= 1000) {
    return `$${(cost / 1000).toFixed(1)}K`
  }
  return `$${cost.toFixed(0)}`
}
