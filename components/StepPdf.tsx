
import React from 'react';
import { RefreshCw, Printer, ShieldCheck, ArrowRight } from 'lucide-react';

interface StepPdfProps {
  formattedText: string;
  subjectName: string;
  onReset: () => void;
  onBack: () => void;
}

const StepPdf: React.FC<StepPdfProps> = ({ formattedText, subjectName, onReset, onBack }) => {

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const documentContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>${subjectName} - Law Lecturer</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              font-family: 'Tajawal', sans-serif;
              line-height: 1.7;
              color: #1e293b;
              background: white;
              direction: rtl;
              text-align: right;
              margin: 0;
              padding: 0;
              counter-reset: page;
              -webkit-print-color-adjust: exact;
            }

            .page-border {
              position: fixed;
              top: 0.8cm;
              left: 0.8cm;
              right: 0.8cm;
              bottom: 0.8cm;
              border: 0.5pt solid #cbd5e1;
              pointer-events: none;
              z-index: 500;
            }

            .fixed-header {
              position: fixed;
              top: 1cm;
              left: 1.2cm;
              right: 1.2cm;
              height: 2.5cm;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              z-index: 1000;
              background: white;
              border-bottom: 1pt solid #f1f5f9;
            }

            .header-right { text-align: right; }
            .subject-display { color: #0ea5e9; font-weight: 900; font-size: 13pt; }
            .header-left { text-align: left; display: flex; flex-direction: column; align-items: flex-start; }
            .platform-brand-container { display: flex; align-items: center; gap: 8px; color: #0ea5e9; font-weight: 900; font-size: 11pt; }
            .logo-svg { width: 20px; height: 20px; fill: #0ea5e9; }
            .dev-name { color: #000; font-size: 8pt; font-weight: 700; margin-top: 2px; }

            .fixed-footer { position: fixed; bottom: 1.2cm; left: 0; right: 0; display: flex; justify-content: center; align-items: center; z-index: 1000; }
            .page-number-box { color: #2563eb; font-weight: 900; font-size: 10pt; background: #f8fafc; padding: 4px 15px; border: 1pt solid #bfdbfe; border-radius: 6px; }
            .page-number-box::after { counter-increment: page; content: counter(page); }

            .main-content { padding: 3.5cm 1.5cm 2.5cm 1.5cm; position: relative; z-index: 10; }
            .content-area { width: 100%; }

            .toc-box { border: 1.2pt solid #eab308; border-radius: 12px; padding: 1.2rem; margin-bottom: 2rem; background-color: #ffffff; page-break-inside: avoid; }
            .toc-title { color: #000; font-weight: 900; font-size: 13pt; margin-bottom: 10px; border-bottom: 1pt solid #e2e8f0; padding-bottom: 5px; }
            .toc-item { font-size: 11pt; font-weight: 700; color: #1e3a8a; margin-bottom: 5px; display: flex; align-items: center; gap: 8px; }
            .toc-item::before { content: ""; width: 6px; height: 6px; background: #2563eb; border-radius: 50%; }

            h2 { color: #1e3a8a; font-size: 14pt; font-weight: 900; border-right: 4px solid #2563eb; padding-right: 12px; margin-top: 2rem; margin-bottom: 1rem; text-align: right; page-break-after: avoid; }
            h3 { color: #0369a1; font-size: 12.5pt; font-weight: 800; border-right: 2.5px solid #0ea5e9; padding-right: 10px; margin-top: 1.5rem; margin-bottom: 0.8rem; page-break-after: avoid; }
            .mansa-gold-box { border: 1.2pt solid #eab308; border-radius: 12px; padding: 1.2rem; margin: 1.5rem 0; background-color: #fffbeb; text-align: right; page-break-inside: auto; display: block; }
            .gold-label { color: #92400e; font-weight: 900; display: inline-block; margin-left: 5px; font-size: 11.5pt; }
            p { margin-bottom: 1rem; font-size: 11.5pt; text-align: justify; line-height: 1.8; orphans: 3; widows: 3; }
            ul, ol { padding-right: 0.5cm; margin-bottom: 1rem; }
            ul li, ol li { margin-bottom: 6px; font-size: 11.5pt; page-break-inside: avoid; }

            @media print { .no-print { display: none; } body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="page-border"></div>
          <div class="fixed-header">
             <div class="header-right"><div class="subject-display">${subjectName}</div></div>
             <div class="header-left">
                <div class="platform-brand-container">
                   <svg class="logo-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                   <span>𝖫𝖺𝗐 𝖫𝖾𝖼𝗍𝗎𝗋𝖾rer || 𝖵3</span>
                </div>
                <div class="dev-name">Mohamed Hagag</div>
             </div>
          </div>
          <div class="fixed-footer"><div class="page-number-box"></div></div>
          <div class="main-content">
            <div id="pdf-content" class="content-area">
              <div id="toc-container"></div>
              ${formattedText}
            </div>
          </div>
          <script>
            window.onload = function() {
              const content = document.getElementById('pdf-content');
              const tocContainer = document.getElementById('toc-container');
              const headings = content.querySelectorAll('h2');
              if (headings.length > 0) {
                let tocHtml = '<div class="toc-box"><div class="toc-title">فهرس المحتويات:</div>';
                headings.forEach((h, index) => { tocHtml += '<div class="toc-item">' + h.innerText + '</div>'; });
                tocHtml += '</div>';
                tocContainer.innerHTML = tocHtml;
              }
              setTimeout(() => { window.print(); }, 1000);
            };
          </script>
        </body>
        </html>
      `;
      printWindow.document.write(documentContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-[2.5rem] shadow-2xl p-10 md:p-16 max-w-2xl mx-auto border border-gray-800 text-center animate-in zoom-in-95 duration-500 mb-24">
       <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full animate-pulse"></div>
          <div className="w-28 h-28 mx-auto bg-[#020617] border-2 border-primary-500/40 rounded-full flex items-center justify-center relative z-10">
             <ShieldCheck className="w-14 h-14 text-primary-400" />
          </div>
       </div>

       <h2 className="text-3xl font-black text-white mb-4 tracking-tight">جاهز للتصدير النهائي</h2>
       <div className="bg-gray-900/50 rounded-2xl p-4 mb-8 border border-gray-800 inline-block px-8">
          <span className="text-gray-500 text-xs font-bold block mb-1">المادة:</span>
          <span className="text-primary-400 font-black text-lg">{subjectName}</span>
       </div>

       <div className="flex flex-col gap-5 max-w-xs mx-auto">
          <button onClick={generatePDF} className="w-full bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-500 hover:to-blue-600 text-white font-black py-5 px-8 rounded-2xl shadow-2xl flex items-center justify-center gap-4 transform transition hover:-translate-y-1 active:scale-95">
            <Printer className="w-6 h-6" />
            توليد ملف الـ PDF
          </button>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={onBack} className="bg-transparent border-2 border-gray-800 hover:border-gray-700 text-gray-500 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              رجوع
            </button>
            <button onClick={onReset} className="bg-transparent border-2 border-gray-800 hover:border-gray-700 text-gray-500 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              جديد
            </button>
          </div>
       </div>
    </div>
  );
};

export default StepPdf;
