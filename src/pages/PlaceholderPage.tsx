import React from 'react';

interface PlaceholderPageProps {
  title: string;
  icon?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon = '🚧' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <span style={styles.icon}>{icon}</span>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>Esta página ainda está em construção e será implementada em breve.</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    minHeight: '400px',
    padding: '24px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
    backgroundColor: 'var(--hover-bg)',
    padding: '48px',
    borderRadius: '16px',
    maxWidth: '400px',
  },
  icon: {
    fontSize: '64px',
    lineHeight: '1',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    margin: 0,
  }
};

export default PlaceholderPage;
