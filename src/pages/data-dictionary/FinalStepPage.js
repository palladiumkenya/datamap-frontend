import {Box, Button, Stack, Typography} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import MainCard from "../../components/MainCard";


const FinalStepPage = () => {
    const navigate = useNavigate();

    const handleFinish = () => {
        navigate('/dictionary/list');
    };

    const handlePublish = () => {
        navigate('/dictionary/list');
    };
    return (
        <React.Fragment>
            <MainCard sx={{ mt: 2 }} content={true} title={`Done`}>
                <Typography sx={{mt: 2, mb: 1}}>
                    Database Data Dictionary Added
                </Typography>
                <Typography sx={{mt: 2, mb: 1}}>
                    Next steps
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Box sx={{flex: '1 1 auto'}}/>
                    <Stack direction="row" spacing={2}>
                        <Button variant={`contained`} color={`success`} onClick={handleFinish}>Finish</Button>
                        <Button variant={`contained`} color={`info`} onClick={handlePublish}>Publish To MarketPlace</Button>
                    </Stack>
                </Box>
            </MainCard>
        </React.Fragment>
    )
}

export default FinalStepPage