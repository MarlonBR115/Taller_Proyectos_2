CREATE DATABASE IF NOT EXISTS generador_horarios;
USE generador_horarios;

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    availability JSON, -- Podría guardar matriz de horas disponibles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    credits INT DEFAULT 3,
    weekly_hours INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    room_type ENUM('theory', 'lab') DEFAULT 'theory',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE academic_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term_id INT NULL,
    course_id INT,
    teacher_id INT,
    quota INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (term_id) REFERENCES academic_terms(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term_id INT NULL,
    group_id INT,
    room_id INT,
    day_of_week ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'),
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (term_id) REFERENCES academic_terms(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES student_groups(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
