import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const inputFile = path.join(process.cwd(), 'attached_assets', 'Pasted-Through-The-Veil-TABLE-OF-CONTENTS-Author-s-Note-Dedica_1768076903602.txt');
const outputFile = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-Ebook.pdf');

const content = fs.readFileSync(inputFile, 'utf-8');

const doc = new PDFDocument({
  size: [360, 576],
  margins: { top: 40, bottom: 40, left: 36, right: 36 },
  info: {
    Title: 'Through The Veil',
    Author: 'Anonymous',
    Subject: 'Spiritual Awakening'
  }
});

const writeStream = fs.createWriteStream(outputFile);
doc.pipe(writeStream);

doc.moveDown(6);
doc.fontSize(24).font('Helvetica-Bold').text('Through The Veil', { align: 'center' });
doc.moveDown(1);
doc.fontSize(11).font('Helvetica-Oblique').text('A Journey Beyond the Illusion', { align: 'center' });
doc.addPage();

const lines = content.split('\n');
let inTOC = false;
let firstSection = true;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line === 'Through The Veil' && i < 3) continue;
  
  if (line === '') {
    doc.moveDown(0.4);
    continue;
  }
  
  if (line === 'TABLE OF CONTENTS') {
    inTOC = true;
    doc.fontSize(14).font('Helvetica-Bold').text('TABLE OF CONTENTS', { align: 'center' });
    doc.moveDown(1);
    continue;
  }
  
  if (inTOC) {
    if (/^(AUTHOR'S NOTE|DEDICATION|FOREWORD|INTRODUCTION)/i.test(line)) {
      inTOC = false;
      doc.addPage();
    } else {
      doc.fontSize(9).font('Helvetica').text(line, { align: 'left' });
      doc.moveDown(0.2);
      continue;
    }
  }
  
  const isHeading = /^(AUTHOR'S NOTE|DEDICATION|FOREWORD|INTRODUCTION|CHAPTER \d+|INTERLUDE [IV]+|APPENDIX|MESSAGE TO THE READER|ACKNOWLEDGMENTS|AUTHOR BIO)/i.test(line);
  
  if (isHeading) {
    if (!firstSection) {
      doc.addPage();
    }
    firstSection = false;
    
    doc.moveDown(2);
    
    if (line.includes('—')) {
      const parts = line.split('—');
      doc.fontSize(10).font('Helvetica').text(parts[0].trim(), { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(16).font('Helvetica-Bold').text(parts[1].trim(), { align: 'center' });
    } else if (line.includes(':')) {
      const parts = line.split(':');
      doc.fontSize(10).font('Helvetica').text(parts[0].trim(), { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(16).font('Helvetica-Bold').text(parts[1].trim(), { align: 'center' });
    } else {
      doc.fontSize(16).font('Helvetica-Bold').text(line, { align: 'center' });
    }
    
    doc.moveDown(1.5);
    continue;
  }
  
  doc.fontSize(10).font('Helvetica').text(line, { align: 'left', lineGap: 2 });
}

doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(outputFile);
  console.log(`Done: ${outputFile} (${(stats.size / 1024).toFixed(0)} KB)`);
});
