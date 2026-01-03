CREATE DATABASE globetrotter;
USE globetrotter;

CREATE TABLE credentials (
    email VARCHAR(255) PRIMARY KEY,
    role ENUM('user', 'admin') DEFAULT 'user',
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_details (
    user_name VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    photo VARCHAR(255),
    FOREIGN KEY (email) REFERENCES credentials(email)
);

CREATE TABLE tourist_region (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(100),
    name_of_the_region VARCHAR(255) NOT NULL,
    ranking INT DEFAULT 0
);

CREATE TABLE tourist_spot (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_of_the_region VARCHAR(255),
    name_of_the_spot VARCHAR(255) NOT NULL
);

CREATE TABLE trips (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    tourist_region VARCHAR(255),
    status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_name) REFERENCES user_details(user_name)
);

CREATE TABLE itinerary_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_amount DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE
);

CREATE TABLE city_search (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    description TEXT,
    cost_index DECIMAL(5,2) DEFAULT 0,
    popularity INT DEFAULT 0
);

CREATE TABLE activities_search (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    address TEXT,
    description TEXT,
    image VARCHAR(255),
    cost DECIMAL(10,2) DEFAULT 0,
    duration INT DEFAULT 0,
    type VARCHAR(100),
    FOREIGN KEY (city_id) REFERENCES city_search(city_id)
);

-- Insert Tamil Nadu cities and activities
INSERT INTO city_search (city_name, state, country, region, description, cost_index, popularity) VALUES
('Chennai', 'Tamil Nadu', 'India', 'South India', 'Gateway to South India', 45.2, 88),
('Madurai', 'Tamil Nadu', 'India', 'South India', 'Temple City', 35.8, 85),
('Coimbatore', 'Tamil Nadu', 'India', 'South India', 'Manchester of South India', 40.5, 78),
('Ooty', 'Tamil Nadu', 'India', 'South India', 'Queen of Hill Stations', 50.3, 92),
('Kanyakumari', 'Tamil Nadu', 'India', 'South India', 'Land\'s End of India', 38.7, 80),
('Pondicherry', 'Tamil Nadu', 'India', 'South India', 'French Colonial Heritage', 42.1, 82),
('Thanjavur', 'Tamil Nadu', 'India', 'South India', 'Rice Bowl of Tamil Nadu', 33.5, 75),
('Rameswaram', 'Tamil Nadu', 'India', 'South India', 'Holy Pilgrimage Site', 36.2, 77);

INSERT INTO activities_search (city_id, activity_name, address, description, cost, duration, type) VALUES
(1, 'Marina Beach Walk', 'Marina Beach, Chennai', 'World\'s second longest beach', 0.00, 90, 'Nature'),
(1, 'Kapaleeshwarar Temple', 'Mylapore, Chennai', 'Ancient Shiva temple', 0.00, 60, 'Culture'),
(1, 'Fort St. George', 'Fort St. George, Chennai', 'British colonial fort and museum', 15.00, 120, 'History'),
(2, 'Meenakshi Temple', 'Madurai Main, Madurai', 'Iconic Dravidian architecture temple', 50.00, 180, 'Culture'),
(2, 'Thirumalai Nayakkar Palace', 'Palace Road, Madurai', 'Indo-Saracenic palace', 30.00, 90, 'History'),
(3, 'Marudamalai Temple', 'Marudamalai Hills, Coimbatore', 'Hilltop Murugan temple', 20.00, 120, 'Culture'),
(3, 'Kovai Kutralam Falls', 'Siruvani Hills, Coimbatore', 'Natural waterfalls', 10.00, 150, 'Nature'),
(4, 'Botanical Gardens', 'Government Botanical Garden, Ooty', 'Rare plant species collection', 30.00, 120, 'Nature'),
(4, 'Doddabetta Peak', 'Doddabetta, Ooty', 'Highest peak in Nilgiris', 25.00, 90, 'Adventure'),
(4, 'Toy Train Ride', 'Ooty Railway Station', 'UNESCO heritage mountain railway', 200.00, 210, 'Adventure'),
(5, 'Vivekananda Rock', 'Kanyakumari Beach', 'Memorial on rocky island', 40.00, 120, 'Culture'),
(5, 'Sunset Point', 'Kanyakumari Beach', 'Three seas confluence sunset', 0.00, 60, 'Nature'),
(6, 'French Quarter Walk', 'White Town, Pondicherry', 'Colonial architecture tour', 0.00, 120, 'Culture'),
(6, 'Aurobindo Ashram', 'Rue de la Marine, Pondicherry', 'Spiritual center visit', 0.00, 90, 'Culture'),
(7, 'Brihadeeswarar Temple', 'Thanjavur Palace Complex', 'UNESCO World Heritage Chola temple', 30.00, 150, 'Culture'),
(7, 'Thanjavur Palace', 'Palace Devasthanam, Thanjavur', 'Maratha and Nayak palace complex', 50.00, 120, 'History'),
(8, 'Ramanathaswamy Temple', 'Rameswaram Temple, Rameswaram', 'Sacred Jyotirlinga temple', 0.00, 180, 'Culture'),
(8, 'Pamban Bridge', 'Pamban Island, Rameswaram', 'India\'s first sea bridge', 0.00, 45, 'Sightseeing');