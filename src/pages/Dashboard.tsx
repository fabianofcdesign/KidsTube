import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, KeyRound } from 'lucide-react';
import ShortsBlocker from '../plugins/ShortsBlocker';

const Dashboard: React.FC = () => {
  const [pin, setPin] = useState(localStorage.getItem('shorts_blocker_pin') || '');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);
  const [isDeviceAdminEnabled, setIsDeviceAdminEnabled] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const result = await ShortsBlocker.checkPermissions();
        setIsAccessibilityEnabled(result.isAccessibilityEnabled);
        setIsDeviceAdminEnabled(result.isDeviceAdminEnabled);
      } catch (e) {
        console.error('Plugin native failed', e);
      }
    };
    
    checkPermissions();
    // Re-check periodically when returning to app
    const interval = setInterval(checkPermissions, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSavePin = async () => {
    if (newPin.length >= 4) {
      try {
        await ShortsBlocker.setPin({ pin: newPin });
        localStorage.setItem('shorts_blocker_pin', newPin);
        setPin(newPin);
        setIsPinModalOpen(false);
      } catch (e) {
        alert('Erro ao salvar no sistema Android');
      }
    } else {
      alert('A senha deve ter no mínimo 4 caracteres.');
    }
  };

  const handleAccessibilityClick = async () => {
    await ShortsBlocker.requestAccessibility();
  };

  const handleDeviceAdminClick = async () => {
    await ShortsBlocker.requestDeviceAdmin();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoCircle}>
          <Shield size={32} color="white" />
        </div>
        <h1 style={styles.title}>Shorts Blocker</h1>
        <p style={styles.subtitle}>Proteção Parental Ativa</p>
      </header>

      <main style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <KeyRound size={24} color="var(--accent-color)" />
            <h2 style={styles.cardTitle}>Senha de Segurança</h2>
          </div>
          <p style={styles.cardText}>
            {pin ? 'Senha configurada e ativa. Necessária para desativar o bloqueador ou desinstalar o app.' : 'Você ainda não configurou uma senha.'}
          </p>
          <button style={styles.button} onClick={() => setIsPinModalOpen(true)}>
            {pin ? 'Alterar Senha' : 'Configurar Senha'}
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            {isAccessibilityEnabled ? <ShieldCheck size={24} color="#4CAF50" /> : <ShieldAlert size={24} color="#f44336" />}
            <h2 style={styles.cardTitle}>Bloqueio de Shorts</h2>
          </div>
          <p style={styles.cardText}>
            O motor que monitora e fecha o YouTube Shorts. Precisa de permissão de Acessibilidade.
          </p>
          <button 
            style={{...styles.button, backgroundColor: isAccessibilityEnabled ? '#4CAF50' : 'var(--accent-color)'}} 
            onClick={handleAccessibilityClick}
          >
            {isAccessibilityEnabled ? 'Verificar Permissão' : 'Ativar Acessibilidade'}
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            {isDeviceAdminEnabled ? <ShieldCheck size={24} color="#4CAF50" /> : <ShieldAlert size={24} color="#f44336" />}
            <h2 style={styles.cardTitle}>Trava Antidesinstalação</h2>
          </div>
          <p style={styles.cardText}>
            Impede que a criança desinstale este aplicativo ou limpe seus dados sem a sua permissão (Senha).
          </p>
          <button 
            style={{...styles.button, backgroundColor: isDeviceAdminEnabled ? '#4CAF50' : 'var(--accent-color)'}} 
            onClick={handleDeviceAdminClick}
          >
            {isDeviceAdminEnabled ? 'Verificar Permissão' : 'Ativar Proteção Admin'}
          </button>
        </div>
      </main>

      {isPinModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{pin ? 'Nova Senha' : 'Criar Senha'}</h2>
            <p>Esta senha será exigida para desinstalar o app ou mexer nas configurações do aparelho.</p>
            <input 
              type="password" 
              value={newPin} 
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Digite a senha"
              style={styles.input}
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setIsPinModalOpen(false)}>Cancelar</button>
              <button style={styles.saveBtn} onClick={handleSavePin}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    backgroundColor: 'var(--accent-color)',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomLeftRadius: '24px',
    borderBottomRightRadius: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  logoCircle: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: '8px 0 0 0',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '16px',
  },
  content: {
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '-24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardText: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '18px',
    border: '2px solid #eee',
    borderRadius: '8px',
    marginTop: '16px',
    marginBottom: '24px',
    textAlign: 'center',
    letterSpacing: '4px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--accent-color)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};

export default Dashboard;
