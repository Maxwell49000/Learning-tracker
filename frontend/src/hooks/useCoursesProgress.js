// Hook personnalisé pour charger les progressions par cours
import { useEffect, useState } from 'react'
import { getCourseProgress } from '../services/progressionService'

// Hook pour récupérer les progressions de tous les cours
export function useCoursesProgress(courses) {
    // État pour stocker les progressions par ID de cours
    const [progressions, setProgressions] = useState({})
    const [loading, setLoading] = useState(true)

    // Charger les progressions au montage ou changement de courses
    useEffect(() => {
        if (!courses || courses.length === 0) {
            setProgressions({})
            setLoading(false)
            return
        }

        const loadProgressions = async () => {
            try {
                setLoading(true)
                const progressMap = {}

                // Charger la progression pour chaque cours en parallèle
                const progressPromises = courses.map(async (course) => {
                    try {
                        const progress = await getCourseProgress(course.idCours)
                        progressMap[course.idCours] = progress || 0
                    } catch {
                        progressMap[course.idCours] = 0
                    }
                })

                await Promise.all(progressPromises)
                setProgressions(progressMap)
            } finally {
                setLoading(false)
            }
        }

        loadProgressions()
    }, [courses])

    return { progressions, loading }
}
