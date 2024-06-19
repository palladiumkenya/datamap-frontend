import { useState } from 'react';
import {
  Stack, Typography, TextField, Button, Box, Card, CardContent, IconButton, Tooltip,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Snackbar
} from '@mui/material';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Feedback() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

            <Typography variant="body1" component="p">
              Feedback:
            </Typography>
            <TextField
              id="outlined-feedback"
              label="Your feedback"
              placeholder="Let us know what you think..."
              multiline
              fullWidth
              variant="outlined"
              value={feedback}
              onChange={handleFeedbackChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                sx={{ textTransform: 'none' }}
                onClick={handleSendFeedback}
              >
                Send Feedback
              </Button>
            </Box>
            {feedbackError && (
              <Typography variant="body2" color="error" component="p">
                {feedbackError}
              </Typography>
            )}
            <Snackbar
              open={feedbackSent}
              autoHideDuration={6000}
              onClose={() => setFeedbackSent(false)}
              message="Feedback sent successfully!"
            />

        </Box>
      </Modal>
    </div>
  );
}

export default Feedback;
