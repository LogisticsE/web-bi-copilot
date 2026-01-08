'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Sidebar from './Sidebar';
import ContentViewer from './ContentViewer';
import AdminPanel from './AdminPanel';
import { User, MenuItem } from '@/lib/types';
import { getMenuItems } from '@/lib/storage';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const items = getMenuItems();
    setMenuItems(items.sort((a, b) => a.order - b.order));
  };

  const handleMenuItemClick = (item: MenuItem) => {
    setActiveItem(item);
    setShowAdminPanel(false);
  };

  const handleAdminClick = () => {
    setShowAdminPanel(true);
    setActiveItem(null);
  };

  const handleItemsUpdated = () => {
    loadMenuItems();
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className={styles.dashboard}>
      <Sidebar
        user={user}
        menuItems={menuItems}
        activeItem={activeItem}
        collapsed={sidebarCollapsed}
        isAdmin={isAdmin}
        showAdminPanel={showAdminPanel}
        onItemClick={handleMenuItemClick}
        onAdminClick={handleAdminClick}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={onLogout}
      />
      
      <main className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        {showAdminPanel && isAdmin ? (
          <AdminPanel onItemsUpdated={handleItemsUpdated} />
        ) : activeItem ? (
          <ContentViewer item={activeItem} />
        ) : (
          <WelcomeScreen user={user} isAdmin={isAdmin} onAdminClick={handleAdminClick} />
        )}
      </main>
    </div>
  );
}

interface WelcomeScreenProps {
  user: User;
  isAdmin: boolean;
  onAdminClick: () => void;
}

function WelcomeScreen({ user, isAdmin, onAdminClick }: WelcomeScreenProps) {
  return (
    <div className={styles.welcomeScreen}>
      <div className={styles.welcomeContent}>
        <div className={styles.welcomeIcon}>
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="20" height="20" rx="4" fill="currentColor" opacity="0.9"/>
            <rect x="36" y="8" width="20" height="20" rx="4" fill="currentColor" opacity="0.5"/>
            <rect x="8" y="36" width="20" height="20" rx="4" fill="currentColor" opacity="0.5"/>
            <rect x="36" y="36" width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
          </svg>
        </div>
        <h1 className={styles.welcomeTitle}>
          Welcome back, <span className={styles.userName}>{user.name}</span>
        </h1>
        <p className={styles.welcomeSubtitle}>
          Select an item from the sidebar to get started
        </p>
        
        <div className={styles.quickActions}>
          {isAdmin && (
            <button className={styles.quickAction} onClick={onAdminClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Manage Menu Items</span>
            </button>
          )}
        </div>
        
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>Copilot Studio</h3>
            <p>Chat with AI assistants embedded directly in the portal</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3>Power BI Reports</h3>
            <p>Access interactive dashboards and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
