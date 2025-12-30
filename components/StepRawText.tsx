
import React from 'react';
import { AlignRight, Wand2, ArrowRight } from 'lucide-react';

interface StepRawTextProps {
  rawText: string;
  onFormat: () => void;
  isFormatting: boolean;
  formattingStatus?: string;
  onBack: () => void;
}

const StepRawText: React.FC<StepRawTextProps> = ({ rawText, onFormat, isFormatting, formattingStatus, onBack }) => {
  return (
    <div className="bg-[#0f172a] rounded-3xl border border-gray-800 p-8 max-w-4xl mx-auto animate-fade-in shadow-2xl">
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-900/20 p-2 rounded-lg border border-amber-700/30">
             <AlignRight className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">التفريغ الحرفي الكامل</h2>
            <p className="text-sm text-gray-500">تم الانتهاء من المعالجة الحرفية (Verbatim)</p>
          </div>
        </div>
      </div>

      <div className="bg-[#020617] p-6 rounded-xl border border-gray-800 mb-6 max-h-[500px] overflow-y-auto custom-scrollbar">
        <p className="text-gray-300 leading-8 whitespace-pre-wrap text-lg font-light text-right" dir="rtl">
          {rawText}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-amber-500/80 text-xs font-black tracking-widest uppercase text-center md:text-right">
           {isFormatting ? (
             <span className="animate-pulse">{formattingStatus}</span>
           ) : (
             "جاهز للتنسيق الأكاديمي النهائي"
           )}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onBack}
            disabled={isFormatting}
            className="flex-1 md:flex-none bg-gray-800/50 hover:bg-gray-800 text-gray-400 px-6 py-4 rounded-2xl border border-gray-700 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50"
          >
            <ArrowRight className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          
          <button
            onClick={onFormat}
            disabled={isFormatting}
            className="flex-[2] md:flex-none bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-500 hover:to-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-cyan-950/20 flex items-center justify-center gap-3 transform transition hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFormatting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري التنسيق...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>بدء التنسيق</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepRawText;
