import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const CSV_MIME = 'text/csv;charset=utf-8;';

export function exportToCSV(data, filename, headers = null) {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const cols = headers || Object.keys(data[0]);
  const csvContent = [
    cols.join(','),
    ...data.map(row =>
      cols.map(col => {
        const value = row[col];
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: CSV_MIME });
  downloadBlob(blob, `${filename}_${formatDate()}.csv`);
}

export function exportToExcel(data, filename, sheetName = 'Data') {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const xml = generateExcelXML(data, sheetName);
  const blob = new Blob([xml], { type: EXCEL_MIME });
  downloadBlob(blob, `${filename}_${formatDate()}.xlsx`);
}

function generateExcelXML(data, sheetName) {
  const cols = Object.keys(data[0]);
  const escapeXml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const rows = data.map(row =>
    `<tr>${cols.map(col => `<td>${escapeXml(row[col])}</td>`).join('')}</tr>`
  ).join('');

  const headerRow = `<tr>${cols.map(col => `<th>${escapeXml(col)}</th>`).join('')}</tr>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="${sheetName}">
    <Table>
      ${headerRow}
      ${rows}
    </Table>
  </Worksheet>
</Workbook>`;
}

export function generatePDFReport(data, options = {}) {
  const {
    title = 'Report',
    subtitle = '',
    columns = [],
    footer = 'JB Dental Clinic',
    orientation = 'portrait',
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);

  if (subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 14, 28);
  }

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, subtitle ? 35 : 28);

  // Table
  const headers = columns.map(col => col.header || col.key);
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col.key];
      if (col.format === 'currency') {
        return value ? `${Number(value).toLocaleString()} UGX` : '';
      }
      if (col.format === 'date') {
        return value ? new Date(value).toLocaleDateString() : '';
      }
      return value || '';
    })
  );

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: subtitle ? 40 : 32,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: {
      fillColor: [127, 216, 86],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${footer} - Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${formatDate()}.pdf`);
}

export function generateChartPDF(data, options = {}) {
  const {
    title = 'Analytics Report',
    charts = [],
    summary = {},
  } = options;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 20);

  // Summary Stats
  let yPos = 30;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  Object.entries(summary).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 14, yPos);
    yPos += 6;
  });

  // Chart descriptions
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text('Data Summary', 14, yPos);

  yPos += 10;
  charts.forEach((chart, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${chart.title}`, 14, yPos);
    yPos += 6;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(chart.description || '', 20, yPos);
    yPos += 10;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `JB Dental Clinic - Generated ${new Date().toLocaleString()}`,
    14,
    doc.internal.pageSize.height - 10
  );

  doc.save(`${title.replace(/\s+/g, '_')}_${formatDate()}.pdf`);
}

export function printElement(elementId, title = 'Print') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #7FD856; color: black; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #333; }
        .header p { margin: 5px 0; color: #666; font-size: 12px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>JB Dental Clinic</h1>
        <p>${title}</p>
        <p>${new Date().toLocaleString()}</p>
      </div>
      ${element.innerHTML}
      <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function formatDate() {
  return new Date().toISOString().slice(0, 10);
}

export default {
  exportToCSV,
  exportToExcel,
  generatePDFReport,
  generateChartPDF,
  printElement,
};
