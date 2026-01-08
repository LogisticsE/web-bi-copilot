'use client';

import styles from './Sidebar.module.css';
import { User, MenuItem } from '@/lib/types';

interface SidebarProps {
  user: User;
  menuItems: MenuItem[];
  activeItem: MenuItem | null;
  collapsed: boolean;
  isAdmin: boolean;
  showAdminPanel: boolean;
  onItemClick: (item: MenuItem) => void;
  onAdminClick: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const ICON_MAP: Record<string, JSX.Element> = {
  MessageSquare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  BarChart3: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  PieChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
      <path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  ),
  LineChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  ),
  Gauge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 14 4-4"/>
      <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
    </svg>
  ),
  Zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
};

function getIcon(iconName: string) {
  return ICON_MAP[iconName] || ICON_MAP.MessageSquare;
}

export default function Sidebar({
  user,
  menuItems,
  activeItem,
  collapsed,
  isAdmin,
  showAdminPanel,
  onItemClick,
  onAdminClick,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="14" height="14" rx="3" fill="currentColor" opacity="0.9"/>
            <rect x="22" y="4" width="14" height="14" rx="3" fill="currentColor" opacity="0.6"/>
            <rect x="4" y="22" width="14" height="14" rx="3" fill="currentColor" opacity="0.6"/>
            <rect x="22" y="22" width="14" height="14" rx="3" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        {!collapsed && <span className={styles.logoText}>Portal</span>}
        <button className={styles.collapseBtn} onClick={onToggleCollapse} title={collapsed ? 'Expand' : 'Collapse'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? (
              <polyline points="9 18 15 12 9 6"/>
            ) : (
              <polyline points="15 18 9 12 15 6"/>
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          {!collapsed && <span className={styles.navLabel}>Menu</span>}
          <ul className={styles.navList}>
            {menuItems.map((item, index) => (
              <li key={item.id} style={{ animationDelay: `${index * 50}ms` }}>
                <button
                  className={`${styles.navItem} ${activeItem?.id === item.id ? styles.active : ''}`}
                  onClick={() => onItemClick(item)}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={styles.navIcon}>
                    {getIcon(item.icon)}
                  </span>
                  {!collapsed && <span className={styles.navText}>{item.name}</span>}
                  {!collapsed && (
                    <span className={`${styles.navBadge} ${item.type === 'copilot' ? styles.copilot : styles.powerbi}`}>
                      {item.type === 'copilot' ? 'Chat' : 'BI'}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {isAdmin && (
          <div className={styles.navSection}>
            {!collapsed && <span className={styles.navLabel}>Admin</span>}
            <ul className={styles.navList}>
              <li>
                <button
                  className={`${styles.navItem} ${showAdminPanel ? styles.active : ''}`}
                  onClick={onAdminClick}
                  title={collapsed ? 'Manage Items' : undefined}
                >
                  <span className={styles.navIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </span>
                  {!collapsed && <span className={styles.navText}>Manage Items</span>}
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
          )}
        </div>
        <button className={styles.logoutBtn} onClick={onLogout} title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
