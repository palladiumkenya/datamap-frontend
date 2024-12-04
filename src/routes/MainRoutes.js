import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
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
const USLConfigs = Loadable(lazy(() => import('pages/configs/USL/USLConfigs')));
const SchedulesConfigs = Loadable(lazy(() => import('pages/configs/Schedules/SchedulesConfigs')));
const SiteConfigs = Loadable(lazy(() => import('pages/configs/Site/SiteConfigs')));
const DataAccessConfigs = Loadable(lazy(() => import('pages/configs/DataAccess/DataAccessConfigs')));
const AddConfig = Loadable(lazy(() => import('pages/configs/DataAccess/AddConfig')));
const EditConfig = Loadable(lazy(() => import('pages/configs/DataAccess/UpdateConfig')));
// const Selector = Loadable(lazy(() => import('pages/indicator-selection/Selector')));
// const Indicators = Loadable(lazy(() => import('pages/indicator-selection/Indicators')));
const DataExtraction = Loadable(lazy(() => import('pages/data-extraction/DataExtraction')));
const DataDictionary = Loadable(lazy(() => import('pages/data-dictionary/DicitionarySync/DataDictionary')));
// const DictionaryConfigs = Loadable(lazy(() => import('pages/indicator-selection/DictionaryConfigs')));
const AddDataDictionary = Loadable(lazy(() => import('pages/data-dictionary/UniversalDictionary/AddDataDictionary')));
const ViewDataDictionary = Loadable(lazy(() => import('pages/data-dictionary/DicitionarySync/ViewDataDictionary')));
const Selector = Loadable(lazy(() => import('pages/mapper/Mapper')));
const Indicators = Loadable(lazy(() => import('pages/mapper/BaseRepositories')));
const Text2SQL = Loadable(lazy(() => import('pages/text2sql/Text2Sql')));
const AddSiteConfigs = Loadable(lazy(() => import('pages/configs/Site/AddSiteConfigs')));
const ViewSiteConfigs = Loadable(lazy(() => import('pages/configs/Site/ViewSiteConfigs')));

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
          path: '',
          element: <Configs />
        },
        {
          path: 'db/list',
          element: <DataAccessConfigs />
        },
        {
          path: 'db/add',
          element: <AddConfig />
        },
        {
          path: 'db/edit/:connection_id',
          element: <EditConfig />
        },
        {
          path: 'usl',
          element: <USLConfigs />
        },
        {
          path: 'scheduling',
          element: <SchedulesConfigs />
        },
        {
          path: 'site/add',
          element: <AddSiteConfigs />
        },
        {
          path: 'site',
          element: <ViewSiteConfigs />
        },
      ]
    },
    {
      path: 'extraction',
      element: <DataExtraction />
    },
    {
      path: 'dictionary',
      children: [
        {
          path: `list/:dataSource`,
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
