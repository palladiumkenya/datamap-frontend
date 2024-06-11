import * as React from 'react';
import {useState} from "react";

// material-ui
import { Box, Button } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import ConnectionDetails from "./ConnectionDetails";
import MainCard from "components/MainCard";
import SaveConfig from "./SaveConfig";
import FinalStepPage from "./FinalStepPage";


const steps = ['Connection Details', 'Save Configuration'];

const titles = ['Connection Details', 'Save Configuration']
const AddConfigs = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [connString, setConnString] = useState('');

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
                        {activeStep === 0 && <ConnectionDetails  onNextStep={onNextStep} />}
                        {activeStep === 1 && <SaveConfig connString={connString} onFinish={handleNext} />}
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

export default AddConfigs;
