
import React, { useState } from 'react';
import { Upload, FileAudio, Scale, Sparkles, Type, ShieldCheck, Info, Gavel, Cpu, BookOpen, Clock, MessageCircle } from 'lucide-react';

interface StepUploadProps {
  onFileSelect: (file: File, subject: string) => void;
  onTextSubmit: (text: string, subject: string) => void;
}

const StepUpload: React.FC<StepUploadProps> = ({ onFileSelect, onTextSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'audio' | 'text'>('audio');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartProcess = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSubject = "محاضرة قانونية";

    if (activeTab === 'audio' && selectedFile) {
      onFileSelect(selectedFile, defaultSubject);
    } else if (activeTab === 'text' && pastedText.trim()) {
      onTextSubmit(pastedText.trim(), defaultSubject);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10 px-4">
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/201094906612" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 left-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.5)] transition-all transform hover:scale-110 active:scale-95 group flex items-center gap-2"
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-4 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl pointer-events-none">
          تواصل معنا واتساب
        </div>
        <MessageCircle size={32} />
      </a>

      {/* Upper Branding Bar */}
      <div className="w-full max-w-2xl mb-12">
        <div className="bg-[#111827]/60 backdrop-blur-xl border border-white/5 rounded-full px-8 py-5 flex items-center justify-between shadow-2xl">
           <div className="flex items-center gap-3">
              <div className="bg-primary-500/20 p-2 rounded-lg">
                <Gavel size={20} className="text-primary-400" />
              </div>
              <span className="text-xs md:text-sm font-black text-primary-400 tracking-[0.2em] uppercase">
                Law Lecturer V3
              </span>
           </div>
           
           <div className="h-6 w-[1px] bg-gray-800"></div>

           <div className="flex items-center gap-3">
              <span className="text-sm md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-400 uppercase tracking-wider">
                Mohamed Hagag
              </span>
           </div>
        </div>
      </div>

      {/* Main Title Section */}
      <div className="text-center mb-12 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary-600/10 blur-[80px] rounded-full"></div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tighter">
          <span className="relative">
            Law Lecturer
            <span className="absolute -top-4 -right-8 text-xs bg-primary-600 text-white px-2 py-1 rounded-md font-black animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.5)]">PRO</span>
          </span>
          <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-blue-500 drop-shadow-2xl">
            المساعد القانوني الذكي
          </span>
        </h1>
        
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-3 rounded-2xl shadow-xl">
           <Sparkles size={20} className="text-yellow-400" />
           <span className="text-lg md:text-xl font-black text-gray-200">
             تحويل المحاضرات إلى مذكرات أكاديمية بضغطة زر
           </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-2xl bg-[#0f172a]/60 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-8 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group mb-16">
         <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-600/10 blur-[120px] rounded-full group-hover:bg-primary-600/20 transition-all duration-700"></div>
         <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700"></div>

         <div className="relative z-10 space-y-10">
            <div className="bg-black/60 p-2 rounded-[2rem] border border-white/5 flex items-center shadow-inner">
               <button 
                 onClick={() => setActiveTab('text')}
                 className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black transition-all duration-500 ${activeTab === 'text' ? 'bg-gradient-to-br from-primary-600 to-blue-700 text-white shadow-2xl scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 <Type size={20} />
                 <span className="text-lg">نص مكتوب</span>
               </button>
               <button 
                 onClick={() => setActiveTab('audio')}
                 className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black transition-all duration-500 ${activeTab === 'audio' ? 'bg-gradient-to-br from-primary-600 to-blue-700 text-white shadow-2xl scale-[1.02]' : 'text-gray-500 hover:text-gray-300'}`}
               >
                 <FileAudio size={20} />
                 <span className="text-lg">ملف صوتي</span>
               </button>
            </div>

            <div className="min-h-[200px] flex flex-col justify-center">
              {activeTab === 'audio' ? (
                !selectedFile ? (
                  <label className="cursor-pointer group block w-full">
                    <input type="file" className="hidden" accept="audio/*" onChange={handleFileChange} />
                    <div className="bg-white/[0.02] hover:bg-white/[0.05] border-2 border-dashed border-white/10 hover:border-primary-500/50 rounded-[2.5rem] p-12 flex flex-col items-center gap-6 transition-all duration-500 transform hover:scale-[1.01]">
                      <div className="w-20 h-20 bg-primary-500/10 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                        <Upload size={40} className="text-primary-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-black text-2xl mb-2">إسقاط الملف الصوتي هنا</p>
                        <p className="text-gray-500 text-sm font-bold opacity-60">يدعم تنسيقات MP3, WAV, M4A</p>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="bg-primary-500/10 border border-primary-500/30 p-8 rounded-3xl flex items-center gap-6 animate-in zoom-in-95 shadow-2xl">
                    <div className="bg-primary-500/20 p-5 rounded-2xl shadow-inner">
                      <FileAudio className="text-primary-400" size={36} />
                    </div>
                    <div className="flex-1 text-right overflow-hidden">
                      <p className="text-white font-black truncate text-xl mb-1">{selectedFile.name}</p>
                      <p className="text-primary-400/80 text-sm font-black tracking-widest uppercase">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                    >
                      <Sparkles className="w-6 h-6" />
                    </button>
                  </div>
                )
              ) : (
                <textarea 
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="قم بلصق محتوى المحاضرة هنا لبدء التنسيق الأكاديمي..."
                  className="w-full min-h-[220px] bg-black/40 border border-white/5 focus:border-primary-500/40 rounded-3xl py-6 px-8 text-white font-medium outline-none transition-all placeholder:text-gray-700 text-right resize-none custom-scrollbar text-lg leading-relaxed shadow-inner"
                  dir="rtl"
                />
              )}
            </div>

            <button 
                type="button"
                onClick={handleStartProcess}
                disabled={(activeTab === 'audio' ? !selectedFile : !pastedText.trim())}
                className="w-full bg-gradient-to-r from-primary-600 via-blue-600 to-primary-700 hover:from-primary-500 hover:to-blue-500 disabled:from-gray-900 disabled:to-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-6 rounded-[2rem] text-2xl transition-all shadow-[0_20px_60px_-15px_rgba(14,165,233,0.5)] flex justify-center items-center gap-5 transform active:scale-[0.98] group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]"></div>
                <Sparkles size={28} className="text-primary-200 animate-pulse" />
                <span>{activeTab === 'audio' ? 'بدء التحويل الذكي' : 'بدء الصياغة الأكاديمية'}</span>
            </button>
         </div>

         <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black text-gray-600 tracking-[0.2em] uppercase">
            <div className="flex items-center gap-3">
              <ShieldCheck size={14} className="text-green-500/50" />
              <span>نظام تشفير البيانات النشط</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>System Status: Optimal</span>
            </div>
         </div>
      </div>

      {/* Platform Information Section - Re-organized into high-end informative cards */}
      <div className="w-full max-w-5xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-20">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-primary-500/10 border border-primary-500/20 px-8 py-2.5 rounded-full mb-6">
             <div className="flex items-center gap-2 text-primary-400">
                <Info size={20} />
                <span className="text-sm font-black uppercase tracking-[0.3em]">Platform Overview</span>
             </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white text-center leading-tight">القوة الكامنة في Law Lecturer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#111827]/40 backdrop-blur-md border border-white/5 p-10 rounded-[3rem] hover:border-primary-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Cpu size={120} />
             </div>
             <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                <Cpu className="text-primary-400" size={32} />
             </div>
             <h3 className="text-2xl font-black text-white mb-4">ذكاء اصطناعي مُتخصص</h3>
             <p className="text-gray-400 text-base leading-relaxed font-bold opacity-80">
               محركات معالجة لغوية مدربة حصرياً على القواميس القانونية والمناهج الأكاديمية لضمان دقة المصطلحات وصحة الصياغة الفنية.
             </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#111827]/40 backdrop-blur-md border border-white/5 p-10 rounded-[3rem] hover:border-primary-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <BookOpen size={120} />
             </div>
             <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-inner">
                <BookOpen className="text-blue-400" size={32} />
             </div>
             <h3 className="text-2xl font-black text-white mb-4">هيكلة أكاديمية ذكية</h3>
             <p className="text-gray-400 text-base leading-relaxed font-bold opacity-80">
               تحويل العشوائية الصوتية إلى مذكرات احترافية تضم عناوين، مفاهيم، تنبيهات امتحانية، وفهارس رقمية جاهزة للاستذكار المباشر.
             </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#111827]/40 backdrop-blur-md border border-white/5 p-10 rounded-[3rem] hover:border-primary-500/30 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Clock size={120} />
             </div>
             <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                <Clock className="text-cyan-400" size={32} />
             </div>
             <h3 className="text-2xl font-black text-white mb-4">سرعة وكفاءة مطلقة</h3>
             <p className="text-gray-400 text-base leading-relaxed font-bold opacity-80">
               اختزال ساعات من العمل اليدوي في دقائق. نحن نمنحك الوقت لتركز على الفهم والتحليل، ونقوم نحن بمهام التدوين والتنظيم.
             </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-[#111827]/80 to-[#020617]/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/5 text-right relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/5 blur-[80px] rounded-full group-hover:bg-primary-600/10 transition-all"></div>
           <h4 className="text-3xl font-black text-white mb-6 flex items-center justify-end gap-3">
             <ShieldCheck size={28} className="text-primary-500" />
             رؤيتنا الأكاديمية
           </h4>
           <p className="text-gray-400 text-xl leading-relaxed font-bold max-w-4xl mr-auto">
             منصة <span className="text-primary-400">Law Lecturer</span> هي شريكك الرقمي في رحلتك الجامعية. نؤمن بأن المعرفة يجب أن تُكتسب بيسر، لذا سخرنا الذكاء الاصطناعي لخدمة طالب الحقوق، محولين الشرح الشفهي إلى مرجع علمي رصين يحفظ الجهد ويحقق التفوق.
           </p>
        </div>
      </div>

      {/* Improved Developer Credits - High-end Typography */}
      <div className="mt-20 mb-10 flex flex-col items-center gap-8 group w-full">
        <div className="flex items-center gap-6">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"></div>
          <div className="bg-primary-500/10 p-3 rounded-full border border-primary-500/20 group-hover:rotate-[360deg] transition-transform duration-1000 shadow-xl">
            <Cpu size={24} className="text-primary-400" />
          </div>
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent via-primary-500/40 to-transparent"></div>
        </div>
        
        <div className="text-center">
          <p className="text-[11px] font-black text-gray-500 tracking-[0.2em] mb-4 opacity-60">تم التصميم والتطوير بواسطة</p>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-5xl md:text-7xl font-black relative cursor-default">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-gray-400 drop-shadow-sm">MOHAMED</span>
               <span className="text-white mx-4">HAGAG</span>
               <div className="absolute -bottom-4 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary-500/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            </h2>
          </div>
          <p className="mt-10 text-[10px] font-black text-primary-500/40 tracking-[0.2em] bg-primary-500/5 px-6 py-2 rounded-full border border-primary-500/10 inline-block">
            تحويل الرؤى إلى واقع • ٢٠٢٥
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepUpload;
