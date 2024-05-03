import * as React from 'react';
import {useState} from "react";

// material-ui
import {Box, Button, Typography} from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import DatabaseSelect from "./DatabaseSelect";
import ConnectionDetails from "./ConnectionDetails";
import MainCard from "components/MainCard";
import SaveConfig from "./SaveConfig";



const steps = ['Select Database', 'Connection Details', 'Save Configuration'];

const titles = ['Select Database Type', 'Connection Details', 'Save Configuration']
const AddConfigs = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [selectedDriver, setSelectedDriver] = useState('');

    const handleNext = () => {
        let newSkipped = skipped;

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const handleReset = () => {
        setActiveStep(0);
    };

    const onNextStep = (driver) => {
        setSelectedDriver(driver);
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
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <MainCard sx={{ mt: 2 }} content={true} title={titles[activeStep]}>
                        {activeStep === 0 && <DatabaseSelect onNextStep={onNextStep} />}
                        {activeStep === 1 && <ConnectionDetails driver={selectedDriver} />}
                        {activeStep === 2 && <SaveConfig driver={selectedDriver} />}
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

                        <Button variant={'contained'} onClick={handleNext} disabled={activeStep === 0}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
};

export default AddConfigs;
