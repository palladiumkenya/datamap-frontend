import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Chip,Typography } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
// import Logo from 'components/Logo';
import {DingdingOutlined} from '@ant-design/icons';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();

  return (
    // only available in paid version
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
        {/*<Logo />*/}
          <img src="OpendiveLogo.svg" alt="SVG Image" width="60" height="60"/>
          <Typography color="text.info" variant="h3">OpenDIVE</Typography>
        {/*<Chip*/}
        {/*  label={'OpenDIVE'}*/}
        {/*  size="medium"*/}
        {/*  sx={{ height: 26, '& .MuiChip-label': { fontSize: '0.925rem', py: 0.25 } }}*/}
        {/*  component="a"*/}
        {/*  href="/"*/}
        {/*  clickable*/}
        {/*/>*/}
      </Stack>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
