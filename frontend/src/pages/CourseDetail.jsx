import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import StandardCard from '../components/StandardCard'
import { clearCurrent, fetchCourseById } from '../features/courses/coursesSlice'
import { selectCoursesError, selectCoursesStatus, selectCurrentCourse } from '../features/courses/coursesSelectors'
import { getContenuByCours } from '../services/contenusService'
import { getCourseProgress, getProgressForContent } from '../services/progressionService'

export default function CourseDetail() {
    const { id } = useParams()
    const dispatch = useAppDispatch()
    const course = useAppSelector(selectCurrentCourse)
    const courseStatus = useAppSelector(selectCoursesStatus)
    const courseError = useAppSelector(selectCoursesError)
    const [contents, setContents] = useState(null)
    const [contentsError, setContentsError] = useState(null)
    const [progress, setProgress] = useState(null)
    const [contentProgress, setContentProgress] = useState({})

    useEffect(() => {
        if (!id) return undefined
        let active = true
        dispatch(fetchCourseById(id))

        Promise.all([getContenuByCours(id), getCourseProgress(id)])
            .then(async ([contentList, courseProgress]) => {
                if (!active) return
                setContents(contentList)
                setProgress(Number(courseProgress) || 0)

                const pairs = await Promise.all(contentList.map(async (content) => {
                    try {
                        return [content.idContenu, await getProgressForContent(content.idContenu)]
                    } catch {
                        return [content.idContenu, null]
                    }
                }))
                if (active) setContentProgress(Object.fromEntries(pairs))
            })
            .catch((error) => {
                if (active) setContentsError(error.message || 'Impossible de charger les contenus.')
            })

        return () => {
            active = false
            dispatch(clearCurrent())
        }
    }, [id, dispatch])

    if (courseStatus === 'failed') {
        return <Container maxWidth="lg" sx={{ py: 8 }}><Alert severity="error">{courseError}</Alert></Container>
    }

    if (courseStatus === 'loading' || !course) {
        return <Container maxWidth="lg" sx={{ py: 8 }}><Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} /></Container>
    }

    const progressValue = Math.min(100, Math.max(0, progress || 0))

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
            <Button component={Link} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: 'text.secondary' }}>
                Retour aux cours
            </Button>

            <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, p: { xs: 3, md: 5 }, boxShadow: '0 18px 50px rgba(28,42,33,.06)' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: { xs: 4, md: 7 }, alignItems: 'end' }}>
                    <Box>
                        <Typography className="eyebrow">Cours</Typography>
                        <Typography variant="h2" component="h1" sx={{ mt: 1.5, mb: 2 }}>{course.titre}</Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 680, lineHeight: 1.7 }}>{course.description}</Typography>
                    </Box>
                    <Box sx={{ bgcolor: '#f5f3ee', borderRadius: 2.5, p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={650}>Votre progression</Typography>
                            <Typography variant="h4">{Math.round(progressValue)}%</Typography>
                        </Box>
                        {progress === null ? <Skeleton height={8} /> : <LinearProgress variant="determinate" value={progressValue} sx={{ height: 8 }} />}
                    </Box>
                </Box>
            </Box>

            <Box component="section" sx={{ mt: { xs: 6, md: 8 } }}>
                <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                    <Box>
                        <Typography className="eyebrow">Programme</Typography>
                        <Typography variant="h3" component="h2" sx={{ mt: 1 }}>Contenus du cours</Typography>
                    </Box>
                    {contents && <Typography color="text.secondary">{contents.length} {contents.length > 1 ? 'contenus' : 'contenu'}</Typography>}
                </Box>

                {contentsError && <Alert severity="error">{contentsError}</Alert>}
                {contents === null && !contentsError && (
                    <Box className="course-grid">{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={245} sx={{ borderRadius: 3 }} />)}</Box>
                )}
                {contents?.length === 0 && (
                    <Box sx={{ py: 8, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
                        <MenuBookOutlinedIcon color="primary" />
                        <Typography variant="h6" sx={{ mt: 1 }}>Aucun contenu disponible</Typography>
                    </Box>
                )}
                {contents?.length > 0 && (
                    <Box className="course-grid">
                        {contents.map((content) => (
                            <StandardCard
                                key={content.idContenu}
                                title={content.titre}
                                subtitle={content.type}
                                to={`/content/${content.idContenu}`}
                                read={contentProgress[content.idContenu]?.statut === 'READ'}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    )
}
