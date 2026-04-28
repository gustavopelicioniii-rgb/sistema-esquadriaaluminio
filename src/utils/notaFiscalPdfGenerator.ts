import { jsPDF } from 'jspdf';
import type { NotaFiscalData } from '@/pages/NotaFiscal';

const BLUE = [37, 99, 235] as const;
const LIGHT_BLUE = [213, 232, 240] as const;
const GRAY = [100, 100, 100] as const;
const BLACK = [30, 30, 30] as const;
const WHITE = [255, 255, 255] as const;
const BORDER = [180, 200, 220] as const;

function drawCell(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  options?: { labelSize?: number; valueSize?: number; bgColor?: readonly [number, number, number] }
) {
  const { labelSize = 5.5, valueSize = 7, bgColor } = options ?? {};

  if (bgColor) {
    pdf.setFillColor(...bgColor);
    pdf.rect(x, y, w, h, 'F');
  }

  pdf.setDrawColor(...BORDER);
  pdf.setLineWidth(0.3);
  pdf.rect(x, y, w, h);

  if (label) {
    pdf.setFontSize(labelSize);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...GRAY);
    pdf.text(label, x + 1.5, y + 3.5);
  }

  if (value) {
    pdf.setFontSize(valueSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...BLACK);
    pdf.text(value, x + 1.5, y + (label ? 8 : 5));
  }
}

