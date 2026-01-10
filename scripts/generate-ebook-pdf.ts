import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const inputFile = path.join(process.cwd(), 'attached_assets', 'Pasted-Through-The-Veil-TABLE-OF-CONTENTS-Author-s-Note-Dedica_1768076903602.txt');
const outputFile = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-Ebook.pdf');

const content = fs.readFileSync(inputFile, 'utf-8');

const doc = new PDFDocument({
  size: [360, 576],
  margins: { top: 40, bottom: 50, left: 36, right: 36 },
  info: {
    Title: 'Through The Veil',
    Author: 'Anonymous'
  }
});

const writeStream = fs.createWriteStream(outputFile);
doc.pipe(writeStream);

const HEADINGS = [
  'TABLE OF CONTENTS',
  "AUTHOR'S NOTE",
  'DEDICATION',
  'FOREWORD',
  'INTRODUCTION: THE AWAKENING',
  'INTERLUDE I',
  'INTERLUDE II',
  'CHAPTER 1',
  'CHAPTER 2',
  'CHAPTER 3',
  'CHAPTER 4',
  'CHAPTER 5',
  'CHAPTER 6',
  'CHAPTER 7',
  'CHAPTER 8',
  'CHAPTER 9',
  'CHAPTER 10',
  'CHAPTER 11',
  'CHAPTER 12',
  'CHAPTER 13',
  'APPENDIX',
  'MESSAGE TO THE READER',
  'ACKNOWLEDGMENTS',
  'AUTHOR BIO'
];

function isHeading(line: string): boolean {
  const upper = line.trim().toUpperCase();
  for (const h of HEADINGS) {
    if (upper.startsWith(h)) return true;
  }
  return false;
}

doc.moveDown(8);
doc.fontSize(26).font('Helvetica-Bold').text('Through The Veil', { align: 'center' });
doc.moveDown(1.5);
doc.fontSize(12).font('Helvetica-Oblique').text('A Journey Beyond the Illusion', { align: 'center' });
doc.addPage();

const paragraphs = content.split('\n\n');
let isFirst = true;
let skipNext = false;

for (const para of paragraphs) {
  const trimmed = para.trim();
  
  if (!trimmed) continue;
  if (trimmed === 'Through The Veil') continue;
  
  const firstLine = trimmed.split('\n')[0].trim();
  
  if (isHeading(firstLine)) {
    if (!isFirst) {
      doc.addPage();
    }
    isFirst = false;
    
    doc.moveDown(3);
    
    if (firstLine.includes('—')) {
      const [prefix, title] = firstLine.split('—').map(s => s.trim());
      doc.fontSize(11).font('Helvetica').text(prefix, { align: 'center' });
      doc.moveDown(0.4);
      doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
    } else if (firstLine.includes(':') && !firstLine.startsWith('INTRODUCTION')) {
      const [prefix, title] = firstLine.split(':').map(s => s.trim());
      doc.fontSize(11).font('Helvetica').text(prefix, { align: 'center' });
      doc.moveDown(0.4);
      doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
    } else {
      doc.fontSize(18).font('Helvetica-Bold').text(firstLine, { align: 'center' });
    }
    
    doc.moveDown(2);
    
    const remainingLines = trimmed.split('\n').slice(1).join('\n').trim();
    if (remainingLines) {
      doc.fontSize(10).font('Helvetica').text(remainingLines, { 
        align: 'left',
        lineGap: 3
      });
    }
    continue;
  }
  
  const lines = trimmed.split('\n');
  for (const line of lines) {
    const l = line.trim();
    if (!l) {
      doc.moveDown(0.3);
      continue;
    }
    doc.fontSize(10).font('Helvetica').text(l, { 
      align: 'left',
      lineGap: 3
    });
  }
  doc.moveDown(0.5);
}

doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(outputFile);
  console.log(`PDF created: ${outputFile}`);
  console.log(`Size: ${(stats.size / 1024).toFixed(0)} KB`);
});
