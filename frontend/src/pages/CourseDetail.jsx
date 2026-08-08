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
        Promise.all([getContenuByCours(id), getCourseProgress(id)]).then(async ([contentList, courseProgress]) => {
            if (!active) return
            setContents(contentList)
            setProgress(Number(courseProgress) || 0)
            const pairs = await Promise.all(contentList.map(async (content) => {
                try { return [content.idContenu, await getProgressForContent(content.idContenu)] } catch { return [content.idContenu, null] }
            }))
            if (active) setContentProgress(Object.fromEntries(pairs))
        }).catch((error) => { if (active) setContentsError(error.message || 'Impossible de charger les contenus.') })
        return () => { active = false; dispatch(clearCurrent()) }
    }, [id, dispatch])

    if (courseStatus === 'failed') return <Container sx={{ py: 8 }}><Alert severity="error">{courseError}</Alert></Container>
    if (courseStatus === 'loading' || !course) return <Container sx={{ py: 8 }}><Skeleton variant="rounded" height={330} sx={{ borderRadius: 1 }} /></Container>

    const progressValue = Math.min(100, Math.max(0, progress || 0))
    return (
        <Container sx={{ py: { xs: 5, md: 8 } }}>
            <Button component={Link} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: 'text.secondary', px: 0 }}>Retour aux parcours</Button>
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', border: '1px solid', borderColor: 'primary.main', display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) 300px' } }}>
                <Box sx={{ p: { xs: 3.5, md: 6 } }}>
                    <Typography className="eyebrow">Cours · {String(id).padStart(2, '0')}</Typography>
                    <Typography variant="h2" component="h1" sx={{ mt: 2.5, mb: 2.5, color: 'inherit', maxWidth: 730 }}>{course.titre}</Typography>
                    <Typography sx={{ maxWidth: 650, lineHeight: 1.7, opacity: .72 }}>{course.description}</Typography>
                </Box>
                <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', p: { xs: 3.5, md: 4 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: { md: '1px solid' }, borderTop: { xs: '1px solid', md: 0 }, borderColor: 'primary.main' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '.12em', textTransform: 'uppercase' }}>Votre progression</Typography>
                    <Typography sx={{ fontSize: '4.5rem', lineHeight: 1, fontWeight: 780, letterSpacing: '-.065em', my: 3 }}>{Math.round(progressValue)}<Box component="span" sx={{ fontSize: '.35em' }}>%</Box></Typography>
                    {progress === null ? <Skeleton height={8} /> : <LinearProgress variant="determinate" value={progressValue} sx={{ height: 7 }} />}
                </Box>
            </Box>

            <Box component="section" sx={{ mt: { xs: 7, md: 10 } }}>
                <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 2, mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'primary.main' }}>
                    <Box><Typography className="eyebrow">Programme</Typography><Typography variant="h3" component="h2" sx={{ mt: 1.5 }}>Contenus du cours</Typography></Box>
                    {contents && <Typography color="text.secondary">{contents.length} {contents.length > 1 ? 'contenus' : 'contenu'}</Typography>}
                </Box>
                {contentsError && <Alert severity="error">{contentsError}</Alert>}
                {contents === null && !contentsError && <Box className="course-grid">{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={245} sx={{ borderRadius: 1 }} />)}</Box>}
                {contents?.length === 0 && <Box sx={{ py: 8, textAlign: 'center', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}><MenuBookOutlinedIcon color="secondary" /><Typography variant="h6" sx={{ mt: 1 }}>Aucun contenu disponible</Typography></Box>}
                {contents?.length > 0 && <Box className="course-grid">{contents.map((content, index) => <StandardCard key={content.idContenu} index={index} title={content.titre} subtitle={content.type} to={`/content/${content.idContenu}`} read={contentProgress[content.idContenu]?.statut === 'READ'} />)}</Box>}
            </Box>
        </Container>
    )
}
