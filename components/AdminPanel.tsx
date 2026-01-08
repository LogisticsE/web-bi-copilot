'use client';

import { useState, useEffect } from 'react';
import styles from './AdminPanel.module.css';
import { MenuItem, MenuItemType, CopilotConfig, PowerBIConfig } from '@/lib/types';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/storage';

interface AdminPanelProps {
  onItemsUpdated: () => void;
}

const AVAILABLE_ICONS = [
  'MessageSquare',
  'Bot',
  'BarChart3',
  'PieChart',
  'LineChart',
  'Gauge',
  'Zap',
  'Database',
];

export default function AdminPanel({ onItemsUpdated }: AdminPanelProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const loadedItems = getMenuItems();
    setItems(loadedItems.sort((a, b) => a.order - b.order));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    loadItems();
    onItemsUpdated();
    setShowDeleteConfirm(null);
  };

  const handleSave = (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, item);
    } else {
      addMenuItem(item);
    }
    loadItems();
    onItemsUpdated();
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Menu Management</h1>
          <p className={styles.subtitle}>Add, edit, and organize menu items</p>
        </div>
        <button className={styles.createBtn} onClick={handleCreate}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Item
        </button>
      </div>

      <div className={styles.content}>
        {(isCreating || editingItem) ? (
          <ItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className={styles.itemsList}>
            {items.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                </div>
                <h3>No Menu Items</h3>
                <p>Create your first menu item to get started</p>
                <button className={styles.createBtnEmpty} onClick={handleCreate}>
                  Create First Item
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.itemCard}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={styles.itemInfo}>
                    <div className={`${styles.itemIcon} ${item.type === 'copilot' ? styles.copilot : styles.powerbi}`}>
                      {item.type === 'copilot' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="20" x2="18" y2="10"/>
                          <line x1="12" y1="20" x2="12" y2="4"/>
                          <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <span className={`${styles.itemType} ${item.type === 'copilot' ? styles.copilot : styles.powerbi}`}>
                        {item.type === 'copilot' ? 'Copilot Studio' : 'Power BI Report'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setShowDeleteConfirm(item.id)}
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                  
                  {/* Delete Confirmation */}
                  {showDeleteConfirm === item.id && (
                    <div className={styles.deleteConfirm}>
                      <p>Delete this item?</p>
                      <div className={styles.confirmActions}>
                        <button
                          className={styles.confirmBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                        <button
                          className={styles.cancelConfirmBtn}
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Item Form Component
interface ItemFormProps {
  item: MenuItem | null;
  onSave: (item: Omit<MenuItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const [name, setName] = useState(item?.name || '');
  const [icon, setIcon] = useState(item?.icon || 'MessageSquare');
  const [type, setType] = useState<MenuItemType>(item?.type || 'copilot');
  
  // Copilot config
  const [embedUrl, setEmbedUrl] = useState(
    item?.type === 'copilot' ? (item.config as CopilotConfig).embedUrl : ''
  );
  
  // Power BI config
  const [clientId, setClientId] = useState(
    item?.type === 'powerbi' ? (item.config as PowerBIConfig).clientId : ''
  );
  const [clientSecret, setClientSecret] = useState(
    item?.type === 'powerbi' ? (item.config as PowerBIConfig).clientSecret : ''
  );
  const [tenantId, setTenantId] = useState(
    item?.type === 'powerbi' ? (item.config as PowerBIConfig).tenantId : ''
  );
  const [workspaceId, setWorkspaceId] = useState(
    item?.type === 'powerbi' ? (item.config as PowerBIConfig).workspaceId : ''
  );
  const [reportId, setReportId] = useState(
    item?.type === 'powerbi' ? (item.config as PowerBIConfig).reportId : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const config: CopilotConfig | PowerBIConfig = type === 'copilot'
      ? { embedUrl }
      : { clientId, clientSecret, tenantId, workspaceId, reportId };

    onSave({
      name,
      icon,
      type,
      config,
      order: item?.order ?? 999,
      createdBy: 'admin@admin.com',
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>{item ? 'Edit Menu Item' : 'Create Menu Item'}</h2>
        <button type="button" className={styles.closeBtn} onClick={onCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className={styles.formContent}>
        {/* Basic Info */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sales Dashboard"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Icon</label>
            <div className={styles.iconGrid}>
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  className={`${styles.iconBtn} ${icon === iconName ? styles.selected : ''}`}
                  onClick={() => setIcon(iconName)}
                  title={iconName}
                >
                  <IconPreview name={iconName} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Type</label>
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === 'copilot' ? styles.active : ''}`}
                onClick={() => setType('copilot')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Copilot Studio
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === 'powerbi' ? styles.active : ''}`}
                onClick={() => setType('powerbi')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                Power BI
              </button>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            {type === 'copilot' ? 'Copilot Studio Configuration' : 'Power BI Configuration'}
          </h3>
          
          {type === 'copilot' ? (
            <div className={styles.formGroup}>
              <label className={styles.label}>Embed URL</label>
              <input
                type="url"
                className={styles.input}
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://copilotstudio.microsoft.com/environments/..."
                required
              />
              <p className={styles.hint}>
                Get this URL from Copilot Studio → Channels → Custom website
              </p>
            </div>
          ) : (
            <>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Client ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tenant ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Secret</label>
                <input
                  type="password"
                  className={styles.input}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Your client secret"
                  required
                />
                <p className={styles.hint}>
                  Keep this secure. In production, store this in environment variables.
                </p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Workspace ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={workspaceId}
                    onChange={(e) => setWorkspaceId(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Report ID</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={reportId}
                    onChange={(e) => setReportId(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    required
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.formFooter}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {item ? 'Update Item' : 'Create Item'}
        </button>
      </div>
    </form>
  );
}

// Icon Preview Component
function IconPreview({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    MessageSquare: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    Bot: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <circle cx="12" cy="5" r="2"/>
        <path d="M12 7v4"/>
      </svg>
    ),
    BarChart3: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
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
  
  return icons[name] || icons.MessageSquare;
}
