'use client';

import { useState, useEffect } from 'react';
import styles from './ContentViewer.module.css';
import { MenuItem, CopilotConfig, PowerBIConfig, PowerBIEmbedInfo } from '@/lib/types';

interface ContentViewerProps {
  item: MenuItem;
}

export default function ContentViewer({ item }: ContentViewerProps) {
  if (item.type === 'copilot') {
    return <CopilotViewer item={item} config={item.config as CopilotConfig} />;
  }
  
  return <PowerBIViewer item={item} config={item.config as PowerBIConfig} />;
}

// Copilot Viewer Component
function CopilotViewer({ item, config }: { item: MenuItem; config: CopilotConfig }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{item.name}</h1>
          <span className={styles.badge}>Copilot Studio</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.iframeWrapper}>
          <iframe
            src={config.embedUrl}
            className={styles.iframe}
            title={item.name}
            allow="microphone"
          />
        </div>
      </div>
    </div>
  );
}

// Power BI Viewer Component
function PowerBIViewer({ item, config }: { item: MenuItem; config: PowerBIConfig }) {
  const [embedInfo, setEmbedInfo] = useState<PowerBIEmbedInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmbedInfo();
  }, [item.id]);

  const loadEmbedInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate the embed info or show configuration
      
      // Check if config has valid values (not placeholder values)
      const hasValidConfig = 
        config.clientId && 
        config.clientId !== 'your-client-id' &&
        config.tenantId &&
        config.workspaceId &&
        config.reportId;
      
      if (!hasValidConfig) {
        setError('Power BI configuration incomplete. Please configure the report settings in the admin panel.');
        setLoading(false);
        return;
      }
      
      // Simulate API call to get embed token
      // In production, this would be: const response = await fetch('/api/powerbi/embed', { ... })
      
      // For demo purposes, construct the embed URL
      const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${config.reportId}&groupId=${config.workspaceId}`;
      
      setEmbedInfo({
        embedToken: 'demo-token', // Would come from backend
        embedUrl,
        reportId: config.reportId,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{item.name}</h1>
          <span className={`${styles.badge} ${styles.powerbi}`}>Power BI</span>
        </div>
        <button className={styles.refreshBtn} onClick={loadEmbedInfo} disabled={loading}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? styles.spinning : ''}>
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinnerRing}></div>
              <div className={styles.spinnerRing}></div>
            </div>
            <p>Loading Power BI Report...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>Unable to Load Report</h3>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={loadEmbedInfo}>
              Try Again
            </button>
          </div>
        ) : (
          <div className={styles.iframeWrapper}>
            <div id={`powerbi-container-${item.id}`} className={styles.powerbiContainer}>
              {/* In production, Power BI JS would embed here */}
              <div className={styles.demoPlaceholder}>
                <div className={styles.demoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <h3>Power BI Report</h3>
                <p>Report ID: <code>{config.reportId}</code></p>
                <p>Workspace ID: <code>{config.workspaceId}</code></p>
                <div className={styles.demoNote}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span>Configure your backend API to enable live embedding</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
