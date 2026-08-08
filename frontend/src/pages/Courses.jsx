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
        <Container sx={{ py: { xs: 6, md: 9 } }}>
            <Box sx={{ mb: 6, pb: 4, borderBottom: '1px solid', borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 3, flexWrap: 'wrap' }}>
                <Box><Typography className="eyebrow">Bibliothèque</Typography><Typography variant="h2" component="h1" sx={{ mt: 1.5 }}>Mes parcours</Typography></Box>
                <Box sx={{ minWidth: 145, borderLeft: '3px solid', borderColor: 'secondary.main', pl: 2 }}><Typography variant="h4">{courses.length}</Typography><Typography variant="caption" color="text.secondary">{courses.length > 1 ? 'cours disponibles' : 'cours disponible'}</Typography></Box>
            </Box>
            {courses.length > 0 && <ProgressionOverview />}
            {status === 'failed' && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {status === 'loading' ? (
                <Box className="course-grid">{[1, 2, 3].map((item) => <Skeleton key={item} variant="rounded" height={285} sx={{ borderRadius: 1 }} />)}</Box>
            ) : courses.length > 0 ? (
                <Box className="course-grid">
                    {courses.map((course, index) => <StandardCard key={course.idCours} index={index} title={course.titre} description={course.description} to={`/courses/${course.idCours}`} progress={progressions[course.idCours]} />)}
                </Box>
            ) : (
                <Box sx={{ py: 10, textAlign: 'center', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}><Typography variant="h6">Aucun cours pour le moment</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Les nouveaux parcours apparaîtront ici.</Typography></Box>
            )}
        </Container>
    )
}
