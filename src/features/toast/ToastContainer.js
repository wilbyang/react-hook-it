import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from './toastSlice';

const typeStyles = {
  error: { borderLeft: '4px solid #e74c3c', background: '#2c2c2c' },
  info: { borderLeft: '4px solid #3498db', background: '#2c2c2c' },
  success: { borderLeft: '4px solid #2ecc71', background: '#2c2c2c' }
};

export default function ToastContainer() {
  const items = useSelector(state => state.toast.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = items.map(t => {
      // 4s 自动关闭
      const remain = Math.max(0, 4000 - (Date.now() - t.createdAt));
      return setTimeout(() => dispatch(removeToast(t.id)), remain);
    });
    return () => timers.forEach(clearTimeout);
  }, [items, dispatch]);

  if (!items.length) return null;

  return (
    <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
      {items.map(t => (
        <div key={t.id} style={{
          padding: '10px 14px',
          color: '#fff',
          fontSize: 14,
          lineHeight: 1.4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          borderRadius: 6,
          backdropFilter: 'blur(4px)',
          ...typeStyles[t.type] || typeStyles.error,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{t.message}</div>
            <button onClick={() => dispatch(removeToast(t.id))} style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>&times;</button>
          </div>
        </div>
      ))}
    </div>
  );
}
