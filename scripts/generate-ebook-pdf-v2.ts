import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const inputMd = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-COMPREHENSIVE.md');
const outputPdf = path.join(process.cwd(), 'attached_assets', 'Through-The-Veil-EBOOK.pdf');

const PAGE_WIDTH = 432;
const PAGE_HEIGHT = 648;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const FONT_BODY = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_ITALIC = 'Helvetica-Oblique';

const FONT_SIZE_TITLE = 24;
const FONT_SIZE_SUBTITLE = 14;
const FONT_SIZE_H1 = 18;
const FONT_SIZE_H2 = 14;
const FONT_SIZE_BODY = 11;
const FONT_SIZE_SMALL = 9;

const LINE_GAP = 4;
const PARAGRAPH_GAP = 12;

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
  
  doc.moveDown(1.5);
  
  doc.font(FONT_ITALIC)
     .fontSize(FONT_SIZE_SUBTITLE)
     .text('A Testimony of the Great Substitution', {
       width: CONTENT_WIDTH,
       align: 'center'
     });
  
  doc.moveDown(8);
  
  doc.font(FONT_ITALIC)
     .fontSize(FONT_SIZE_SMALL)
     .text('"This is not doctrine. This is not theory. This is testimony."', {
       width: CONTENT_WIDTH,
       align: 'center'
     });
}

function addPageNumber(doc: typeof PDFDocument.prototype, pageNum: number) {
  if (pageNum > 1) {
    doc.font(FONT_BODY)
       .fontSize(FONT_SIZE_SMALL)
       .text(String(pageNum), 0, PAGE_HEIGHT - 40, {
         width: PAGE_WIDTH,
         align: 'center'
       });
  }
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
      elements.push({ type: 'separator', text: '' });
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

function checkPageBreak(doc: typeof PDFDocument.prototype, neededHeight: number): boolean {
  const bottomLimit = PAGE_HEIGHT - MARGIN_BOTTOM;
  if (doc.y + neededHeight > bottomLimit) {
    return true;
  }
  return false;
}

function renderElement(
  doc: typeof PDFDocument.prototype, 
  element: { type: string; text: string },
  pageCounter: { count: number },
  isFirstChapter: boolean
) {
  const text = sanitizeText(element.text);
  
  switch (element.type) {
    case 'h1':
      if (text === 'THROUGH THE VEIL') return;
      
      if (!isFirstChapter) {
        addPageNumber(doc, pageCounter.count);
        doc.addPage();
        pageCounter.count++;
      }
      
      doc.y = MARGIN_TOP + 40;
      
      doc.font(FONT_BOLD)
         .fontSize(FONT_SIZE_H1)
         .text(text, MARGIN_LEFT, doc.y, {
           width: CONTENT_WIDTH,
           align: 'center',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(2);
      break;
      
    case 'h2':
      if (checkPageBreak(doc, 60)) {
        addPageNumber(doc, pageCounter.count);
        doc.addPage();
        pageCounter.count++;
        doc.y = MARGIN_TOP;
      }
      
      doc.moveDown(1);
      
      doc.font(FONT_BOLD)
         .fontSize(FONT_SIZE_H2)
         .text(text, MARGIN_LEFT, doc.y, {
           width: CONTENT_WIDTH,
           align: 'left',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(0.8);
      break;
      
    case 'paragraph':
      if (!text) return;
      
      const heightEstimate = Math.ceil(text.length / 60) * (FONT_SIZE_BODY + LINE_GAP) + PARAGRAPH_GAP;
      
      if (checkPageBreak(doc, Math.min(heightEstimate, 80))) {
        addPageNumber(doc, pageCounter.count);
        doc.addPage();
        pageCounter.count++;
        doc.y = MARGIN_TOP;
      }
      
      doc.font(FONT_BODY)
         .fontSize(FONT_SIZE_BODY)
         .text(text, MARGIN_LEFT, doc.y, {
           width: CONTENT_WIDTH,
           align: 'justify',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(0.8);
      break;
      
    case 'bullet':
      if (checkPageBreak(doc, 30)) {
        addPageNumber(doc, pageCounter.count);
        doc.addPage();
        pageCounter.count++;
        doc.y = MARGIN_TOP;
      }
      
      doc.font(FONT_BODY)
         .fontSize(FONT_SIZE_BODY)
         .text('•  ' + text, MARGIN_LEFT + 15, doc.y, {
           width: CONTENT_WIDTH - 15,
           align: 'left',
           lineGap: LINE_GAP
         });
      
      doc.moveDown(0.4);
      break;
      
    case 'separator':
      doc.moveDown(0.5);
      break;
  }
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
    bufferPages: true
  });
  
  const writeStream = fs.createWriteStream(outputPdf);
  doc.pipe(writeStream);
  
  createTitlePage(doc);
  
  const pageCounter = { count: 2 };
  
  addPageNumber(doc, 1);
  doc.addPage();
  doc.y = MARGIN_TOP;
  
  let isFirstChapter = true;
  
  for (const element of elements) {
    if (element.type === 'h1' && element.text !== 'THROUGH THE VEIL') {
      renderElement(doc, element, pageCounter, isFirstChapter);
      isFirstChapter = false;
    } else {
      renderElement(doc, element, pageCounter, isFirstChapter);
    }
  }
  
  addPageNumber(doc, pageCounter.count);
  
  doc.end();
  
  return new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => {
      const stats = fs.statSync(outputPdf);
      console.log(`PDF saved: ${outputPdf}`);
      console.log(`Size: ${(stats.size / 1024).toFixed(0)} KB`);
      console.log(`Pages: ${pageCounter.count}`);
      resolve();
    });
    writeStream.on('error', reject);
  });
}

generatePDF().catch(console.error);
