import {Alert, Box, Button, Fab, LinearProgress, Typography} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {DataGrid} from "@mui/x-data-grid";
import {useState,useEffect} from "react";
import axios from "axios";
import {API_URL,STAGING_API} from "../../constants";
import SourceSystemInfo from "../mapper/source-system/SourceSystemInfo";
import {CloudUploadOutlined} from "@ant-design/icons";


const DataExtraction = ({baselookup}) =>{
    const [loadedData, setLoadedData] = useState([]);

    const [loadSuccessAlert, setLoadSuccessAlert] = useState(null);
    const [loadMessage, setLoadMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);

    const [spinner, setSpinner] = useState(null);
    const [sendingSpinner, setSendingSpinner] = useState(null);

    const [datagridcolumns, setColumns] =useState([])
    const [datagridrows, setRows] =useState([])
    const [baseSchemas, setBaseSchemas] = useState([]);
    const [isExpanded,setIsExpanded] = useState(false);

    const [progress, setProgress] = useState(null);
    const [socket, setSocket] = useState(null);

    const loadData = async (baseRepo) =>{
        setSpinner(true)
        setLoadSuccessAlert(false);

        await axios.get(API_URL+"/dictionary_mapper/load_data/"+baselookup).then((res)=> {
            // setLoadedData(res.data);
            const data = []
            data.push({ field: "id", headerName: "id", width: 130 },)
            Object.keys(res.data[0]).map(row => {
                data.push({ field: row, headerName: row, width: 130 },)
            })
            setColumns(data)

            const rowsWithIds = res.data.map((row, index) => ({ id: index, ...row }));
            setRows(rowsWithIds)
            // setRows(res.data)

            setSpinner(false);
            setAlertType("success");
            setLoadSuccessAlert(true);
            setLoadMessage("Successfully loaded "+baselookup+" data");
        }).catch( (error) => {
            setSpinner(false);
            setLoadSuccessAlert(true);
            setAlertType("error");
            setLoadMessage("Error loading ==> "+error);
        })
    }


    const verifyManifest = async (baseRepo) =>{
        setLoadSuccessAlert(false);
        setSendingSpinner(true)

        const manifest_response = await fetch(`${API_URL}/usl_data/manifest/repository/${baselookup}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            const data =  res.json().then(manifest => {
                console.log('manifest success-->', manifest);
                sendManifest(baseRepo, manifest);
            }); // Parse JSON error response

        }).catch( (error) => {
            console.log('manifest failed error-->', error)

            setSpinner(false);
            setSendingSpinner(false)
            setLoadSuccessAlert(true);
            setAlertType("error");
            setLoadMessage("Error creating manifest ==> "+error);
        });
    }

    const sendManifest= async (baseRepo, manifest) => {
        console.log("manifest to send ,",manifest)
        try {
            const response = await fetch(`https://4ca2-41-80-117-126.ngrok-free.app/api/staging/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(manifest)
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse JSON error response
                setSpinner(false);
                setLoadSuccessAlert(true);
                setAlertType("error");
                setLoadMessage("Error verifying endpoint ==> " + errorData.detail);

            }

            setLoadSuccessAlert(true);
            setAlertType("success");
            setLoadMessage("Successfully verified " + baselookup + " endpoint. We are now starting to send");
            sendData(baseRepo)

        } catch (error) { //try catch block

            console.log("Error sending Manifes. ERROR: ==> " + error)
        }
    }

    const sendData = async (baseRepo) =>{
        const data={}
        try {
            // const res = await fetch(`https://4459-165-90-30-222.ngrok-free.app/api/staging/usl/${baseRepo}`, {
            const response = await fetch(`${API_URL}/usl_data/send/usl/${baseRepo}`);
            console.log("response -->", response)
            if (!response.ok) {
                const errorData = await response.json(); // Parse JSON error response
                setSendingSpinner(false);
                setLoadSuccessAlert(true);
                setAlertType("error");
                setLoadMessage("Error sending ==> "+errorData.detail);

            }

            ProgressUpdate();

            const result = await response.json(); // Process successful response
            setLoadSuccessAlert(true);
            setSendingSpinner(false);
            setAlertType("success");
            setLoadMessage("Sending completed");

        } catch (error) {
            const errorData = await response.json(); // Parse JSON error response
            setSendingSpinner(false);
            setLoadSuccessAlert(true);
            setAlertType("error");
            console.log("Error sending ==> "+error)
        }
    }

    function ProgressUpdate() {
        setProgress(0); // Reset progress to 0
        const newSocket = new WebSocket("ws://localhost:8000/api/usl_data/ws/progress");

        // Set up the WebSocket connection
        newSocket.onmessage = function (event) {
            setProgress(Number(event.data)); // Update progress on receiving message
        };

        newSocket.onclose = function () {
            console.log("WebSocket connection closed");
        };

        // Save the socket instance so we can close it later if needed
        setSocket(newSocket);
    }

    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);
    // useEffect(() => {
    //     const ws = new WebSocket("ws://localhost:8000/api/usl_data/ws/progress");
    //
    //     ws.onmessage = (event) => {
    //         setProgress(event.data); // Update progress
    //         console.log("event.data ==>",event.data)
    //     };
    //
    //     ws.onclose = () => {
    //         console.log("WebSocket connection closed");
    //     };
    //
    //     return () => ws.close();
    // }, []);



    return (
        <>
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">

                    <Fab color="info" variant="extended" onClick={()=>loadData(baselookup)}>
                        Generate / Load
                        {spinner ?
                            <CircularProgress style={{"color":"black"}} size="1rem"/>
                            :
                            <></>
                        }
                    </Fab>
                    {loadSuccessAlert &&
                        <Alert color={alertType} onClose={() => {}}>
                            {loadMessage}
                        </Alert>
                    }

                </Typography>
                <Typography variant="h6">
                    {baselookup} Count: <b  style={{"color":"#13c2c2"}}>{datagridrows.length}</b>

                    <Button variant="outlined" color="success" size="extraSmall" onClick={()=>verifyManifest(baselookup)} style={{"marginLeft":"50px"}}>
                        Send To WareHouse
                    </Button>
                    {sendingSpinner &&
                        <CircularProgress style={{"color":"black"}} size="2rem"/>
                    }
                </Typography>
                {/*<Typography variant="h6">Date: <b style={{"color":"#13c2c2"}}>{txcurr.indicator_date}</b></Typography>*/}
            </Box>
            <Box sx={{ width: '100%' }}>
                { progress >0 &&
                    <LinearProgress variant="determinate" value={progress} />
                }
                <div>Progress Update: {progress}</div>
                { datagridrows.length >0 &&
                    <div>
                        <DataGrid
                            rows={datagridrows}
                            columns={datagridcolumns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10, 50]}

                        />
                    </div>
                }

            </Box>
        </>
    )
}

export default DataExtraction;
