// ===== PANEL D'ADMINISTRATION DES CONTENUS =====
// Composant spécialisé pour la gestion des contenus/modules d'apprentissage
import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getCourses } from '../../services/coursesService'
import { getAllContenu, createContenu, updateContenu, deleteContenu } from '../../services/contenusService'
import ConfirmDialog from '../../components/ConfirmDialog'

// Composant pour gérer les contenus/modules (création, édition, suppression)
export default function ContentsAdminPanel({ onSnack }) {
    // État du panel
    const [contenus, setContenus] = useState([])
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
    const [contenuForm, setContenuForm] = useState({ id: null, titre: '', description: '', courseId: '' })

    // Charger les contenus et cours au montage
    React.useEffect(() => {
        loadContenus()
        loadCourses()
    }, [])

    // Charger les contenus
    async function loadContenus() {
        setLoading(true)
        try {
            const data = await getAllContenu()
            setContenus(data)
        } finally {
            setLoading(false)
        }
    }

    // Charger les cours (pour sélectionner le cours parent)
    async function loadCourses() {
        try {
            const data = await getCourses()
            setCourses(data)
        } catch (e) {
            console.error('Erreur chargement cours', e)
        }
    }

    // Enregistrer un contenu (créer ou modifier)
    async function handleSave() {
        try {
            if (!contenuForm.courseId) {
                onSnack({ message: 'Sélectionner un cours', severity: 'error' })
                return
            }
            if (contenuForm.id) {
                await updateContenu(contenuForm.id, {
                    titre: contenuForm.titre,
                    description: contenuForm.description,
                    idCours: contenuForm.courseId
                })
                onSnack({ message: 'Contenu mis à jour', severity: 'success' })
            } else {
                await createContenu({
                    titre: contenuForm.titre,
                    description: contenuForm.description,
                    idCours: contenuForm.courseId
                })
                onSnack({ message: 'Contenu créé', severity: 'success' })
            }
            setContenuForm({ id: null, titre: '', description: '', courseId: '' })
            loadContenus()
        } catch (e) {
            onSnack({ message: e.message || 'Erreur', severity: 'error' })
        }
    }

    // Supprimer un contenu (ouvre le dialog de confirmation)
    function handleDelete(id) {
        setDeleteDialog({ open: true, id })
    }

    // Confirmer la suppression du contenu
    async function confirmDelete() {
        const id = deleteDialog.id
        setLoading(true)
        try {
            await deleteContenu(id)
            onSnack({ message: 'Contenu supprimé', severity: 'success' })
            loadContenus()
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
                        <Typography variant="h6">Nouveau contenu</Typography>
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Cours</InputLabel>
                                <Select
                                    value={contenuForm.courseId}
                                    onChange={(e) => setContenuForm({ ...contenuForm, courseId: e.target.value })}
                                    label="Cours"
                                >
                                    <MenuItem value="">--Sélectionner--</MenuItem>
                                    {courses.map((c) => <MenuItem key={c.idCours} value={c.idCours}>{c.titre}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                label="Titre"
                                value={contenuForm.titre}
                                onChange={(e) => setContenuForm({ ...contenuForm, titre: e.target.value })}
                                fullWidth
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                label="Description"
                                value={contenuForm.description}
                                onChange={(e) => setContenuForm({ ...contenuForm, description: e.target.value })}
                                fullWidth
                                multiline
                                rows={4}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
                            <Button onClick={() => setContenuForm({ id: null, titre: '', description: '', courseId: '' })}>Annuler</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Liste des contenus */}
            <Box sx={{ flex: 1 }}>
                <Card sx={{ minHeight: 520, width: '100%' }}>
                    <CardContent sx={{ px: 4, py: 3 }}>
                        <Typography variant="h6">Liste des contenus</Typography>
                        {loading && <Typography>Chargement…</Typography>}
                        <Box sx={{ mt: 2 }}>
                            {contenus.map((con) => {
                                const course = courses.find(c => c.idCours === con.course?.idCours)
                                return (
                                    <Box
                                        key={con.idContenu}
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1.5, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                                    >
                                        <Box sx={{ pr: 1 }}>
                                            <Typography sx={{ fontWeight: 700 }}>{con.titre}</Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{con.description}</Typography>
                                            <Typography variant="caption" sx={{ color: 'primary.main' }}>Cours: {course?.titre || 'Inconnu'}</Typography>
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => setContenuForm({
                                                    id: con.idContenu,
                                                    titre: con.titre,
                                                    description: con.description,
                                                    courseId: con.course?.idCours || ''
                                                })}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(con.idContenu)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Dialog de confirmation pour la suppression */}
            <ConfirmDialog
                open={deleteDialog.open}
                title="Supprimer le contenu ?"
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
