import React from 'react';
import { X, Clock, Zap, Info } from 'lucide-react';
import { VERSION_HISTORY } from '../data/assets';

const ChangelogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        width: 500,
        maxHeight: '80vh',
        background: 'rgba(7,8,17,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#f8fafc' }}>System Version Control</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#64748b' }}>Project lifecycle and update history</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {VERSION_HISTORY.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', 
                  background: v.type === 'Portfolio' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                  display: 'flex', alignItems: 'center', justify: 'center',
                  border: `1px solid ${v.type === 'Portfolio' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}`
                }}>
                  {v.type === 'Portfolio' ? <Zap size={14} color="#2ecc71" /> : <Clock size={14} color="#3b82f6" />}
                </div>
                {i < VERSION_HISTORY.length - 1 && <div style={{ flex: 1, width: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />}
              </div>
              <div style={{ paddingBottom: 24, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{v.id} - {v.type} Update</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>{v.date}</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                  {v.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
            <Info size={12} />
            <span style={{ fontSize: 10, fontWeight: 600 }}>Versions follow the Track/Label/Source/Refresh strategy.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
