// ===== PANEL D'ADMINISTRATION DES COURS =====
// Composant spécialisé pour la gestion des cours
import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../services/coursesService'
import { getAllContenu } from '../../services/contenusService'
import ConfirmDialog from '../../components/ConfirmDialog'

// Composant pour gérer les cours (création, édition, suppression)
export default function CoursesAdminPanel({ onSnack, onContenusRefresh }) {
    // État du panel
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
    const [courseForm, setCourseForm] = useState({ id: null, titre: '', description: '' })

    // Charger les cours au montage
    React.useEffect(() => {
        loadCourses()
    }, [])

    // Fonction pour charger les cours
    async function loadCourses() {
        setLoading(true)
        try {
            const data = await getCourses()
            setCourses(data)
        } finally {
            setLoading(false)
        }
    }

    // Enregistrer un cours (créer ou modifier)
    async function handleSave() {
        try {
            if (courseForm.id) {
                await updateCourse(courseForm.id, { titre: courseForm.titre, description: courseForm.description })
                onSnack({ message: 'Cours mis à jour', severity: 'success' })
            } else {
                await createCourse({ titre: courseForm.titre, description: courseForm.description })
                onSnack({ message: 'Cours créé', severity: 'success' })
            }
            setCourseForm({ id: null, titre: '', description: '' })
            loadCourses()
        } catch (e) {
            onSnack({ message: e.message || 'Erreur', severity: 'error' })
        }
    }

    // Supprimer un cours (ouvert le dialog de confirmation)
    function handleDelete(id) {
        setDeleteDialog({ open: true, id })
    }

    // Confirmer la suppression du cours
    async function confirmDelete() {
        const id = deleteDialog.id
        setLoading(true)
        try {
            await deleteCourse(id)
            onSnack({ message: 'Cours supprimé', severity: 'success' })
            loadCourses()
            // Rafraîchir les contenus
            const data = await getAllContenu()
            onContenusRefresh(data)
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
                        <Typography variant="h6">Nouveau cours</Typography>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Titre"
                                value={courseForm.titre}
                                onChange={(e) => setCourseForm({ ...courseForm, titre: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                label="Description"
                                value={courseForm.description}
                                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={4}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
                            <Button onClick={() => setCourseForm({ id: null, titre: '', description: '' })}>Annuler</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Liste des cours */}
            <Box sx={{ flex: 1 }}>
                <Card sx={{ minHeight: 520, width: '100%' }}>
                    <CardContent sx={{ px: 4, py: 3 }}>
                        <Typography variant="h6">Liste des cours</Typography>
                        {loading && <Typography>Chargement…</Typography>}
                        <Box sx={{ mt: 2 }}>
                            {courses.map((c) => (
                                <Box
                                    key={c.idCours}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1.5, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                                >
                                    <Box sx={{ pr: 1 }}>
                                        <Typography sx={{ fontWeight: 700 }}>{c.titre}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{c.description}</Typography>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => setCourseForm({ id: c.idCours, titre: c.titre, description: c.description })}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(c.idCours)}>
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
                title="Supprimer le cours ?"
                message="Cette action est irréversible. Tous les contenus du cours seront perdus."
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