export async function generateNotaFiscalPDF(data: NotaFiscalData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pw = 210;
  const m = 10;
  const cw = pw - m * 2; // content width = 190
  const now = new Date();
  const dataEmissao = now.toLocaleDateString('pt-BR');
  const horaEmissao = now.toLocaleTimeString('pt-BR');

  // ===== HEADER BAR =====
  pdf.setFillColor(...LIGHT_BLUE);
  pdf.rect(m, m, cw, 14, 'F');
  pdf.setDrawColor(...BORDER);
  pdf.rect(m, m, cw, 14);

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLUE);
  pdf.text('CONHECIMENTO DE TRANSPORTE ELETRÔNICO (CT-E)', pw / 2, m + 9, { align: 'center' });

  let y = m + 14;

  // ===== DACTE SUBTITLE =====
  const headerH = 22;
  pdf.setDrawColor(...BORDER);
  pdf.rect(m, y, cw, headerH);

  // Left area - company name space
  const leftW = 55;
  pdf.rect(m, y, leftW, headerH);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLUE);
  if (data.emitenteNome) {
    pdf.text(data.emitenteNome, m + leftW / 2, y + 12, { align: 'center' });
  }

  // Right area - doc info
  const rightX = m + leftW;
  const rightW = cw - leftW;
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLACK);
  pdf.text(
    'DACTE - Documento Auxiliar do Conhecimento de Transporte Eletrônico',
    rightX + 2,
    y + 4
  );

  pdf.setFontSize(5.5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...GRAY);
  pdf.text(`DATA LIMITE PARA EMISSÃO: ${dataEmissao}`, rightX + 2, y + 10);
  pdf.text(`DATA DE EMISSÃO: ${dataEmissao}`, rightX + 2, y + 14);
  pdf.text(`MODAL: ${data.modal}`, rightX + rightW - 40, y + 10);

  y += headerH;

  // ===== TOMADOR DO SERVIÇO =====
  drawCell(pdf, m, y, cw, 10, 'TOMADOR DO SERVIÇO OU DESTINATÁRIO', data.destNome);
  y += 10;

  // ===== ENDEREÇO | CIDADE | UF | CEP =====
  const endW = cw * 0.5;
  const cidW = cw * 0.22;
  const ufW = cw * 0.1;
  const cepW = cw - endW - cidW - ufW;
  drawCell(pdf, m, y, endW, 10, 'ENDEREÇO', data.destEndereco);
  drawCell(pdf, m + endW, y, cidW, 10, 'CIDADE', data.destCidade);
  drawCell(pdf, m + endW + cidW, y, ufW, 10, 'UF', data.destUF);
  drawCell(pdf, m + endW + cidW + ufW, y, cepW, 10, 'CEP', data.destCEP);
  y += 10;

  // ===== CNPJ | INSCRIÇÃO =====
  drawCell(pdf, m, y, cw * 0.5, 10, 'CNPJ/CPF', data.destCNPJ);
  drawCell(pdf, m + cw * 0.5, y, cw * 0.5, 10, 'INSCRIÇÃO ESTADUAL', data.destInscEstadual);
  y += 10;

  // ===== TIPO DOC | TIPO SERVIÇO | DACTE/MODAL =====
  const col3W = cw / 3;
  drawCell(pdf, m, y, col3W, 14, 'TIPO DO CT-E', data.tipoDocumento);
  drawCell(pdf, m + col3W, y, col3W, 14, 'TIPO DO SERVIÇO', data.tipoServico);

  // Right third - MODELO/SÉRIE/Nº/FL/DATA
  const rStart = m + col3W * 2;
  const rW = col3W;
  pdf.setDrawColor(...BORDER);
  pdf.rect(rStart, y, rW, 14);

  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...GRAY);

  const subCols = ['MODELO', 'SÉRIE', 'Nº', 'FL', 'DATA/HORA EMISSÃO'];
  const subVals = [
    data.modelo,
    data.serie,
    data.numero || '-',
    data.folha,
    `${dataEmissao} ${horaEmissao}`,
  ];
  const subWidths = [0.12, 0.1, 0.1, 0.1, 0.58];
  let sx = rStart;

  for (let i = 0; i < subCols.length; i++) {
    const sw = rW * subWidths[i];
    pdf.setFontSize(4.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...GRAY);
    pdf.text(subCols[i], sx + 1, y + 3.5);

    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...BLACK);
    pdf.text(subVals[i], sx + 1, y + 8);

    if (i < subCols.length - 1) {
      pdf.line(sx + sw, y, sx + sw, y + 14);
    }
    sx += sw;
  }
  y += 14;

  // ===== FORMA PGTO | NATUREZA PRESTAÇÃO =====
  drawCell(pdf, m, y, cw * 0.35, 10, 'FORMA DE PAGAMENTO', data.formaPagamento);
  drawCell(
    pdf,
    m + cw * 0.35,
    y,
    cw * 0.65,
    10,
    'CFOP - NATUREZA DA PRESTAÇÃO',
    data.naturezaPrestacao
  );
  y += 10;

  // ===== ORIGEM | DESTINO =====
  const halfW = cw / 2;
  drawCell(
    pdf,
    m,
    y,
    halfW,
    12,
    'ORIGEM DA PRESTAÇÃO',
    `${data.origemCidade}${data.origemCidade ? ' - ' : ''}${data.origemUF}`
  );
  drawCell(
    pdf,
    m + halfW,
    y,
    halfW,
    12,
    'DESTINO DA PRESTAÇÃO',
    `${data.destinoCidade}${data.destinoCidade ? ' - ' : ''}${data.destinoUF}`
  );
  y += 12;

  // ===== REMETENTE / DESTINATÁRIO BLOCKS =====
  const blockH = 32;

  // Remetente
  pdf.setDrawColor(...BORDER);
  pdf.rect(m, y, halfW, blockH);
  pdf.setFillColor(...LIGHT_BLUE);
  pdf.rect(m, y, halfW, 5, 'F');
  pdf.setFontSize(5.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLUE);
  pdf.text('REMETENTE', m + 2, y + 3.5);

  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLACK);
  let ry = y + 9;
  pdf.text(`REMETENTE: ${data.emitenteNome}`, m + 2, ry);
  ry += 4;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.text(`ENDEREÇO: ${data.emitenteEndereco}`, m + 2, ry);
  pdf.text(`CEP: ${data.emitenteCEP}`, m + halfW - 25, ry);
  ry += 4;
  pdf.text(`MUNICÍPIO: ${data.emitenteCidade}/${data.emitenteUF}`, m + 2, ry);
  ry += 4;
  pdf.text(`CNPJ/CPF: ${data.emitenteCNPJ}`, m + 2, ry);
  ry += 4;
  pdf.text(`UF: ${data.emitenteUF}    País: BRASIL    FONE: ${data.emitenteFone}`, m + 2, ry);

  // Destinatário
  pdf.setDrawColor(...BORDER);
  pdf.rect(m + halfW, y, halfW, blockH);
  pdf.setFillColor(...LIGHT_BLUE);
  pdf.rect(m + halfW, y, halfW, 5, 'F');
  pdf.setFontSize(5.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLUE);
  pdf.text('DESTINATÁRIO', m + halfW + 2, y + 3.5);

  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...BLACK);
  ry = y + 9;
  pdf.text(`DESTINATÁRIO: ${data.destNome}`, m + halfW + 2, ry);
  ry += 4;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.text(`ENDEREÇO: ${data.destEndereco}`, m + halfW + 2, ry);
  pdf.text(`CEP: ${data.destCEP}`, m + cw - 25, ry);
  ry += 4;
  pdf.text(`MUNICÍPIO: ${data.destCidade}/${data.destUF}`, m + halfW + 2, ry);
  ry += 4;
  pdf.text(`CNPJ/CPF: ${data.destCNPJ}`, m + halfW + 2, ry);
  ry += 4;
  pdf.text(`UF: ${data.destUF}    País: BRASIL    FONE: ${data.destFone}`, m + halfW + 2, ry);

  y += blockH;

  // ===== OBSERVAÇÕES =====
  if (data.observacoes) {
    y += 4;
    drawCell(pdf, m, y, cw, 14, 'OBSERVAÇÕES / INFORMAÇÕES COMPLEMENTARES', data.observacoes);
    y += 14;
  }

  // ===== FOOTER =====
  y += 6;
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...GRAY);
  pdf.text('Documento gerado pelo sistema AlumPro', pw / 2, y, { align: 'center' });
  pdf.text(`Emissão: ${dataEmissao} ${horaEmissao}`, pw / 2, y + 4, { align: 'center' });

  pdf.save(`ct-e-${data.numero || 'novo'}-${now.getTime()}.pdf`);
}
