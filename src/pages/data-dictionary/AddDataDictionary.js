import MainCard from "../../components/MainCard";
import {Box, Button, Typography} from "@mui/material";
import {useState} from "react";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import * as React from "react";
import FinalStepPage from "./FinalStepPage";
import DataDictionaryUpload from "./DataDictionaryUpload";
import ValidateDataDictionaryFile from "./ValidateDataDictionaryFile";


const steps = ['Select CSV File', 'Preview Data'];

const titles = ['Select CSV File To Upload', 'Preview Data']

const AddDataDictionary = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [terms, setTerms] = useState(null)

    const handleNext = () => {
        let newSkipped = skipped;

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const onNextStep = (file) => {
        setTerms(file)
        handleNext();
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Typography>
                Import Data Dictionary Terms
            </Typography>
            <MainCard content={true}>
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
                            {activeStep === 0 && <DataDictionaryUpload onNextStep={onNextStep} />}
                            {activeStep === 1 && <ValidateDataDictionaryFile file={terms} onFinish={handleNext} />}
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

            </MainCard>
        </Box>
    )
}

export default AddDataDictionary