CREATE TABLE IF NOT EXISTS academic_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE student_groups ADD COLUMN term_id INT NULL AFTER id;
ALTER TABLE student_groups ADD CONSTRAINT fk_sg_term FOREIGN KEY (term_id) REFERENCES academic_terms(id) ON DELETE SET NULL;

ALTER TABLE schedules ADD COLUMN term_id INT NULL AFTER id;
ALTER TABLE schedules ADD CONSTRAINT fk_sched_term FOREIGN KEY (term_id) REFERENCES academic_terms(id) ON DELETE CASCADE;
