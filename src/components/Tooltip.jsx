import React from 'react';
import { X, TrendingUp, Info } from 'lucide-react';

const Tooltip = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="absolute z-[100] w-72 glass border border-white/20 rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" style={{ left: data.x + 20, top: data.y - 120 }}>
      {/* Tooltip Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-white">{data.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xl font-bold text-orange-400">{data.score}</span>
            <span className="text-[10px] text-orange-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> 5%
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{data.units}</span>
            <span className="ml-auto text-[10px] font-black text-orange-400 tracking-widest">{data.status}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md transition-colors">
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>

      {/* Driver List */}
      <div className="p-4">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Key Drivers</div>
        
        <div className="space-y-3">
          {data.drivers.map((driver, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${driver.colorClass}`} />
                <span className="text-[11px] text-gray-300 group-hover:text-white transition-colors">{driver.label} <span className="text-gray-500">({driver.desc})</span></span>
              </div>
              <span className="text-[11px] font-bold text-white">{driver.value}%</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-gray-500 font-bold uppercase">Confidence - </span>
            <span className="text-[9px] text-white font-bold uppercase tracking-wider">HIGH</span>
          </div>
          <button className="text-[9px] text-gray-400 flex items-center gap-1 hover:text-white group">
            Stats <TrendingUp className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
