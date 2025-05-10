import React, { useEffect, useState } from "react"
import axios from "axios"
import "./RecommendedCourses.css"

const RecommendedCourses = ({ courseId }) => {
  const [recommended, setRecommended] = useState([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.post("http://localhost:5001/recommend", {
          course_id: courseId,
        })
        setRecommended(response.data)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      }
    }

    if (courseId) fetchRecommendations()
  }, [courseId])

  return (
    <div className="recommended-courses">
      <h3>Recommended Courses</h3>
      <ul>
        {recommended.length > 0 ? (
          recommended.map((course) => (
            <li key={course._id}>{course.title}</li>
          ))
        ) : (
          <li>No recommendations available.</li>
        )}
      </ul>
    </div>
  )
}

export default RecommendedCourses
