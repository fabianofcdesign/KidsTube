import React, { useState } from 'react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '8704') {
      onSuccess();
      setPin('');
      setError(false);
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Acesso dos Pais</h2>
        <p style={styles.subtitle}>Digite o PIN para liberar o acesso completo ao YouTube (incluindo Shorts).</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
            placeholder="****"
            autoFocus
          />
          {error && <p style={styles.error}>PIN incorreto. Tente novamente.</p>}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
            <button type="submit" style={styles.submitBtn}>Desbloquear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-color)',
    padding: '24px',
    borderRadius: '12px',
    width: '320px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    color: 'var(--text-primary)',
  },
  subtitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '12px',
    fontSize: '24px',
    letterSpacing: '8px',
    textAlign: 'center',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--search-bg)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  error: {
    color: 'var(--accent-color)',
    fontSize: '14px',
    margin: 0,
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  submitBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--text-primary)',
    color: 'var(--bg-color)',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
  }
};

export default PinModal;
