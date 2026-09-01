import PDFDocument from 'pdfkit';
import { Response } from 'express';

export interface IPDFInvoiceData {
  title: string; // e.g. 'CLEANIX SUBSCRIPTION INVOICE' or 'CLEANIX SERVICE INVOICE'
  invoiceNumber: string; // e.g. '#SUB-2026-9012' or '#CLN-2026-5038'
  date: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress: string;
  items: { description: string; qty: number; unitPrice: number; total: number }[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  trxId?: string;
  notes?: string;
}

export const generatePDFInvoiceStream = (res: Response, invoiceData: IPDFInvoiceData) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Set HTTP headers for file download
  const sanitizedRef = (invoiceData.invoiceNumber || 'INVOICE').replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `Cleanix-Invoice-${sanitizedRef}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  // Colors
  const primaryColor = '#007eff';
  const darkTextColor = '#0f172a';
  const grayTextColor = '#64748b';
  const lightBgColor = '#f8fafc';
  const borderColor = '#e2e8f0';

  // --- BRAND HEADER ---
  doc
    .fillColor(primaryColor)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('CLEANIX', 40, 40);

  doc
    .fillColor(grayTextColor)
    .fontSize(9)
    .font('Helvetica')
    .text('Professional Home & Commercial Care', 40, 68)
    .text('Hotline: +880 1700-000000 | Email: support@cleanix.com', 40, 80)
    .text('Dhaka, Bangladesh | Web: https://cleanix-nine.vercel.app/', 40, 92);

  // Badge / Invoice Title (Right Aligned with Dynamic Y Positioning)
  const rightBoxX = 250;
  const rightBoxWidth = 305;

  const formattedTitle = invoiceData.title.toUpperCase();
  doc
    .fillColor(primaryColor)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(formattedTitle, rightBoxX, 40, { width: rightBoxWidth, align: 'right' });

  const titleHeight = doc.heightOfString(formattedTitle, { width: rightBoxWidth });
  let rightY = Math.max(58, 40 + titleHeight + 4);

  doc
    .fillColor(darkTextColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(`REF: ${invoiceData.invoiceNumber}`, rightBoxX, rightY, { width: rightBoxWidth, align: 'right' });

  rightY += 15;

  doc
    .fillColor(grayTextColor)
    .fontSize(8.5)
    .font('Helvetica')
    .text(`Issue Date: ${invoiceData.date}`, rightBoxX, rightY, { width: rightBoxWidth, align: 'right' });

  rightY += 12;

  doc
    .fillColor(grayTextColor)
    .fontSize(8.5)
    .font('Helvetica')
    .text(`Status: ${invoiceData.paymentStatus.toUpperCase()} (${invoiceData.paymentMethod})`, rightBoxX, rightY, { width: rightBoxWidth, align: 'right' });

  // Divider Line
  doc
    .strokeColor(borderColor)
    .lineWidth(1)
    .moveTo(40, 115)
    .lineTo(555, 115)
    .stroke();

  // --- BILLED TO SECTION ---
  doc
    .fillColor(primaryColor)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('BILLED TO (CUSTOMER DETAILS):', 40, 130);

  doc
    .fillColor(darkTextColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text(invoiceData.customerName || 'Valued Client', 40, 146);

  let currentY = 160;
  if (invoiceData.customerPhone) {
    doc.fillColor(grayTextColor).fontSize(9).font('Helvetica').text(`Phone: ${invoiceData.customerPhone}`, 40, currentY);
    currentY += 13;
  }
  if (invoiceData.customerEmail) {
    doc.fillColor(grayTextColor).fontSize(9).font('Helvetica').text(`Email: ${invoiceData.customerEmail}`, 40, currentY);
    currentY += 13;
  }
  doc.fillColor(grayTextColor).fontSize(9).font('Helvetica').text(`Service Location: ${invoiceData.customerAddress || 'Dhaka'}`, 40, currentY);

  currentY += 25;

  // --- TABLE HEADER ---
  doc
    .rect(40, currentY, 515, 24)
    .fill(lightBgColor)
    .stroke(borderColor);

  doc
    .fillColor(darkTextColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('SERVICE DESCRIPTION', 50, currentY + 7)
    .text('QTY', 360, currentY + 7, { width: 40, align: 'center' })
    .text('UNIT PRICE', 410, currentY + 7, { width: 60, align: 'right' })
    .text('TOTAL (BDT)', 480, currentY + 7, { width: 65, align: 'right' });

  currentY += 24;

  // --- TABLE ROWS ---
  doc.font('Helvetica').fontSize(9);

  invoiceData.items.forEach((item, index) => {
    const rowY = currentY + index * 24;

    // Row zebra background
    if (index % 2 === 1) {
      doc.rect(40, rowY, 515, 24).fill('#f1f5f9');
    }

    doc
      .fillColor(darkTextColor)
      .text(item.description, 50, rowY + 7, { width: 300, lineBreak: false })
      .text(String(item.qty), 360, rowY + 7, { width: 40, align: 'center' })
      .text(`TK ${item.unitPrice.toLocaleString()}`, 410, rowY + 7, { width: 60, align: 'right' })
      .text(`TK ${item.total.toLocaleString()}`, 480, rowY + 7, { width: 65, align: 'right' });

    doc
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .moveTo(40, rowY + 24)
      .lineTo(555, rowY + 24)
      .stroke();
  });

  currentY += invoiceData.items.length * 24 + 15;

  // --- TOTALS LEDGER BOX ---
  const summaryX = 350;
  const summaryWidth = 205;

  doc
    .fillColor(grayTextColor)
    .font('Helvetica')
    .text('Subtotal:', summaryX, currentY)
    .fillColor(darkTextColor)
    .font('Helvetica-Bold')
    .text(`TK ${invoiceData.subtotal.toLocaleString()}`, summaryX + 80, currentY, { width: 120, align: 'right' });

  currentY += 16;

  if (invoiceData.discount > 0) {
    doc
      .fillColor(grayTextColor)
      .font('Helvetica')
      .text('Discount:', summaryX, currentY)
      .fillColor('#e11d48')
      .font('Helvetica-Bold')
      .text(`- TK ${invoiceData.discount.toLocaleString()}`, summaryX + 80, currentY, { width: 120, align: 'right' });

    currentY += 16;
  }

  doc
    .strokeColor(primaryColor)
    .lineWidth(1)
    .moveTo(summaryX, currentY)
    .lineTo(555, currentY)
    .stroke();

  currentY += 8;

  doc
    .fillColor(primaryColor)
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('TOTAL BILLED:', summaryX, currentY)
    .text(`TK ${invoiceData.totalAmount.toLocaleString()} BDT`, summaryX + 80, currentY, { width: 120, align: 'right' });

  currentY += 35;

  // --- PAYMENT DETAILS BOX ---
  doc
    .rect(40, currentY, 260, 65)
    .fill(lightBgColor)
    .stroke(borderColor);

  doc
    .fillColor(primaryColor)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('PAYMENT RECORD', 50, currentY + 10);

  doc
    .fillColor(grayTextColor)
    .fontSize(8.5)
    .font('Helvetica')
    .text(`Method: ${invoiceData.paymentMethod}`, 50, currentY + 24)
    .text(`Status: ${invoiceData.paymentStatus}`, 50, currentY + 36)
    .text(`Trx ID: ${invoiceData.trxId || 'N/A'}`, 50, currentY + 48);

  // --- FOOTER NOTE ---
  doc
    .fillColor(grayTextColor)
    .fontSize(8)
    .font('Helvetica')
    .text('Thank you for choosing Cleanix!', 40, 750, { align: 'center', width: 515 })
    .text('This is an official computer-generated PDF receipt. For queries, contact support@cleanix.com', 40, 762, { align: 'center', width: 515 });

  // End Document Stream
  doc.end();
};
