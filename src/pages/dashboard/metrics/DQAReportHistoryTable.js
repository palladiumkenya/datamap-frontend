import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    ListItemText,
    Typography,
    TableHead,
    Skeleton, TablePagination
} from "@mui/material";

import moment from "moment/moment";
import {useGetDQAReportDashboard} from "../../../store/dashboard/queries";
import {useMemo, useState} from "react";




const DQAReportHistoryTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {isLoading, error, data } = useGetDQAReportDashboard();

    const visibleRows = useMemo(
        () =>
            data?.dqa_report ? [...data?.dqa_report]
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [],
        [page, rowsPerPage, data],
    );
    if (isLoading) return <Skeleton variant="rectangular" />
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.dqa_report.length) : 0;


    return(
        <>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Base Table</TableCell>
                        <TableCell>Dictionary Version</TableCell>
                        <TableCell>Total Rows</TableCell>
                        <TableCell>Valid Rows</TableCell>
                        <TableCell>Invalid Rows</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {data?.dqa_report &&
                        visibleRows.map( (dqa, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <ListItemText primary={<Typography variant="subtitle1">{dqa.base_table_name}</Typography>} />
                                </TableCell>
                                <TableCell>
                                    <ListItemText primary={<Typography variant="subtitle1">{dqa.dictionary_version}</Typography>} />
                                </TableCell>
                                <TableCell>
                                    <ListItemText primary={<Typography variant="subtitle1">{dqa.total_rows}</Typography>} />
                                </TableCell>
                                <TableCell>
                                    <ListItemText primary={<Typography variant="subtitle1">{dqa.valid_rows}</Typography>} />
                                </TableCell>
                                <TableCell>
                                    <ListItemText primary={<Typography variant="subtitle1">{dqa.invalid_rows}</Typography>}  />
                                </TableCell>
                                <TableCell>
                                    <ListItemText primary={<Typography variant="subtitle1">{moment(dqa.created_at).format('LL')}</Typography>} />
                                </TableCell>

                            </TableRow>
                        ) )
                    }

                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data?.dqa_report.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>


    );
};

export default DQAReportHistoryTable;
