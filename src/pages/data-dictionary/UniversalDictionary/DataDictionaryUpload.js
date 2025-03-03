import {Box, Link, Typography} from "@mui/material";
import {useDropzone} from "react-dropzone";
import {useState} from "react";
import "./FileUpload.css";
import exampleCsv from './example.csv'
import {parseCSV} from "../../../helpers/parseCSV";


const DataDictionaryUpload = ({onNextStep}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        const reader = new FileReader();
        let parsedData = []
        reader.onload = () => {
            const csvData = reader.result;
            parsedData = parseCSV(csvData);
            onNextStep(parsedData)
        };
        reader.readAsText(acceptedFiles[0]);


    };


    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: ".csv", });

    return (
        <Box sx={{width: '100%'}}>
            <Typography sx={{mb: '25px'}}>
                Get csv template <Link href={exampleCsv} download={'example.csv'}>here</Link>
            </Typography>
            <div>
                <div className="dropzone-container">
                    <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        <p>Drag & drop a CSV file here or click to select a file</p>
                    </div>
                    {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                </div>
            </div>
        </Box>
    )
}

export default DataDictionaryUpload
