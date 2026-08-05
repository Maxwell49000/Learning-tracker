import { useEffect } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import ProgressionOverview from '../components/ProgressionOverview'
import StandardCard from '../components/StandardCard'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectAllCourses, selectCoursesError, selectCoursesStatus } from '../features/courses/coursesSelectors'
import { fetchCourses } from '../features/courses/coursesSlice'
import { useCoursesProgress } from '../hooks/useCoursesProgress'

export default function Courses() {
    const dispatch = useAppDispatch()
    const courses = useAppSelector(selectAllCourses)
    const status = useAppSelector(selectCoursesStatus)
    const error = useAppSelector(selectCoursesError)
    const { progressions } = useCoursesProgress(courses)

    useEffect(() => { if (status === 'idle') dispatch(fetchCourses()) }, [status, dispatch])

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 3, flexWrap: 'wrap' }}>
                <Box><Typography className="eyebrow">Bibliothèque</Typography><Typography variant="h2" component="h1" sx={{ mt: 1.5 }}>Mes cours</Typography></Box>
                <Typography color="text.secondary">{courses.length} {courses.length > 1 ? 'parcours disponibles' : 'parcours disponible'}</Typography>
            </Box>
            {courses.length > 0 && <ProgressionOverview />}
            {status === 'failed' && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {status === 'loading' ? (
                <Box className="course-grid">{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={285} sx={{ borderRadius: 3 }} />)}</Box>
            ) : courses.length > 0 ? (
                <Box className="course-grid">
                    {courses.map((course) => <StandardCard key={course.idCours} title={course.titre} description={course.description} to={`/courses/${course.idCours}`} progress={progressions[course.idCours]} />)}
                </Box>
            ) : (
                <Box sx={{ py: 10, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}><Typography variant="h6">Aucun cours pour le moment</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Les nouveaux parcours apparaîtront ici.</Typography></Box>
            )}
        </Container>
    )
}
