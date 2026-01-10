import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const inputFile = path.join(process.cwd(), 'attached_assets', 'Pasted-Through-The-Veil-TABLE-OF-CONTENTS-Author-s-Note-Dedica_1768076903602.txt');
const outputFile = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-Ebook.pdf');

const content = fs.readFileSync(inputFile, 'utf-8');

const doc = new PDFDocument({
  size: 'A5',
  margins: { top: 72, bottom: 72, left: 54, right: 54 },
  info: {
    Title: 'Through The Veil',
    Author: 'Anonymous',
    Subject: 'Spiritual Awakening',
    Keywords: 'awakening, truth, revelation, spiritual'
  }
});

const writeStream = fs.createWriteStream(outputFile);
doc.pipe(writeStream);

const titleFont = 'Helvetica-Bold';
const bodyFont = 'Helvetica';
const italicFont = 'Helvetica-Oblique';

function addTitlePage() {
  doc.fontSize(32)
     .font(titleFont)
     .text('Through The Veil', { align: 'center' });
  
  doc.moveDown(4);
  
  doc.fontSize(14)
     .font(italicFont)
     .text('A Journey Beyond the Illusion', { align: 'center' });
  
  doc.moveDown(10);
  
  doc.fontSize(10)
     .font(bodyFont)
     .text('2026', { align: 'center' });
  
  doc.addPage();
}

function isChapterHeading(line: string): boolean {
  return /^(CHAPTER \d+|INTERLUDE|APPENDIX|AUTHOR'S NOTE|DEDICATION|FOREWORD|INTRODUCTION|MESSAGE TO THE READER|ACKNOWLEDGMENTS|AUTHOR BIO|TABLE OF CONTENTS)/i.test(line.trim());
}

function isSectionBreak(line: string): boolean {
  return line.trim() === '' || line.trim() === '---' || line.trim() === '***';
}

function formatContent(text: string) {
  const lines = text.split('\n');
  let isFirstPage = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'Through The Veil' && i === 0) {
      continue;
    }
    
    if (line === '') {
      doc.moveDown(0.5);
      continue;
    }
    
    if (isChapterHeading(line)) {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;
      
      doc.moveDown(2);
      doc.fontSize(18)
         .font(titleFont)
         .text(line, { align: 'center' });
      doc.moveDown(2);
      continue;
    }
    
    if (line.startsWith('Chapter ') || line.startsWith('Interlude ') || line.startsWith('Appendix ')) {
      doc.fontSize(11)
         .font(bodyFont)
         .text(line, { align: 'center' });
      doc.moveDown(0.3);
      continue;
    }
    
    doc.fontSize(11)
       .font(bodyFont)
       .text(line, {
         align: 'justify',
         lineGap: 3,
         paragraphGap: 6
       });
  }
}

console.log('Generating PDF...');
addTitlePage();
formatContent(content);

doc.end();

writeStream.on('finish', () => {
  console.log(`PDF generated successfully: ${outputFile}`);
});

writeStream.on('error', (err) => {
  console.error('Error generating PDF:', err);
});
