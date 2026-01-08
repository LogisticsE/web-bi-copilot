'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ContentViewer.module.css';
import { MenuItem, CopilotConfig, PowerBIConfig, PowerBIEmbedInfo } from '@/lib/types';
import * as powerbi from 'powerbi-client';

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
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const powerbiRef = useRef<powerbi.service.Service | null>(null);

  useEffect(() => {
    loadEmbedInfo();
    
    // Cleanup on unmount
    return () => {
      if (powerbiRef.current && embedContainerRef.current) {
        try {
          powerbiRef.current.reset(embedContainerRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [item.id]);

  const loadEmbedInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if config has valid values (not placeholder values)
      const hasValidConfig = 
        config.clientId && 
        config.clientId !== 'your-client-id' &&
        config.clientSecret &&
        config.clientSecret !== 'your-client-secret' &&
        config.tenantId &&
        config.tenantId !== 'your-tenant-id' &&
        config.workspaceId &&
        config.workspaceId !== 'your-workspace-id' &&
        config.reportId &&
        config.reportId !== 'your-report-id';
      
      if (!hasValidConfig) {
        setError('Power BI configuration incomplete. Please configure the report settings in the admin panel.');
        setLoading(false);
        return;
      }
      
      // Call the backend API to get embed token
      const response = await fetch('/api/powerbi/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          tenantId: config.tenantId,
          workspaceId: config.workspaceId,
          reportId: config.reportId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate embed token' }));
        throw new Error(errorData.error || 'Failed to generate embed token');
      }

      const embedData = await response.json();
      setEmbedInfo(embedData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  // Embed the report when embedInfo is available
  useEffect(() => {
    if (!embedInfo || !embedContainerRef.current || loading) {
      return;
    }

    // Set loading state
    setLoading(true);
    setError(null);

    try {
      // Initialize Power BI service (library is imported as module)
      if (!powerbiRef.current) {
        powerbiRef.current = new powerbi.service.Service(
          powerbi.factories.hpmFactory,
          powerbi.factories.wpmpFactory,
          powerbi.factories.routerFactory
        );
      }

      // Clear previous embed
      if (embedContainerRef.current && powerbiRef.current) {
        powerbiRef.current.reset(embedContainerRef.current);
      }

      // Configure embed settings
      const embedConfiguration: powerbi.IEmbedConfiguration = {
        type: 'report',
        id: embedInfo.reportId,
        embedUrl: embedInfo.embedUrl,
        accessToken: embedInfo.embedToken,
        tokenType: powerbi.models.TokenType.Embed,
        settings: {
          panes: {
            filters: { expanded: false, visible: true },
            pageNavigation: { visible: true },
          },
          background: powerbi.models.BackgroundType.Transparent,
        },
      };

      // Embed the report
      if (!embedContainerRef.current || !powerbiRef.current) {
        throw new Error('Container or Power BI service not available');
      }

      const report = powerbiRef.current.embed(embedContainerRef.current, embedConfiguration);

      // Handle embed events
      report.on('loaded', () => {
        console.log('Power BI report loaded successfully');
        setError(null);
        setLoading(false);
      });

      report.on('error', (event: any) => {
        console.error('Power BI embed error:', event);
        setError('Failed to embed Power BI report. Please check your configuration.');
        setLoading(false);
      });

    } catch (err) {
      console.error('Error embedding Power BI report:', err);
      setError('Failed to embed Power BI report: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setLoading(false);
    }

  }, [embedInfo, loading]);

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
            <div 
              ref={embedContainerRef}
              id={`powerbi-container-${item.id}`} 
              className={styles.powerbiContainer}
              style={{ width: '100%', height: '100%', minHeight: '600px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
