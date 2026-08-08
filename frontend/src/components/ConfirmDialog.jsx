import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Supprimer', cancelText = 'Annuler', isLoading = false, confirmColor = 'error' }) {
    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" maxWidth="sm" fullWidth>
            <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 750, pt: 3 }}>{title}</DialogTitle>
            <DialogContent><DialogContentText id="confirm-dialog-description">{message}</DialogContentText></DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={onCancel} disabled={isLoading}>{cancelText}</Button><Button onClick={onConfirm} autoFocus disabled={isLoading} variant="contained" color={confirmColor}>{confirmText}</Button></DialogActions>
        </Dialog>
    )
}
