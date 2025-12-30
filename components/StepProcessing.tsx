
import React, { useEffect, useState } from 'react';
import { 
  Loader2, 
  Layers, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Waves, 
  Scissors, 
  CircleDashed, 
  Wand2, 
  CheckCircle2,
  Lock
} from 'lucide-react';

interface StepProcessingProps {
  onProcessComplete: () => void;
  processFunction: (updateProgress: (current: number, total: number, phase?: string) => void) => Promise<void>;
}

const StepProcessing: React.FC<StepProcessingProps> = ({ onProcessComplete, processFunction }) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [phase, setPhase] = useState<'PREPROCESSING' | 'TRANSCRIBING'>('PREPROCESSING');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const runProcess = async () => {
      try {
        await processFunction((current, total, phaseName) => {
          if (isMounted) {
            setCurrentSegment(current);
            setTotalSegments(total);
            if (phaseName) setPhase(phaseName as 'PREPROCESSING' | 'TRANSCRIBING');
          }
        });
        if (isMounted) onProcessComplete();
      } catch (err) {
        if (isMounted) setError("حدث خطأ أثناء معالجة الملف الأكاديمي.");
      }
    };
    runProcess();
    return () => { isMounted = false; };
  }, [onProcessComplete, processFunction]);

  if (error) {
    return (
      <div className="bg-red-950/20 p-8 rounded-[2.5rem] text-center border border-red-500/30 backdrop-blur-xl animate-in zoom-in-95 duration-500 max-w-sm mx-auto mt-10">
        <Activity className="text-red-500 mx-auto mb-4" size={48} />
        <h3 className="text-white font-black text-xl mb-2">عفواً، واجهنا مشكلة!</h3>
        <p className="text-gray-400 mb-6 text-sm font-bold">يرجى التحقق من اتصال الإنترنت.</p>
        <button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-black transition-all">إعادة المحاولة</button>
      </div>
    );
  }

  const progressPercent = totalSegments > 0 ? (currentSegment / totalSegments) * 100 : (phase === 'PREPROCESSING' ? 10 : 0);

  const stages = [
    { id: 'isolation', icon: Waves, label: 'ISOLATION', active: phase === 'PREPROCESSING' },
    { id: 'split', icon: Scissors, label: 'SPLIT', active: phase === 'TRANSCRIBING' },
    { id: 'empty', icon: CircleDashed, label: 'EMPTY', active: false },
    { id: 'format', icon: Wand2, label: 'FORMAT', active: false },
    { id: 'output', icon: CheckCircle2, label: 'FINAL', active: false }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center px-4">
      
      {/* Container for the processing card to keep it centered and appropriately sized */}
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* Top Progress Stages */}
        <div className="relative w-full mb-10 px-4">
          <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-gray-800/50 -z-0"></div>
          <div className="flex justify-between items-center w-full relative z-10">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="flex flex-col items-center gap-2 group">
                  <div 
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-700 
                    ${stage.active 
                      ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] scale-110' 
                      : 'bg-[#0f172a] border-gray-800 text-gray-700'}`}
                  >
                    <Icon size={18} className={stage.active ? 'animate-pulse' : 'group-hover:text-gray-500 transition-colors'} />
                  </div>
                  <span className={`text-[7px] font-black text-center uppercase tracking-widest transition-colors duration-500 
                    ${stage.active ? 'text-[#0ea5e9]' : 'text-gray-800'}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Processing Card */}
        <div className="w-full bg-[#070b16]/70 backdrop-blur-3xl border border-white/[0.04] rounded-[3.5rem] p-6 pb-10 relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] flex flex-col items-center mb-8">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#0ea5e9]/10 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full"></div>

          <div className="relative mb-8 mt-4">
            <div className="w-28 h-28 bg-[#020617] rounded-[2rem] border border-white/[0.05] flex items-center justify-center shadow-2xl relative">
               <Layers size={60} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
               <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-[2rem]"></div>
            </div>
            <div className="absolute -top-1.5 -left-1.5 w-9 h-9 bg-[#0ea5e9] rounded-xl flex items-center justify-center shadow-2xl border border-white/20 animate-pulse">
               <Cpu size={18} className="text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8 w-full px-2">
            <h2 className="text-xl md:text-2xl font-black text-white whitespace-nowrap overflow-hidden text-ellipsis">
              جاري المعالجة: مقطع <span className="text-[#0ea5e9]">{currentSegment || '1'}</span> <span className="text-gray-600 font-bold mx-1">من</span> <span className="text-gray-400">{totalSegments || '5'}</span>
            </h2>
          </div>

          <div className="bg-[#111827]/90 px-5 py-2.5 rounded-2xl border border-white/[0.05] mb-10 shadow-inner w-full max-w-[280px] text-center">
             <p className="text-gray-400 text-[10px] font-bold leading-tight tracking-tight">
               {phase === 'PREPROCESSING' ? 'نظام العزل الصوتي قيد التشغيل حالياً' : 'تحليل وتفريغ الكلمات بدقة متناهية...'}
             </p>
          </div>

          <div className="w-full px-2 space-y-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="relative w-4 h-4">
                      <Loader2 size={14} className="text-[#0ea5e9] animate-spin" />
                      <div className="absolute inset-0 bg-[#0ea5e9] blur-[2px] opacity-20 animate-pulse"></div>
                   </div>
                   <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                     {phase === 'PREPROCESSING' ? 'AUDIO_ISOLATION' : 'NEURAL_TRANSCRIPTION'}
                   </span>
                </div>

                <div className="flex items-baseline">
                  <span className="text-2xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">
                    {Math.round(progressPercent)}
                  </span>
                  <span className="text-sm font-black text-[#0ea5e9] ml-0.5">%</span>
                </div>
             </div>

             <div className="relative h-4 w-full bg-[#020617] rounded-full overflow-hidden border border-white/[0.03] shadow-inner p-1">
                <div 
                  className="h-full bg-gradient-to-r from-primary-600 to-[#0ea5e9] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(14,165,233,0.5)] relative" 
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-30 animate-pulse"></div>
                </div>
             </div>

             <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Lock size={10} className="opacity-30" />
                  <span className="text-[7.5px] font-black uppercase tracking-wider opacity-50">Secure Encryption</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#0ea5e9]/70">
                  <span className="text-[7.5px] font-black uppercase tracking-wider">
                     {phase === 'PREPROCESSING' ? 'ISOLATION NODE' : 'TRANSCRIPTION ACTIVE'}
                  </span>
                  <ShieldCheck size={12} className="opacity-70" />
                </div>
             </div>
          </div>
        </div>
        
        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em] text-center opacity-40 mb-12">
          System Processing • Optimized for Mobile
        </div>
      </div>

      {/* Improved Developer Credits - Same as Upload Page */}
      <div className="mt-12 mb-10 flex flex-col items-center gap-8 group w-full animate-in fade-in duration-1000">
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

export default StepProcessing;
