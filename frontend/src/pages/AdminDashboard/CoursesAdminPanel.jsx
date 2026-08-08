import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { AdminListItem, AdminPanelLayout } from '../../components/AdminPanelLayout'
import ConfirmDialog from '../../components/ConfirmDialog'
import { getAllContenu } from '../../services/contenusService'
import { createCourse, deleteCourse, getCourses, updateCourse } from '../../services/coursesService'

const emptyForm = { id: null, titre: '', description: '' }

export default function CoursesAdminPanel({ onSnack, onContenusRefresh }) {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
    const [courseForm, setCourseForm] = useState(emptyForm)
    const loadCourses = async () => { setLoading(true); try { setCourses(await getCourses()) } finally { setLoading(false) } }
    useEffect(() => { loadCourses() }, [])

    const handleSave = async () => {
        if (!courseForm.titre.trim()) return onSnack({ message: 'Le titre est requis.', severity: 'error' })
        try {
            const data = { titre: courseForm.titre, description: courseForm.description }
            if (courseForm.id) { await updateCourse(courseForm.id, data); onSnack({ message: 'Cours mis à jour', severity: 'success' }) }
            else { await createCourse(data); onSnack({ message: 'Cours créé', severity: 'success' }) }
            setCourseForm(emptyForm); loadCourses()
        } catch (error) { onSnack({ message: error.message || 'Erreur', severity: 'error' }) }
    }
    const confirmDelete = async () => {
        setLoading(true)
        try { await deleteCourse(deleteDialog.id); onSnack({ message: 'Cours supprimé', severity: 'success' }); await loadCourses(); onContenusRefresh(await getAllContenu()) }
        catch (error) { onSnack({ message: error.message || 'Erreur', severity: 'error' }) }
        finally { setDeleteDialog({ open: false, id: null }); setLoading(false) }
    }

    const form = <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Titre du cours" value={courseForm.titre} onChange={(event) => setCourseForm({ ...courseForm, titre: event.target.value })} fullWidth />
        <TextField label="Description" value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} fullWidth multiline rows={5} />
        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}><Button variant="contained" color="secondary" onClick={handleSave}>{courseForm.id ? 'Mettre à jour' : 'Créer le cours'}</Button>{courseForm.id && <Button onClick={() => setCourseForm(emptyForm)}>Annuler</Button>}</Box>
    </Box>

    return <>
        <AdminPanelLayout formTitle={courseForm.id ? 'Modifier le cours' : 'Nouveau cours'} formSubtitle="Catalogue" form={form} listTitle="Cours publiés" count={courses.length} loading={loading}>
            {courses.map((course) => <AdminListItem key={course.idCours} title={course.titre} description={course.description} onEdit={() => setCourseForm({ id: course.idCours, titre: course.titre, description: course.description })} onDelete={() => setDeleteDialog({ open: true, id: course.idCours })} />)}
        </AdminPanelLayout>
        <ConfirmDialog open={deleteDialog.open} title="Supprimer le cours ?" message="Cette action est irréversible. Tous les contenus associés seront perdus." onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ open: false, id: null })} isLoading={loading} />
    </>
}
