// assets
import { DashboardOutlined, SettingOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined, SettingOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Configurations',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'configuration',
      title: 'Configurations',
      type: 'item',
      url: '/configs/list',
      icon: icons.SettingOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
