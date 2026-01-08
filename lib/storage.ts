import { MenuItem } from './types';

const STORAGE_KEY = 'portal_menu_items';

// Default menu items for demo
const DEFAULT_ITEMS: MenuItem[] = [
  {
    id: 'demo-copilot',
    name: 'Support Assistant',
    icon: 'MessageSquare',
    type: 'copilot',
    config: {
      embedUrl: 'https://copilotstudio.microsoft.com/environments/Default-xxxx',
    },
    order: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@admin.com',
  },
  {
    id: 'demo-powerbi',
    name: 'Sales Dashboard',
    icon: 'BarChart3',
    type: 'powerbi',
    config: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      tenantId: 'your-tenant-id',
      workspaceId: 'your-workspace-id',
      reportId: 'your-report-id',
    },
    order: 1,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@admin.com',
  },
];

export function getMenuItems(): MenuItem[] {
  if (typeof window === 'undefined') return DEFAULT_ITEMS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS;
  } catch {
    return DEFAULT_ITEMS;
  }
}

export function saveMenuItems(items: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): MenuItem {
  const items = getMenuItems();
  const newItem: MenuItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveMenuItems(items);
  return newItem;
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  const items = getMenuItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates };
  saveMenuItems(items);
  return items[index];
}

export function deleteMenuItem(id: string): boolean {
  const items = getMenuItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  
  saveMenuItems(filtered);
  return true;
}

export function reorderMenuItems(orderedIds: string[]): void {
  const items = getMenuItems();
  const reordered = orderedIds
    .map((id, index) => {
      const item = items.find((i) => i.id === id);
      if (item) return { ...item, order: index };
      return null;
    })
    .filter(Boolean) as MenuItem[];
  
  saveMenuItems(reordered);
}
