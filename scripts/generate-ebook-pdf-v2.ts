import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const inputMd = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-EXPANDED.md');
const outputPdf = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-EBOOK.pdf');

const PAGE_WIDTH = 432;
const PAGE_HEIGHT = 648;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 54;
const MARGIN_LEFT = 48;
const MARGIN_RIGHT = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const FONT_BODY = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_ITALIC = 'Helvetica-Oblique';

const FONT_SIZE_TITLE = 22;
const FONT_SIZE_SUBTITLE = 13;
const FONT_SIZE_H1 = 16;
const FONT_SIZE_H2 = 13;
const FONT_SIZE_BODY = 10;
const FONT_SIZE_SMALL = 8;

const LINE_GAP = 2;
const PARAGRAPH_GAP = 6;

function sanitizeText(text: string): string {
  return text
    .replace(/—/g, ' - ')
    .replace(/–/g, '-')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/…/g, '...')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
}

function createTitlePage(doc: typeof PDFDocument.prototype) {
  doc.y = PAGE_HEIGHT / 3;
  
  doc.font(FONT_BOLD)
     .fontSize(FONT_SIZE_TITLE)
     .text('THROUGH THE VEIL', MARGIN_LEFT, doc.y, {
       width: CONTENT_WIDTH,
       align: 'center'
     });
  
  doc.moveDown(1.2);
  
  doc.font(FONT_ITALIC)
     .fontSize(FONT_SIZE_SUBTITLE)
     .text('A Testimony of the Great Substitution', {
       width: CONTENT_WIDTH,
       align: 'center'
     });
  
  doc.moveDown(0.8);
  
  doc.font(FONT_BODY)
     .fontSize(FONT_SIZE_SMALL)
     .text('The Complete Expanded Edition', {
       width: CONTENT_WIDTH,
       align: 'center'
     });
  
  doc.moveDown(6);
  
  doc.font(FONT_ITALIC)
     .fontSize(FONT_SIZE_SMALL)
     .text('"This is not doctrine. This is not theory. This is testimony."', {
       width: CONTENT_WIDTH,
       align: 'center'
     });
}

function parseMarkdown(content: string): { type: string; text: string }[] {
  const lines = content.split('\n');
  const elements: { type: string; text: string }[] = [];
  let currentParagraph = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '---') {
      if (currentParagraph) {
        elements.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      continue;
    }
    
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      if (currentParagraph) {
        elements.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      elements.push({ type: 'h1', text: line.replace(/^# /, '') });
      continue;
    }
    
    if (line.startsWith('## ')) {
      if (currentParagraph) {
        elements.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      elements.push({ type: 'h2', text: line.replace(/^## /, '') });
      continue;
    }
    
    if (line === '') {
      if (currentParagraph) {
        elements.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      continue;
    }
    
    if (line.startsWith('- ')) {
      if (currentParagraph) {
        elements.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      elements.push({ type: 'bullet', text: line.replace(/^- /, '') });
      continue;
    }
    
    currentParagraph += (currentParagraph ? ' ' : '') + line;
  }
  
  if (currentParagraph) {
    elements.push({ type: 'paragraph', text: currentParagraph.trim() });
  }
  
  return elements;
}

function renderElement(
  doc: typeof PDFDocument.prototype, 
  element: { type: string; text: string },
  isFirstContent: boolean
): boolean {
  const text = sanitizeText(element.text);
  
  switch (element.type) {
    case 'h1':
      if (text === 'THROUGH THE VEIL') return isFirstContent;
      if (text.includes('Table of Contents')) return isFirstContent;
      
      if (!isFirstContent && doc.y > MARGIN_TOP + 30) {
        doc.addPage();
      }
      
      doc.moveDown(1.5);
      
      doc.font(FONT_BOLD)
         .fontSize(FONT_SIZE_H1)
         .text(text, MARGIN_LEFT, doc.y, {
           width: CONTENT_WIDTH,
           align: 'center',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(1);
      return false;
      
    case 'h2':
      doc.moveDown(0.8);
      
      doc.font(FONT_BOLD)
         .fontSize(FONT_SIZE_H2)
         .text(text, MARGIN_LEFT, doc.y, {
           width: CONTENT_WIDTH,
           align: 'left',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(0.5);
      return isFirstContent;
      
    case 'paragraph':
      if (!text) return isFirstContent;
      
      doc.font(FONT_BODY)
         .fontSize(FONT_SIZE_BODY)
         .text(text, MARGIN_LEFT, doc.y, {
           width: CONTENT_WIDTH,
           align: 'justify',
           lineGap: LINE_GAP,
           paragraphGap: PARAGRAPH_GAP
         });
      
      doc.moveDown(0.4);
      return false;
      
    case 'bullet':
      doc.font(FONT_BODY)
         .fontSize(FONT_SIZE_BODY)
         .text('  *  ' + text, MARGIN_LEFT + 10, doc.y, {
           width: CONTENT_WIDTH - 10,
           align: 'left',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(0.2);
      return false;
  }
  
  return isFirstContent;
}

async function generatePDF() {
  console.log('Reading markdown...');
  const markdown = fs.readFileSync(inputMd, 'utf-8');
  
  console.log('Parsing content...');
  const elements = parseMarkdown(markdown);
  
  console.log('Creating PDF...');
  const doc = new PDFDocument({
    size: [PAGE_WIDTH, PAGE_HEIGHT],
    margins: {
      top: MARGIN_TOP,
      bottom: MARGIN_BOTTOM,
      left: MARGIN_LEFT,
      right: MARGIN_RIGHT
    },
    info: {
      Title: 'Through The Veil',
      Author: 'Anonymous',
      Subject: 'A Testimony of the Great Substitution',
      Keywords: 'testimony, spiritual, awakening'
    },
    bufferPages: true,
    autoFirstPage: true
  });
  
  const writeStream = fs.createWriteStream(outputPdf);
  doc.pipe(writeStream);
  
  createTitlePage(doc);
  
  doc.addPage();
  doc.y = MARGIN_TOP;
  
  let isFirstContent = true;
  
  for (const element of elements) {
    isFirstContent = renderElement(doc, element, isFirstContent);
  }
  
  const range = doc.bufferedPageRange();
  for (let i = 1; i < range.count; i++) {
    doc.switchToPage(i);
    doc.font(FONT_BODY)
       .fontSize(FONT_SIZE_SMALL)
       .text(String(i + 1), 0, PAGE_HEIGHT - 36, {
         width: PAGE_WIDTH,
         align: 'center'
       });
  }
  
  doc.end();
  
  return new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => {
      const stats = fs.statSync(outputPdf);
      console.log(`PDF saved: ${outputPdf}`);
      console.log(`Size: ${(stats.size / 1024).toFixed(0)} KB`);
      console.log(`Pages: ${range.count}`);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

generatePDF().catch(console.error);
