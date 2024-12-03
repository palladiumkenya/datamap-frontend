import {Alert, Box, Button, Fab, LinearProgress, Typography} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {DataGrid} from "@mui/x-data-grid";
import {useState,useEffect} from "react";
import axios from "axios";
import {API_URL, STAGING_API, WS_API} from "../../constants";



const DataExtraction = ({baseRepo}) =>{
    const [loadedData, setLoadedData ] =useState([]);

    const [loadSuccessAlert, setLoadSuccessAlert] = useState(null);
    const [loadMessage, setLoadMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);

    const [spinner, setSpinner] = useState(null);
    const [sendingSpinner, setSendingSpinner] = useState(null);

    const [datagridcolumns, setColumns] =useState([])
    const [datagridrows, setRows] =useState([])

    const [progress, setProgress] = useState(null);
    const [socket, setSocket] = useState(null);


    // const {isPending, error, data } = useQuery({
    //     queryKey: ['baseRepo', baseRepo],
    //     queryFn: ()=> useGetRepositoryLoadedData(baseRepo),
    // })
    //
    // if (isPending) return 'Loading...'
    //
    // if (error) {
    //     console.log("error==>",error)
    //     return <Alert color="error" icon={<InfoCircleFilled  />}>
    //         An error has occurred: Check your source DB/API connection in the Configurations page and make
    //         sure you can connect to it and then try again </Alert>
    // }
    //
    // if(data && !Array.isArray(data))  setLoadedRepoData(data)



    const loadData = async (baseRepo) =>{
        setSpinner(true)
        setLoadSuccessAlert(false);

        await axios.get(API_URL+"/dictionary_mapper/load_data/"+baseRepo).then((res)=> {
            // const data = []
            // data.push({ field: "id", headerName: "id", width: 130 },)
            // Object.keys(res.data[0]).map(row => {
            //     data.push({ field: row, headerName: row, width: 130 },)
            // })
            // setColumns(data)
            //
            // const rowsWithIds = res.data.map((row, index) => ({ id: index, ...row }));
            // setRows(rowsWithIds)
            setLoadedRepoData(res.data)

            setSpinner(false);
            setAlertType("success");
            setLoadSuccessAlert(true);
            setLoadMessage("Successfully loaded "+baseRepo+" data");
        }).catch( (error) => {
            setSpinner(false);
            setLoadSuccessAlert(true);
            setAlertType("error");
            setLoadMessage("Error loading ==> "+error);
        })
    }

    const setLoadedRepoData=async(repoData)=>{
        const data = []
        data.push({ field: "id", headerName: "id", width: 130 },)
        Object.keys(repoData[0]).map(row => {
            data.push({ field: row, headerName: row, width: 130 },)
        })
        setColumns(data)

        const rowsWithIds = repoData.map((row, index) => ({ id: index, ...row }));
        setRows(rowsWithIds)
    }


    const verifyManifest = async (baseRepo) =>{
        setLoadSuccessAlert(false);
        setSendingSpinner(true)

        const manifest_response = await fetch(`${API_URL}/usl_data/manifest/repository/${baseRepo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            const data =  res.json().then(manifest => {
                sendManifest(baseRepo, manifest);
            }); // Parse JSON error response

        }).catch( (error) => {

            setSpinner(false);
            setSendingSpinner(false)
            setLoadSuccessAlert(true);
            setAlertType("error");
            setLoadMessage("Error creating manifest ==> "+error);
        });
    }

    const sendManifest= async (baseRepo, manifest) => {
        try {
            const response = await fetch(`${STAGING_API}/api/staging/verify`, {
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
            setLoadMessage("Successfully verified " + baseRepo + " endpoint. We are now starting to send");
            sendData(baseRepo, manifest)

        } catch (error) {
            setAlertType("error");
            setLoadMessage("Error sending Manifes. ERROR: ==> "+error);
        }
    }


    function sendData(baseRepo, manifest) {

        console.log("sending data... ")

        setProgress(0); // Reset progress to 0
        const newSocket = new WebSocket(`ws://${WS_API}/api/usl_data/ws/progress/${baseRepo}`);

        newSocket.onopen = () => {
            newSocket.send(JSON.stringify(manifest));
        };
        // Set up the WebSocket connection
        newSocket.onmessage = function (event) {
            console.log("ws connection established ")

            const data = event.data;
            if (data.includes("Error")) {
                console.error(data);
                newSocket.close();
            } else {
                setProgress(Number(data.replace("%", ""))); // Update progress
            }
        };

        newSocket.onerror = function (error) {
            console.log("connection failed with error: ", error)
        };

        newSocket.onclose = function () {
            console.log("ws connection closed");
            setSendingSpinner(false);
            setAlertType("success");
            setLoadMessage("Sending completed");
        };

        setSocket(newSocket);
    }



    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);




    return (
        <>
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">

                    <Fab color="info" variant="extended" onClick={()=>loadData(baseRepo)}>
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
                    {baseRepo} Count: <b  style={{"color":"#13c2c2"}}>{datagridrows.length}</b>

                    <Button variant="outlined" color="success" size="extraSmall" onClick={()=>verifyManifest(baseRepo)} style={{"marginLeft":"50px"}}>
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
                    <>
                    <LinearProgress variant="determinate" value={progress} />
                    <div>Sending Progress: {progress}%</div>
                    </>
                }

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
