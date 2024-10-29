import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";




const card = (title, icon, action) => {
    return(
        <React.Fragment>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    {title}
                </Typography>
                <Box alignItems="center" display={'flex'} sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    verticalAlign: 'middle',
                    }}>
                    {icon}
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={action}>VIEW</Button>
            </CardActions>
        </React.Fragment>
    )
};

export default function ConfigCard(
    {
        title,
        icon,
        action
    }) {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleClick = (route) => {
        navigate(route);
    };
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card
                variant="outlined"
                sx={{
                    '& pre': {
                        m: 0,
                        p: '16px !important',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.75rem'
                    },
                    ':hover': {
                        boxShadow: theme.customShadows.z1
                    },
                }}
            >
                {card(title, icon, () => handleClick(action))}
            </Card>
        </Box>
    );
}
