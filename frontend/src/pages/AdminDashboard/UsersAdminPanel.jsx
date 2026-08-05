// ===== PANEL D'ADMINISTRATION DES UTILISATEURS =====
// Composant spécialisé pour la gestion des utilisateurs (création, édition, suppression)
import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Chip from '@mui/material/Chip'
import { getUsers, createUser, updateUser, deleteUser } from '../../services/usersService'
import ConfirmDialog from '../../components/ConfirmDialog'

// Composant pour gérer les utilisateurs (création, édition, suppression)
export default function UsersAdminPanel({ onSnack }) {
    // État du panel
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [userForm, setUserForm] = useState({ id: null, email: '', username: '', password: '', isAdmin: false })
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

    // Charger les utilisateurs au montage
    React.useEffect(() => {
        loadUsers()
    }, [])

    // Charger les utilisateurs
    async function loadUsers() {
        setLoading(true)
        try {
            const data = await getUsers()
            setUsers(data)
        } finally {
            setLoading(false)
        }
    }

    // Enregistrer un utilisateur (créer ou modifier)
    async function handleSave() {
        try {
            const userData = { email: userForm.email, username: userForm.username, isAdmin: userForm.isAdmin }
            if (userForm.password) userData.password = userForm.password

            if (userForm.id) {
                await updateUser(userForm.id, userData)
                onSnack({ message: 'Utilisateur mis à jour', severity: 'success' })
            } else {
                if (!userForm.password) {
                    onSnack({ message: 'Mot de passe requis pour création', severity: 'error' })
                    return
                }
                await createUser(userData)
                onSnack({ message: 'Utilisateur créé', severity: 'success' })
            }
            setUserForm({ id: null, email: '', username: '', password: '', isAdmin: false })
            loadUsers()
        } catch (e) {
            onSnack({ message: e.message || 'Erreur', severity: 'error' })
        }
    }

    // Supprimer un utilisateur (ouvre le dialog de confirmation)
    function handleDelete(id) {
        setDeleteDialog({ open: true, id })
    }

    // Confirmer la suppression de l'utilisateur
    async function confirmDelete() {
        const id = deleteDialog.id
        setLoading(true)
        try {
            await deleteUser(id)
            onSnack({ message: 'Utilisateur supprimé', severity: 'success' })
            loadUsers()
            setDeleteDialog({ open: false, id: null })
        } catch (e) {
            onSnack({ message: e.message || 'Erreur', severity: 'error' })
            setDeleteDialog({ open: false, id: null })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            {/* Formulaire de création/édition */}
            <Box sx={{ flex: 1 }}>
                <Card>
                    <CardContent sx={{ px: 3, py: 3, position: 'sticky', top: 96 }}>
                        <Typography variant="h6">Nouvel utilisateur</Typography>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Email"
                                type="email"
                                value={userForm.email}
                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                label="Nom utilisateur"
                                value={userForm.username}
                                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                label="Mot de passe"
                                type="password"
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                fullWidth
                                size="small"
                                helperText={userForm.id ? "Laisser vide pour ne pas changer" : "Requis pour création"}
                            />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox checked={userForm.isAdmin} onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })} />}
                                label="Admin"
                            />
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
                            <Button onClick={() => setUserForm({ id: null, email: '', username: '', password: '', isAdmin: false })}>Annuler</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Liste des utilisateurs */}
            <Box sx={{ flex: 1 }}>
                <Card sx={{ minHeight: 520, width: '100%' }}>
                    <CardContent sx={{ px: 4, py: 3 }}>
                        <Typography variant="h6">Liste des utilisateurs</Typography>
                        {loading && <Typography>Chargement…</Typography>}
                        <Box sx={{ mt: 2 }}>
                            {users.map((u, index) => (
                                <Box
                                    key={u.idUtilisateur || u.id || index}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1.5, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                                >
                                    <Box sx={{ pr: 1 }}>
                                        <Typography sx={{ fontWeight: 700 }}>{u.username || u.nomUtilisateur}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{u.email}</Typography>
                                        <Box sx={{ mt: 1 }}>
                                            {u.role && u.role.toUpperCase().includes('ADMIN') ? (
                                                <Chip label={u.role.toUpperCase()} color="warning" variant="filled" size="small" sx={{ fontWeight: 700 }} />
                                            ) : (
                                                <Chip label={u.role ? u.role.toUpperCase() : 'USER'} color="info" variant="filled" size="small" sx={{ fontWeight: 700 }} />
                                            )}
                                        </Box>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => setUserForm({ id: u.idUtilisateur || u.id, email: u.email || '', username: u.username || u.nomUtilisateur, password: '', isAdmin: u.isAdmin || false })}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(u.idUtilisateur || u.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Dialog de confirmation pour la suppression */}
            <ConfirmDialog
                open={deleteDialog.open}
                title="Supprimer l'utilisateur ?"
                message="Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ open: false, id: null })}
                isLoading={loading}
                confirmColor="error"
            />
        </Box>
    )
}
