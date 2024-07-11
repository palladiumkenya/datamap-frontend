import {Navigate, useRoutes} from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import USL from './USL';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([{ path: '/free', element: <Navigate to="/" /> },MainRoutes, LoginRoutes, USL]);
}
