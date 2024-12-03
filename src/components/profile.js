import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faLink } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const Profile = () => {
    const [trainees, setTrainees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const limit = 15; // Number of trainees per page

    const fetchTrainees = async (page) => {
        setLoading(true);
        const offset = (page - 1) * limit;

        try {
            const response = await fetch(`/api/trainees?limit=${limit}&offset=${offset}`);
            if (!response.ok) throw new Error("Failed to fetch trainees");

            const data = await response.json();
            setTrainees(data.trainees);
            setTotalPages(Math.ceil(data.totalRows / limit)); // Calculate total pages
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainees(currentPage); // Fetch trainees for the current page
    }, [currentPage]);

    const handlePageClick = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <section className="profile-banner">
                <div className="overlay" />
                <div className="content">
                    <h1>Profile</h1>
                    <div className="colorful-line" />
                    <nav className="breadcrumb-nav">
                        <ul className="breadcrumb">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>/</li>
                            <li className="active">Profile</li>
                        </ul>
                    </nav>
                    <div className="down-arrow">
                        <a href="#profile-section">
                            <FontAwesomeIcon icon={faAngleDown} className="fa-solid fa-angle-down" />
                        </a>
                    </div>
                </div>
            </section>
            <section id="profile-section" className="profile-section">
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : (
                    <ul className="profile-grid">
                        {trainees.map((trainee) => (
                            <li key={trainee.id} className="profile-card">
                                <Image src={trainee.image} alt="Profile Image" width={200} height={200} />
                                <div className="profile-details">
                                    <h5>Name: {trainee.name}</h5>
                                    <div className="colorful-div" />
                                    <p>Skill: {trainee.skill}</p>
                                    <p>Batch: {trainee.batch}, December 2024</p>
                                    <p>URL:   
                                        <a href={trainee.url} target="_blank">
                                             Portfolio URL Link
                                            <FontAwesomeIcon icon={faLink} className="fa-solid fa-link" />
                                        </a>
                                    </p>
                                    <p>Gender: {trainee.gender}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {/* Pagination */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <span
                            key={index + 1}
                            onClick={() => handlePageClick(index + 1)}
                            className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                        >
                            {index + 1}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Profile;
