import {
    Box,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useGetDataDictionaryTerm} from "../../../store/data-dictionary/queries";
import MainCard from "../../../components/MainCard";


const headCells = [
    {
        id: 'column',
        align: 'left',
        disablePadding: true,
        label: 'Column'
    },
    {
        id: 'data_type',
        align: 'left',
        disablePadding: true,
        label: 'data_type'
    },
    {
        id: 'is_required',
        align: 'left',
        disablePadding: true,
        label: 'is_required'
    },
    {
        id: 'description',
        align: 'left',
        disablePadding: false,
        label: 'Description'
    },
    {
        id: 'expected_values',
        align: 'left',
        disablePadding: false,
        label: 'Expected Values'
    },
];


const ViewDataDictionary = () => {
    const [selected] = useState([]);
    let [data, setData] = useState([]);
    const {dictionaryName} = useParams()
    const {isLoading, data: dictionaryTerms} = useGetDataDictionaryTerm(dictionaryName)


    useEffect(() => {
        if(!isLoading && dictionaryTerms){
            console.log(dictionaryTerms)

            setData(dictionaryTerms?.dictionary_terms)
        }
    }, [isLoading, dictionaryTerms]);

    const isSelected = (dict_name) => selected.indexOf(dict_name) !== -1;

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Box>
            <MainCard sx={{ mt: 2 }} content={false}>
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-of-type': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-of-type': {
                                pr: 3
                            }
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {headCells.map((headCell) => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.align}
                                        padding={headCell.disablePadding ? 'none' : 'normal'}
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!isLoading && (data)?.map((row, index) => {
                                const isItemSelected = isSelected(row.name);

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
                                    >
                                        <TableCell align="left">{row?.term}</TableCell>
                                        <TableCell align="left">{row?.data_type}</TableCell>
                                        <TableCell align="left">{row?.is_required ? 'yes': 'no'}</TableCell>
                                        <TableCell align="left">{row?.term_description}</TableCell>
                                        <TableCell align="left">{row?.expected_values}</TableCell>
                                        {/*<TableCell align="right">*/}

                                        {/*    <Tooltip  title={`Edit Dictionary Variables`}>*/}
                                        {/*        <IconButton aria-label="Edit">*/}
                                        {/*            <EditOutlined />*/}
                                        {/*        </IconButton>*/}
                                        {/*    </Tooltip>*/}
                                        {/*    <Tooltip  title={`Delete All Dictionary Variables`}>*/}
                                        {/*        <IconButton aria-label="Delete">*/}
                                        {/*            <DeleteOutlined />*/}
                                        {/*        </IconButton>*/}
                                        {/*    </Tooltip>*/}
                                        {/*</TableCell>*/}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </Box>
    )
}

export default ViewDataDictionary
