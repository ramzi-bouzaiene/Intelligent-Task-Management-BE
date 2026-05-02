ALTER TABLE tasks
    ADD COLUMN severity VARCHAR(10) CHECK (severity IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'low';
