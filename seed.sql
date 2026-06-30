-- Seed initial mock data for JB Dental Clinic

-- Patients
INSERT INTO patients (full_name, phone, email, date_of_birth, gender) VALUES
('Nakato Grace', '256752001269', 'nakato.g@example.com', '1990-05-12', 'Female'),
('Okello James', '256772123456', 'okello.j@example.com', '1985-08-20', 'Male'),
('Kintu David', '256701234567', 'kintu.d@example.com', '1992-03-15', 'Male'),
('Nansubuga Sarah', '256783456789', 'nansubuga.s@example.com', '1988-11-08', 'Female'),
('Mukasa Peter', '256754567890', 'mukasa.p@example.com', '1979-07-22', 'Male');

-- Staff
INSERT INTO staff (full_name, role, phone, email, salary, is_active) VALUES
('Dr. Betty Namukasa', 'Dentist', '256752000001', 'dr.namukasa@jbdental.ug', 2500000, 1),
('Dr. Robert Ssebunya', 'Dentist', '256752000002', 'dr.ssebunya@jbdental.ug', 2400000, 1),
('Nalwadda Mary', 'Nurse', '256752000003', 'mary.n@jbdental.ug', 800000, 1),
('Tumusiime Grace', 'Receptionist', '256752000004', 'grace.t@jbdental.ug', 600000, 1);

-- Appointments
INSERT INTO appointments (patient_name, patient_phone, appointment_date, appointment_time, service, patient_id, dentist_id, status) VALUES
('Nakato Grace', '256752001269', TO_CHAR(NOW() + INTERVAL '1 day', 'YYYY-MM-DD'), '09:00', 'General checkup', 1, 1, 'Confirmed'),
('Okello James', '256772123456', TO_CHAR(NOW() + INTERVAL '1 day', 'YYYY-MM-DD'), '10:30', 'Dental cleaning', 2, 1, 'Pending'),
('Kintu David', '256701234567', TO_CHAR(NOW(), 'YYYY-MM-DD'), '14:00', 'Consultation', 3, 1, 'Completed');

-- Invoices
INSERT INTO invoices (patient_id, total_amount, discount, tax, status) VALUES
(1, 150000, 0, 0, 'Paid'),
(2, 200000, 10000, 0, 'Partially Paid'),
(3, 80000, 0, 0, 'Pending');

-- Payments
INSERT INTO payments (invoice_id, amount, payment_method, paid_at) VALUES
(1, 150000, 'Mobile Money', TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')),
(2, 100000, 'Cash', TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'));

-- Treatments
INSERT INTO treatments (patient_id, dentist_id, service_name, description, cost, treatment_date, status) VALUES
(3, 1, 'Consultation', 'Initial checkup', 80000, TO_CHAR(NOW(), 'YYYY-MM-DD'), 'Completed'),
(1, 1, 'Scaling', 'Dental cleaning', 150000, TO_CHAR(NOW(), 'YYYY-MM-DD'), 'Completed');

-- Inventory Items
INSERT INTO inventory_items (name, quantity, minimum_stock, supplier) VALUES
('Dental gloves (M)', 200, 50, 'Medix Uganda'),
('Masks (surgical)', 500, 100, 'Medix Uganda'),
('Cotton rolls', 1000, 200, 'Dental Supplies Ltd');
