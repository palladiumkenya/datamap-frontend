import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Alert, ListItemAvatar, Avatar, ListItemText, Typography
} from "@mui/material";
// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

import {DownloadOutlined, InfoCircleFilled, SendOutlined} from '@ant-design/icons';

import {useGetTransmissionHistory} from "../../../store/data-transmission/queries";
import moment from "moment/moment";




const TransmissionHistory = () =>{
    const {isPending, error, data } = useGetTransmissionHistory();

    if (isPending) return 'Loading...'

    if (error) {
        return <Alert color="error" icon={<InfoCircleFilled  />}>
            An error has occurred: Check your source DB/API connection in the Configurations page and make
            sure you can connect to it and then try again </Alert>
    }

    return(

        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>

                {data &&
                    data.map( (historicalData) => (
                        <TableRow>
                            <TableCell>
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            color: 'success.main',
                                            bgcolor: 'success.lighter'
                                        }}
                                    >
                                        {historicalData.action=="Sending" ? <SendOutlined /> : <DownloadOutlined /> }
                                    </Avatar>
                                </ListItemAvatar>
                            </TableCell>

                            <TableCell>
                                <ListItemText primary={<Typography variant="subtitle1">{historicalData.usl_repository_name}</Typography>} />
                            </TableCell>
                            <TableCell>
                                <ListItemText primary={<Typography variant="subtitle1">{historicalData.facility}</Typography>} secondary="Facility name" />
                            </TableCell>
                            <TableCell>
                                <ListItemText primary={<Typography variant="subtitle1">{historicalData.action}</Typography>} secondary="Action" />
                            </TableCell>
                            <TableCell>
                                <ListItemText primary={<Typography variant="subtitle1">{moment(historicalData.created_at).format('LL')}</Typography>} secondary="Started" />
                            </TableCell>
                            <TableCell>
                                <ListItemText primary={<Typography variant="subtitle1">{moment(historicalData.created_at).fromNow()}</Typography>} secondary="Days Ago" />
                            </TableCell>
                            </TableRow>
                    ) )
                }

            </TableBody>
        </Table>


    );
};

export default TransmissionHistory;
