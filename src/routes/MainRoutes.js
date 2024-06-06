import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import AddConfig from '../pages/configs/AddConfig';
import DictionaryConfigs from "../pages/indicator-selection/DictionaryConfigs";

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
const AddConfig = Loadable(lazy(() => import('pages/configs/AddConfig')));
const Selector = Loadable(lazy(() => import('pages/indicator-selection/Selector')));
const Indicators = Loadable(lazy(() => import('pages/indicator-selection/Indicators')));
const DataDictionary = Loadable(lazy(() => import('pages/data-dictionary/DataDictionary')));
const DictionaryConfigs = Loadable(lazy(() => import('pages/indicator-selection/DictionaryConfigs')));
const AddDataDictionary = Loadable(lazy(() => import('pages/data-dictionary/AddDataDictionary')));
const ViewDataDictionary = Loadable(lazy(() => import('pages/data-dictionary/ViewDataDictionary')));

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
    // {
    //   path: 'Selector',
    //   element: <Selector />
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
          element: <DictionaryConfigs />
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
      path: 'dictionary',
      children: [
        {
          path: `list`,
          element: <DataDictionary />
        },
        {
          path: `add`,
          element: <AddDataDictionary />
        },
        {
          path: `upload/:dictionaryName`,
          element: <AddDataDictionary />
        },
        {
          path: `view/:dictionaryName`,
          element: <ViewDataDictionary />
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
