// assets
import { DashboardOutlined, SettingOutlined,BarChartOutlined,AppstoreAddOutlined, ExperimentOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined, SettingOutlined,BarChartOutlined, AppstoreAddOutlined, ExperimentOutlined
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
      url: '/configs',
      icon: icons.SettingOutlined,
      breadcrumbs: true
    },
    // {
    //   id: 'ind-selector',
    //   title: 'Indicator Mapper',
    //   type: 'item',
    //   url: '/selector',
    //   icon: icons.AppstoreAddOutlined,
    //   breadcrumbs: true
    // },
    {
      id: 'indicators',
      title: 'Base Repositories',
      type: 'item',
      url: '/Schema/Configs',
      icon: icons.BarChartOutlined,
      breadcrumbs: true
    },
    {
      id: 'text2SQL',
      title: 'TAFSIRI',
      type: 'item',
      url: '/text2sql',
      icon: icons.ExperimentOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
