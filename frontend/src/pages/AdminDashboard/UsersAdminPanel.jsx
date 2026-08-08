import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import { AdminListItem, AdminPanelLayout } from '../../components/AdminPanelLayout'
import ConfirmDialog from '../../components/ConfirmDialog'
import { createUser, deleteUser, getUsers, updateUser } from '../../services/usersService'

const emptyForm = { id: null, email: '', username: '', password: '', isAdmin: false }

export default function UsersAdminPanel({ onSnack }) {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [userForm, setUserForm] = useState(emptyForm)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
    const loadUsers = async () => { setLoading(true); try { setUsers(await getUsers()) } finally { setLoading(false) } }
    useEffect(() => { loadUsers() }, [])

    const handleSave = async () => {
        if (!userForm.username.trim() || (!userForm.id && !userForm.password)) return onSnack({ message: 'Le nom et le mot de passe sont requis.', severity: 'error' })
        const data = { email: userForm.email, username: userForm.username, isAdmin: userForm.isAdmin }
        if (userForm.password) data.password = userForm.password
        try {
            if (userForm.id) { await updateUser(userForm.id, data); onSnack({ message: 'Utilisateur mis à jour', severity: 'success' }) }
            else { await createUser(data); onSnack({ message: 'Utilisateur créé', severity: 'success' }) }
            setUserForm(emptyForm); loadUsers()
        } catch (error) { onSnack({ message: error.message || 'Erreur', severity: 'error' }) }
    }
    const confirmDelete = async () => {
        setLoading(true)
        try { await deleteUser(deleteDialog.id); onSnack({ message: 'Utilisateur supprimé', severity: 'success' }); await loadUsers() }
        catch (error) { onSnack({ message: error.message || 'Erreur', severity: 'error' }) }
        finally { setDeleteDialog({ open: false, id: null }); setLoading(false) }
    }

    const form = <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Adresse e-mail" type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} fullWidth />
        <TextField label="Nom d’utilisateur" value={userForm.username} onChange={(event) => setUserForm({ ...userForm, username: event.target.value })} fullWidth />
        <TextField label="Mot de passe" type="password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} helperText={userForm.id ? 'Laisser vide pour conserver le mot de passe.' : 'Requis à la création.'} fullWidth />
        <FormControlLabel control={<Checkbox checked={userForm.isAdmin} onChange={(event) => setUserForm({ ...userForm, isAdmin: event.target.checked })} />} label="Accès administrateur" />
        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}><Button variant="contained" color="secondary" onClick={handleSave}>{userForm.id ? 'Mettre à jour' : 'Créer l’utilisateur'}</Button>{userForm.id && <Button onClick={() => setUserForm(emptyForm)}>Annuler</Button>}</Box>
    </Box>

    return <>
        <AdminPanelLayout formTitle={userForm.id ? 'Modifier le compte' : 'Nouvel utilisateur'} formSubtitle="Accès" form={form} listTitle="Utilisateurs actifs" count={users.length} loading={loading}>
            {users.map((user, index) => {
                const id = user.idUtilisateur || user.id
                const isAdmin = user.isAdmin || user.role?.toUpperCase().includes('ADMIN')
                return <AdminListItem key={id || index} title={user.username || user.nomUtilisateur} description={user.email} meta={<Chip size="small" label={isAdmin ? 'Administrateur' : 'Apprenant'} color={isAdmin ? 'secondary' : 'default'} variant={isAdmin ? 'filled' : 'outlined'} />} onEdit={() => setUserForm({ id, email: user.email || '', username: user.username || user.nomUtilisateur, password: '', isAdmin })} onDelete={() => setDeleteDialog({ open: true, id })} />
            })}
        </AdminPanelLayout>
        <ConfirmDialog open={deleteDialog.open} title="Supprimer l’utilisateur ?" message="Cette action est irréversible." onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} isLoading={loading} />
    </>
}
