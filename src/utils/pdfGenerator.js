import { jsPDF } from 'jspdf';

export const generateCaseFile = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(220, 53, 69); // Red for urgency
  doc.text('CYBER CRIME REPORT', margin, 30);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Case ID: ${data.id}`, margin, 40);
  doc.text(`Generated: ${new Date(data.timestamp).toLocaleString()}`, margin, 45);
  doc.text(`Status: PENDING INVESTIGATION`, margin, 50);

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, 55, pageWidth - margin, 55);

  // Initialize yPos at the start
  let yPos = 70;

  // Helper to check page break
  const checkPageBreak = (heightToAdd) => {
    if (yPos + heightToAdd > 280) {
      doc.addPage();
      yPos = 30; // Reset to top margin
      return true;
    }
    return false;
  };

  // Incident Details
  checkPageBreak(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138); // Dark Blue for Section Headers
  doc.text('Incident Details', margin, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(50); // Dark Gray for body
  
  doc.text(`Offender Username:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.offender}`, margin + 45, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.text(`Platform:`, margin, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.platform}`, margin + 45, yPos);
  yPos += 8;

  if (data.offenderPhone) {
    doc.setFont('helvetica', 'normal');
    doc.text(`Offender Phone:`, margin, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.countryCode} ${data.offenderPhone}`, margin + 45, yPos);
    yPos += 8;
  }
  
  yPos += 5; // Extra spacing

  // Statement
  if (data.statement) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text('Victim Statement:', margin, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50);
    
    const splitText = doc.splitTextToSize(data.statement, pageWidth - (margin * 2));
    const textHeight = splitText.length * 5; // Approx height per line
    checkPageBreak(textHeight);
    
    doc.text(splitText, margin, yPos);
    yPos += textHeight + 10;
  }

  // AI Forensics Analysis Section
  if (data.scanResults && data.scanResults.length > 0) {
    // Estimate height of the whole section to see if it fits, else page break
    const estimatedHeight = 20 + (data.scanResults.length * 15);
    checkPageBreak(estimatedHeight);

    // Section Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('AI Forensics Analysis', margin, yPos);
    yPos += 8;

    // Analysis Box Background
    doc.setDrawColor(200);
    doc.setFillColor(248, 250, 252);
    const boxHeight = data.scanResults.length * 15 + 10;
    
    // Check if box fits, if not, we might need a sophisticated split or just push to new page
    if (yPos + boxHeight > 280) {
        doc.addPage();
        yPos = 30;
    }
    
    doc.rect(margin, yPos, pageWidth - (margin * 2), boxHeight, 'F');
    yPos += 10; // Padding inside box

    doc.setFontSize(10);
    data.scanResults.forEach((res) => {
      const resultText = res.error 
        ? `Error: ${res.error}` 
        : `${res.label.toUpperCase()} (${res.confidence.toFixed(1)}%)`;
      
      const color = res.isFake ? [220, 53, 69] : (res.error ? [100, 100, 100] : [25, 135, 84]);

      // 1. File Name (Truncated)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50);
      doc.text(`File:`, margin + 5, yPos);
      
      doc.setFont('helvetica', 'normal');
      let fileName = res.fileName;
      if (fileName.length > 25) fileName = fileName.substring(0, 22) + '...';
      doc.text(`${fileName}`, margin + 20, yPos);
      
      // 2. Category (Centered-ish)
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100);
      doc.text(`[${res.category}]`, margin + 85, yPos);
      
      // 3. Result (Right Aligned)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...color);
      doc.text(resultText, pageWidth - margin - 5, yPos, { align: 'right' });
      
      yPos += 12; // Spacing
    });
    yPos += 10; 
  }
  
  // Evidence Images Handler
  const addEvidenceToDoc = (files, label) => {
    if (!files || files.length === 0) return;
    
    checkPageBreak(40);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text(label, margin, yPos);
    yPos += 12;
    
    files.forEach((file, index) => {
      // Fallback if type is missing but url exists
      const isImage = file.type?.startsWith('image/') || file.url?.startsWith('data:image/');

      if (isImage) {
        try {
          let imgData = file.url;
          if (!imgData) throw new Error("Image data is empty");

          if (!imgData.startsWith('data:image/')) {
             throw new Error("Invalid image format");
          }

          const format = imgData.match(/^data:image\/(\w+);base64,/)?.[1]?.toUpperCase() || 'JPEG';
          const validFormat = ['PNG', 'JPEG', 'JPG', 'WEBP'].includes(format) ? format : 'JPEG';
  
          let imgProps;
          try {
             imgProps = doc.getImageProperties(imgData);
          } catch (propError) {
             console.error("Failed to get image properties:", propError);
             throw new Error("Corrupt image data");
          }

          const pdfWidth = 90; 
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          let finalHeight = pdfHeight;
          let finalWidth = pdfWidth;
          if (finalHeight > 200) {
             finalHeight = 200;
             finalWidth = (imgProps.width * finalHeight) / imgProps.height;
          }

          checkPageBreak(finalHeight + 20);

          doc.addImage(imgData, validFormat, margin, yPos, finalWidth, finalHeight); 
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text(`Image ${index + 1}: ${file.name}`, margin, yPos + finalHeight + 5);
          
          yPos += finalHeight + 15; 
        } catch (e) {
          console.error("PDF Image Error:", e);
          checkPageBreak(20);
          doc.setTextColor(220, 53, 69);
          doc.setFont('helvetica', 'bold');
          doc.text(`[Image Failed to Load: ${file.name} - ${e.message}]`, margin, yPos);
          yPos += 15;
        }
      } else if (file.type?.startsWith('video/')) {
        checkPageBreak(30);
        doc.setDrawColor(200);
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, 90, 20, 'FD');
        
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(`[VIDEO EVIDENCE ATTACHED]`, margin + 5, yPos + 8);
        
        doc.setTextColor(100);
        doc.setFontSize(9);
        doc.text(`Filename: ${file.name}`, margin + 5, yPos + 14);
        
        yPos += 30;
      }
    });
    yPos += 10;
  };

  addEvidenceToDoc(data.screenshotImage, 'Evidence 1: Offender Message/Post');
  addEvidenceToDoc(data.originalImage, 'Evidence 2: Original Content');
  addEvidenceToDoc(data.deepfakeImage, 'Evidence 3: Deepfake Content');

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} - Generated by Deepfake Guardian`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  doc.save(`Case_${data.id}_Report.pdf`);
};

export const generateLegalNoticePDF = (data) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(16);
  doc.text('LEGAL NOTICE / CEASE AND DESIST', margin, 20);
  
  doc.setFontSize(12);
  doc.text(`To: ${data.offender}`, margin, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, 50);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Subject: Immediate Demand to Cease and Desist Deepfake Distribution', margin, 70);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  const bodyText = `
This notice serves as a formal warning regarding the unauthorized creation and distribution of manipulated content (deepfakes) featuring my likeness on ${data.platform}.

Your actions constitute a violation of my privacy and personality rights, and may violate cybercrime laws applicable in your jurisdiction.

DEMAND:
1. Immediately remove the offending content from all platforms.
2. Cease any further distribution.
3. Confirm in writing that you have complied with these demands within 24 hours.

Failure to comply will result in immediate legal action, including but not limited to filing a First Information Report (FIR) with the Cyber Crime Cell.
  `;
  
  const splitBody = doc.splitTextToSize(bodyText.trim(), pageWidth - (margin * 2));
  doc.text(splitBody, margin, 90);
  
  doc.text('Sincerely,', margin, 200);
  doc.text('Victim / Legal Representative', margin, 210);

  doc.save(`Legal_Notice_${data.id}.pdf`);
};
