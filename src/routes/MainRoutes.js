import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import AddConfig from '../pages/configs/AddConfig';
import RepoConfigs from "../pages/mapper/RepoConfigs";

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const Configs = Loadable(lazy(() => import('pages/configs/Configs')));
const Selector = Loadable(lazy(() => import('pages/mapper/Mapper')));
const Indicators = Loadable(lazy(() => import('pages/mapper/BaseRepositories')));
const Text2SQL = Loadable(lazy(() => import('pages/text2sql/Text2Sql')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'text2sql',
      element: <Text2SQL />
    },
    // {
    //   path: 'Mapper',
    //   element: <Mapper />
    // },
    {
      path: 'Schema',
      children: [
        {
          path: 'Configs',
          element: <Indicators />
        },
        {
          path: 'Selector',
          element: <Selector />
        },
        {
          path: 'Config',
          element: <RepoConfigs />
        }
        ]
    },
    {
      path: 'configs',
      children: [
        {
          path: 'list',
          element: <Configs />
        },
        {
          path: 'add',
          element: <AddConfig />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    }
  ]
};

export default MainRoutes;
