import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteDialog = ({ open, handleClose, handleDelete, text }) => {

    return (
        <Dialog
            // fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                {`Are you sure you want to delete ${text}?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`This action cannot be undone.`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleDelete} color={'error'}>
                    YES
                </Button>
                <Button onClick={handleClose} autoFocus>
                    NO
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteDialog