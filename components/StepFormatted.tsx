
import { BookOpen, Copy, Check, FileDown, ArrowLeftRight, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';

interface StepFormattedProps {
  formattedText: string;
  onConvertToPdf: () => void;
  onBack: () => void;
}

const StepFormatted: React.FC<StepFormattedProps> = ({ formattedText, onConvertToPdf, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    navigator.clipboard.writeText(tempDiv.innerText || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="bg-[#0f172a] rounded-t-[2rem] border-x border-t border-gray-800 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors ml-2"
            title="الرجوع للنص الحرفي"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/30">
             <BookOpen className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">مراجعة المذكرة المنسقة</h2>
            <p className="text-gray-500 font-medium">تم تحويل الشرح إلى لغة عربية فصحى منظمة</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopy} 
            className="flex-1 md:flex-none bg-gray-800/50 hover:bg-gray-800 text-gray-300 px-6 py-3 rounded-xl border border-gray-700 transition-all flex items-center justify-center gap-2 font-bold"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            {copied ? 'تم النسخ' : 'نسخ النص'}
          </button>
          
          <button
            onClick={onConvertToPdf}
            className="flex-1 md:flex-none bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black px-8 py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 transform transition hover:-translate-y-0.5 active:scale-95"
          >
            <FileDown className="w-5 h-5" />
            انتقل للمعاينة والطباعة
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-[2rem] shadow-inner p-10 md:p-16 border-x border-b border-gray-200 min-h-[600px] relative overflow-hidden">
        <style>{`
          .formatted-preview-content {
            font-family: 'Tajawal', sans-serif;
            line-height: 1.8;
            color: #1e293b;
            direction: rtl;
            text-align: right;
          }
          .formatted-preview-content h2 {
            color: #1e3a8a;
            font-size: 1.5rem;
            font-weight: 900;
            margin: 2.5rem 0 1.2rem;
            border-right: 5px solid #2563eb;
            padding-right: 15px;
            display: block;
            width: 100%;
          }
          .formatted-preview-content h3 {
            color: #0369a1;
            font-size: 1.3rem;
            font-weight: 800;
            margin: 1.8rem 0 0.8rem;
            border-right: 3px solid #0ea5e9;
            padding-right: 12px;
            display: block;
          }
          .formatted-preview-content p { 
            margin-bottom: 1.2rem; 
            font-size: 1.15rem;
            text-align: justify;
            display: block;
          }
          .formatted-preview-content .mansa-gold-box {
            border: 1.5px solid #eab308;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            background-color: #fffbeb;
            display: block;
          }
          .formatted-preview-content .gold-label {
            color: #92400e;
            font-weight: 900;
            font-size: 1.2rem;
            display: block;
            margin-bottom: 8px;
          }
          .formatted-preview-content ul, .formatted-preview-content ol {
            padding-right: 1.5rem;
            margin-bottom: 1.5rem;
            list-style-position: outside;
          }
          .formatted-preview-content li {
            margin-bottom: 0.8rem;
            font-size: 1.15rem;
            text-align: right;
            padding-right: 5px;
          }
        `}</style>
        
        <div className="formatted-preview-content max-h-[1200px] overflow-y-auto pr-4 custom-preview-scroll">
           <div dangerouslySetInnerHTML={{ __html: formattedText }} />
        </div>

        <div className="mt-12 bg-gray-100/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full flex items-center justify-center gap-3 text-sm font-bold text-gray-500 shadow-sm">
           <ArrowLeftRight size={16} />
           نهاية المذكرة الأكاديمية
        </div>
      </div>
    </div>
  );
};

export default StepFormatted;
