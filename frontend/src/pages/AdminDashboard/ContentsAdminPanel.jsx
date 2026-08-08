import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { AdminListItem, AdminPanelLayout } from '../../components/AdminPanelLayout'
import ConfirmDialog from '../../components/ConfirmDialog'
import { createContenu, deleteContenu, getAllContenu, updateContenu } from '../../services/contenusService'
import { getCourses } from '../../services/coursesService'

const emptyForm = { id: null, titre: '', description: '', courseId: '' }

export default function ContentsAdminPanel({ onSnack }) {
    const [contenus, setContenus] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
    const [contenuForm, setContenuForm] = useState(emptyForm)
    const loadContenus = async () => { setLoading(true); try { setContenus(await getAllContenu()) } finally { setLoading(false) } }
    useEffect(() => { loadContenus(); getCourses().then(setCourses).catch(() => onSnack({ message: 'Impossible de charger les cours.', severity: 'error' })) }, [onSnack])

    const handleSave = async () => {
        if (!contenuForm.courseId || !contenuForm.titre.trim()) return onSnack({ message: 'Le cours et le titre sont requis.', severity: 'error' })
        const data = { titre: contenuForm.titre, description: contenuForm.description, idCours: contenuForm.courseId }
        try {
            if (contenuForm.id) { await updateContenu(contenuForm.id, data); onSnack({ message: 'Contenu mis à jour', severity: 'success' }) }
            else { await createContenu(data); onSnack({ message: 'Contenu créé', severity: 'success' }) }
            setContenuForm(emptyForm); loadContenus()
        } catch (error) { onSnack({ message: error.message || 'Erreur', severity: 'error' }) }
    }
    const confirmDelete = async () => {
        setLoading(true)
        try { await deleteContenu(deleteDialog.id); onSnack({ message: 'Contenu supprimé', severity: 'success' }); await loadContenus() }
        catch (error) { onSnack({ message: error.message || 'Erreur', severity: 'error' }) }
        finally { setDeleteDialog({ open: false, id: null }); setLoading(false) }
    }

    const form = <Box sx={{ display: 'grid', gap: 2 }}>
        <FormControl fullWidth><InputLabel>Cours parent</InputLabel><Select value={contenuForm.courseId} onChange={(event) => setContenuForm({ ...contenuForm, courseId: event.target.value })} label="Cours parent"><MenuItem value=""><em>Sélectionner</em></MenuItem>{courses.map((course) => <MenuItem key={course.idCours} value={course.idCours}>{course.titre}</MenuItem>)}</Select></FormControl>
        <TextField label="Titre du contenu" value={contenuForm.titre} onChange={(event) => setContenuForm({ ...contenuForm, titre: event.target.value })} fullWidth />
        <TextField label="Description ou URL" value={contenuForm.description} onChange={(event) => setContenuForm({ ...contenuForm, description: event.target.value })} fullWidth multiline rows={4} />
        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}><Button variant="contained" color="secondary" onClick={handleSave}>{contenuForm.id ? 'Mettre à jour' : 'Créer le contenu'}</Button>{contenuForm.id && <Button onClick={() => setContenuForm(emptyForm)}>Annuler</Button>}</Box>
    </Box>

    return <>
        <AdminPanelLayout formTitle={contenuForm.id ? 'Modifier le contenu' : 'Nouveau contenu'} formSubtitle="Programme" form={form} listTitle="Contenus disponibles" count={contenus.length} loading={loading}>
            {contenus.map((content) => {
                const course = courses.find((item) => item.idCours === content.course?.idCours)
                return <AdminListItem key={content.idContenu} title={content.titre} description={content.description} meta={<Typography variant="caption" color="secondary.main" fontWeight={750}>{course?.titre || 'Cours non renseigné'}</Typography>} onEdit={() => setContenuForm({ id: content.idContenu, titre: content.titre, description: content.description || '', courseId: content.course?.idCours || '' })} onDelete={() => setDeleteDialog({ open: true, id: content.idContenu })} />
            })}
        </AdminPanelLayout>
        <ConfirmDialog open={deleteDialog.open} title="Supprimer le contenu ?" message="Cette action est irréversible." onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} isLoading={loading} />
    </>
}
