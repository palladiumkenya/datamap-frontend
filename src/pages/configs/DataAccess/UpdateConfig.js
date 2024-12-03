import * as React from 'react';
import {useState} from "react";

// material-ui
import { Box, Button } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import EditConnectionDetails from "./EditConnectionDetails";
import SaveUpdatedConfig from "./SaveUpdatedConfig";
import MainCard from "components/MainCard";
import FinalStepPage from "./FinalStepPage";
import {useGetAccessConfig} from "../../../store/access_configurations/queries";
import {useParams} from "react-router-dom";


const steps = ['Connection Details', 'Save Updates'];

const titles = ['Connection Details', 'Save Updates']
const UpdateConfig = () => {
    const { connection_id } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [connString, setConnString] = useState('');
    const {data, isLoading} = useGetAccessConfig(connection_id)

    if(isLoading) {
        return <></>
    }

    const handleNext = () => {
        let newSkipped = skipped;

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const onNextStep = (driver) => {
        setConnString(driver);
        handleNext();
    };
    return (

        <Box sx={{width: '100%'}}>

            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <FinalStepPage />
            ) : (
                <React.Fragment>
                    <MainCard sx={{ mt: 2 }} content={true} title={titles[activeStep]}>
                        {activeStep === 0 && <EditConnectionDetails  onNextStep={onNextStep} data={data?.conn_string} />}
                        {activeStep === 1 && <SaveUpdatedConfig connString={connString} onFinish={handleNext} data={data?.name} id={connection_id}/>}
                    </MainCard>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Button
                            color="inherit"
                            variant={'contained'}
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Back
                        </Button>
                        <Box sx={{flex: '1 1 auto'}}/>

                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
};

export default UpdateConfig;
