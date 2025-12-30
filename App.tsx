
import React, { useState } from 'react';
import { AppStep, LectureData } from './types.ts';
import { transcribeAudio, formatTranscription } from './services/geminiService.ts';
import StepUpload from './components/StepUpload.tsx';
import StepProcessing from './components/StepProcessing.tsx';
import StepRawText from './components/StepRawText.tsx';
import StepFormatted from './components/StepFormatted.tsx';
import StepPdf from './components/StepPdf.tsx';
import { Scale, Shield, User, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [data, setData] = useState<LectureData>({
    file: null,
    subjectName: '',
    rawText: '',
    rawChunks: [],
    formattedText: ''
  });
  const [isFormatting, setIsFormatting] = useState(false);
  const [formattingStatus, setFormattingStatus] = useState('');

  const handleFileSelect = (file: File, subject: string) => {
    setData(prev => ({ ...prev, file, subjectName: subject }));
    setStep(AppStep.PROCESSING);
  };

  const handleTextSubmit = (text: string, subject: string) => {
    setData(prev => ({ 
      ...prev, 
      rawText: text, 
      subjectName: subject,
      file: null 
    }));
    setStep(AppStep.RAW_TEXT);
  };

  const handleProcessComplete = () => {
    setStep(AppStep.RAW_TEXT);
  };

  const handleBack = () => {
    if (step === AppStep.RAW_TEXT) setStep(AppStep.UPLOAD);
    else if (step === AppStep.FORMATTED_TEXT) setStep(AppStep.RAW_TEXT);
    else if (step === AppStep.PDF_EXPORT) setStep(AppStep.FORMATTED_TEXT);
  };

  const performProcessing = async (updateProgress: (c: number, t: number, p?: string) => void) => {
    if (!data.file) return;
    try {
      const result = await transcribeAudio(data.file, updateProgress as any);
      setData(prev => ({ 
        ...prev, 
        rawText: result.fullText,
        rawChunks: result.chunks 
      }));
    } catch (error: any) {
      console.error("Transcription error:", error);
      throw error;
    }
  };

  const handleFormatText = async () => {
    setIsFormatting(true);
    setFormattingStatus('جاري تحليل المحتوى وتنقيته...');
    try {
      const formatted = await formatTranscription(data.rawText, (status) => {
        setFormattingStatus(status);
      });
      setData(prev => ({ ...prev, formattedText: formatted }));
      setStep(AppStep.FORMATTED_TEXT);
    } catch (error) {
      console.error("Formatting error:", error);
      alert('حدث خطأ أثناء التنسيق');
    } finally {
      setIsFormatting(false);
      setFormattingStatus('');
    }
  };

  const handleReset = () => {
    setData({ file: null, subjectName: '', rawText: '', rawChunks: [], formattedText: '' });
    setStep(AppStep.UPLOAD);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Optimized Header Based on User Requests */}
      <header className="bg-[#020617]/95 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          
          {/* Left Side: Developer & Brand Info (Enhanced) */}
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="flex flex-col text-right md:text-left">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-cyan-400 text-[12px] md:text-[14px] font-black tracking-wider uppercase flex items-center gap-1.5 leading-none">
                 <User size={14} className="text-[#0ea5e9] opacity-70" />
                 By Mohamed Hagag
              </span>
              <span className="text-gray-400 text-[9px] md:text-[11px] font-black tracking-[0.15em] uppercase mt-1.5 opacity-80">
                Law Lecturer || V3 AUD
              </span>
            </div>
          </div>

          {/* Center: Added specialized AI Title */}
          <div className="flex items-center gap-2 bg-white/5 px-6 py-2 rounded-2xl border border-white/5 shadow-inner hidden lg:flex">
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <h2 className="text-sm font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-100 to-primary-400">
              مُحرِّكُ الصِّيَاغَةِ الأَكَادِيمِيَّةِ
            </h2>
          </div>

          <div className="flex-1 lg:hidden"></div>

          {/* Right Side: Secure Badge */}
          <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] px-5 py-2.5 rounded-full shadow-[0_5px_15px_rgba(14,165,233,0.3)] border border-white/20 flex items-center gap-3 group hover:scale-105 transition-transform cursor-default">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-white/90 leading-none tracking-widest uppercase">SECURE</span>
                <span className="text-[11px] font-black text-white leading-none mt-0.5">V3.0</span>
             </div>
             <Shield size={18} className="text-white group-hover:rotate-12 transition-transform" />
          </div>

        </div>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 pb-28 z-10 pt-8">
        {step === AppStep.UPLOAD && <StepUpload onFileSelect={handleFileSelect} onTextSubmit={handleTextSubmit} />}
        {step === AppStep.PROCESSING && (
            <StepProcessing 
              processFunction={performProcessing}
              onProcessComplete={handleProcessComplete} 
            />
        )}
        {step === AppStep.RAW_TEXT && (
            <StepRawText 
              rawText={data.rawText} 
              onFormat={handleFormatText} 
              isFormatting={isFormatting}
              formattingStatus={formattingStatus}
              onBack={handleBack}
            />
        )}
        {step === AppStep.FORMATTED_TEXT && (
            <StepFormatted 
              formattedText={data.formattedText}
              onConvertToPdf={() => setStep(AppStep.PDF_EXPORT)}
              onBack={handleBack}
            />
        )}
        {step === AppStep.PDF_EXPORT && (
            <StepPdf 
              formattedText={data.formattedText}
              subjectName={data.subjectName}
              onReset={handleReset}
              onBack={handleBack}
            />
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-[#020617]/95 backdrop-blur-2xl border-t border-gray-800/80 py-4 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-10">
           <div className="flex flex-col items-center group cursor-pointer" onClick={handleReset}>
              <Shield size={24} className={`transition-all duration-300 ${step === AppStep.UPLOAD ? 'text-primary-400 drop-shadow-[0_0_8px_#0ea5e9]' : 'text-gray-600 group-hover:text-primary-400'}`} />
              <span className={`text-[10px] mt-1 font-black uppercase tracking-widest ${step === AppStep.UPLOAD ? 'text-primary-400' : 'text-gray-600'}`}>الرئيسية</span>
           </div>
           <div className="flex flex-col items-center group cursor-default">
              <Shield size={24} className="text-gray-600 group-hover:text-white transition-all duration-300" />
              <span className="text-[10px] mt-1 font-black text-gray-600 uppercase tracking-tighter group-hover:text-white transition-colors">Mohamed Hagag Tech</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
