// Importations React et Material-UI
import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Composant réutilisable pour les dialogs de confirmation
// Props:
// - open: boolean pour afficher le dialog
// - title: titre du dialog
// - message: message de confirmation
// - onConfirm: callback au clic sur OK
// - onCancel: callback au clic sur Annuler
// - confirmText: texte du bouton OK (par défaut "Supprimer")
// - cancelText: texte du bouton Annuler (par défaut "Annuler")
// - isLoading: boolean pour désactiver les boutons pendant une opération
export default function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Supprimer',
    cancelText = 'Annuler',
    isLoading = false,
    confirmColor = 'error'
}) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onCancel}
                    disabled={isLoading}
                    variant="outlined"
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    autoFocus
                    disabled={isLoading}
                    variant="contained"
                    color={confirmColor}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
