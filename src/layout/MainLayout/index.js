import React, {useContext, useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {Navigate, Outlet} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

// material-ui
import {useTheme} from '@mui/material/styles';
import {Box, Toolbar, useMediaQuery} from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import {openDrawer} from 'store/reducers/menu';
import {AlertDictionaryVersionsContext} from "../../contexts/UniversalDictionaryVersionsContext";
import UpdateAlert from "../../components/UpdateAlert";
import {useRefreshAccessToken} from "../../store/auth/mutations";

// ==============================|| MAIN LAYOUT ||============================== //

const isAuthenticated = () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
        return false
    }
    try {
        const {exp} = jwtDecode(token)
        const currentTime = Date.now() / 1000
        return exp > currentTime
    } catch (err){
        return false
    }
}


const MainLayout = () => {
    const theme = useTheme();
    const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
    const dispatch = useDispatch();
    const {activeAlert} = useContext(AlertDictionaryVersionsContext);
    const refreshToken = useRefreshAccessToken()

    const {drawerOpen} = useSelector((state) => state.menu);

    // drawer toggler
    const [open, setOpen] = useState(drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        dispatch(openDrawer({drawerOpen: !open}));
    };

    // set media wise responsive drawer
    useEffect(() => {
        setOpen(!matchDownLG);
        dispatch(openDrawer({drawerOpen: !matchDownLG}));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownLG]);

    useEffect(() => {
        if (open !== drawerOpen) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen]);

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            const token = localStorage.getItem('access_token');

            if (token) {
                try {
                    const { exp } = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // Convert to seconds
                    // Refresh the token if it's expired or close to expiring
                    if (exp < currentTime + 60) {
                        await refreshToken.mutateAsync()
                    }
                } catch (error) {
                    console.error('Token decoding failed:', error);
                }
            }
        };

        checkAndRefreshToken();
        // Set up a periodic check
        const interval = setInterval(() => {
            checkAndRefreshToken();
        }, 30 * 60 * 1000); // Every 30 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        isAuthenticated() ? (
            <Box sx={{display: 'flex', width: '100%'}}>
                <Header open={open} handleDrawerToggle={handleDrawerToggle}/>
                <Drawer open={open} handleDrawerToggle={handleDrawerToggle}/>
                <Box component="main" sx={{width: '100%', flexGrow: 1, p: {xs: 2, sm: 3}}}>
                    <Toolbar/>
                    {activeAlert.show && (
                        <UpdateAlert message={activeAlert.message} color={activeAlert.color} isOpen={activeAlert.show}/>
                    )}
                    <Breadcrumbs navigation={navigation} title/>
                    <Outlet/>
                </Box>
            </Box>
        ) : <Navigate to={'/login'} replace/>
    );
};

export default MainLayout;
