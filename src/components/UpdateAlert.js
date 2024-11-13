import {Alert, AlertTitle, Box, Collapse, IconButton, Link} from "@mui/material";
import {CloseOutlined} from "@ant-design/icons";
import {useState} from "react";


const UpdateAlert = ({message, color, isOpen}) =>{
    const [open, setOpen] = useState(isOpen);

    return (
        <Box sx={{width: '100%'}}>
            <Collapse in={open}>
                <Alert
                    severity={color}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseOutlined fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    <AlertTitle>{color}</AlertTitle>
                    {message} Sync changes <Link href={'/configs/db/list'}>here.</Link>
                </Alert>
            </Collapse>
        </Box>
    );
}

export default UpdateAlert
