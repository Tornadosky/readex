import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
  open: boolean;
  handleClose: (confirm: boolean) => void;
  actionConfirmation: {
    id: number; 
    name: string;
  };
  type: 'Book' | 'Section';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  handleClose,
  actionConfirmation,
  type,
}) => {
    const { name } = actionConfirmation;

    let title: string = "";
    let description: JSX.Element = <React.Fragment />;
    
    if (type === 'Book') {
      title = "Delete Book";
      description = (
        <React.Fragment>
          {'Are you sure you want to delete the book '} 
          <span className='alert-element-name'>{name}</span>
          ?
        </React.Fragment>
      );
    } else if (type === 'Section') {
      title = "Delete Section";
      description = (
        <React.Fragment>
          {'Are you sure you want to delete the section '}  
          <span className='alert-element-name'>{name}</span>
          ?
        </React.Fragment>
      );
    }
  
    const handleConfirm = () => {
      handleClose(true);
    };
  
    const handleCancel = () => {
      handleClose(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: '10px' } }}
        >
          <DialogTitle sx={{ color: 'black' }} id="alert-dialog-title">
          {title}
          </DialogTitle>
          <DialogContent>
              <DialogContentText sx={{ color: 'black' }} id="alert-dialog-description">
                  {description}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCancel} variant="outlined">Cancel</Button>
              <Button onClick={handleConfirm} variant="outlined" color="error" autoFocus>
                Delete
              </Button>
          </DialogActions>
        </Dialog>
    );
}
