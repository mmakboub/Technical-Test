import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
    title: string;
    description: string;
}

const Courses = () => { 
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchInput, setSearchInput] = useState(""); 
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/courses.json") 
            .then((res: any) => {
                setCourses(res.data);
                setFilteredCourses(res.data); 
                setLoading(false);
            })
            .catch((err: any) => {
                console.error("Le fichier json ne se charge pas :", err);
                setError("erreur lors du chargement des données");
                setLoading(false);
            });
    }, []);

    const handleSearch = () => {
        if (searchInput.trim() === "") {
            setFilteredCourses(courses);
        } else {
            setFilteredCourses(
                courses.filter(course => 
                    course.title.toLowerCase().includes(searchInput.toLowerCase())
                )
            );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Rechercher un cours par titre..."
                    className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch} 
                    className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Rechercher
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <ul className="space-y-2 mt-4">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, index) => (
                            <li
                                key={`${course.title}-${index}`} 
                                className="p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
                            >
                                <strong className="text-lg text-blue-600">{course.title}</strong>:{" "}
                                <span className="text-gray-700">{course.description}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Aucun cours trouvé</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Courses;
