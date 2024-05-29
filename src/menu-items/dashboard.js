// assets
import { DashboardOutlined, SettingOutlined,BarChartOutlined,AppstoreAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined, SettingOutlined,BarChartOutlined, AppstoreAddOutlined
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
    },
    // {
    //   id: 'ind-selector',
    //   title: 'Indicator Selector',
    //   type: 'item',
    //   url: '/selector',
    //   icon: icons.AppstoreAddOutlined,
    //   breadcrumbs: true
    // },
    {
      id: 'indicators',
      title: 'Indicators',
      type: 'item',
      url: '/indicators',
      icon: icons.BarChartOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
