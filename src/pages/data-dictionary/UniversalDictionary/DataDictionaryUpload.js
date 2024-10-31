import {Box} from "@mui/material";
import {useDropzone} from "react-dropzone";
import {useState} from "react";
import "./FileUpload.css";


const DataDictionaryUpload = ({onNextStep}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const parseCSV = (csvData) => {
        const rows = csvData.split("\n"); // Split CSV data into rows
        let headers = rows[0].split(","); // Assuming the first row contains headers
        headers = headers.map(h => h.replace(/\r/g, ""));

        const result = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const obj = {};
            let currentField = '';
            let insideQuotes = false;

            for (let j = 0; j < row.length; j++) {
                const char = row[j];
                const nextChar = row[j + 1];

                if (char === '"') {
                    if (insideQuotes && nextChar === '"') {
                        currentField += '"';
                        j++; // Skip the next quote
                    } else {
                        insideQuotes = !insideQuotes;
                    }
                } else if (char === ',' && !insideQuotes) {
                    obj[headers[Object.keys(obj).length]] = currentField.trim();
                    currentField = '';
                } else {
                    currentField += char;
                }
            }

            // Add the last field to the object
            obj[headers[Object.keys(obj).length]] = currentField.trim();
            result.push(obj);
        }

        return result;
    };

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
