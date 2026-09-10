-- =============================================================================
-- SocialMeUp Academy LMS — Seed Data
-- Version: 1.0.0
-- Database: PostgreSQL / Supabase
-- =============================================================================

-- 1. Academy System Settings
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('academy_info', '{"name": "SocialMeUp Academy", "email": "admissions@socialmeupacademy.in", "phone": "+91 98765 43210", "address": "Indiranagar, Bangalore, Karnataka, India"}'::jsonb, 'General Academy Information'),
    ('academic_terms', '{"academicYear": "2026-2027", "currentTerm": "Term 1", "minAttendancePercentage": 75}'::jsonb, 'Academic policies and thresholds')
ON CONFLICT (key) DO NOTHING;

-- 2. Core Demo Courses
INSERT INTO public.courses (id, code, title, description, category, level, duration, fee, status)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'DM-101', 'Complete Digital Marketing Masterclass', 'Master SEO, SEM, Meta Ads, Google Analytics 4, and content marketing strategy.', 'Marketing', 'Beginner', '12 weeks', 24999.00, 'published'),
    ('c0000000-0000-0000-0000-000000000002', 'FS-201', 'Full Stack Web Development (MERN & Next.js)', 'Comprehensive software engineering curriculum covering modern React, Node.js, and cloud deployments.', 'Development', 'Intermediate', '16 weeks', 34999.00, 'published'),
    ('c0000000-0000-0000-0000-000000000003', 'DS-301', 'Data Science & Generative AI Bootcamp', 'Practical Python, machine learning models, neural networks, and modern LLM application engineering.', 'Data Science', 'Advanced', '14 weeks', 39999.00, 'published')
ON CONFLICT (code) DO NOTHING;

-- 3. Course Modules
INSERT INTO public.course_modules (id, course_id, title, description, order_index)
VALUES
    ('m0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Module 1: Search Engine Optimization Foundations', 'On-page and off-page SEO algorithms, keyword research, and technical auditing.', 1),
    ('m0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Module 2: Paid Ads & Performance Marketing', 'Google Ads campaigns, Meta Ads Manager, bidding strategies, and conversion tracking.', 2)
ON CONFLICT DO NOTHING;

-- 4. Lessons
INSERT INTO public.lessons (id, module_id, title, content, duration_minutes, order_index, is_preview)
VALUES
    ('l0000000-0000-0000-0000-000000000001', 'm0000000-0000-0000-0000-000000000001', 'Introduction to Modern Search Engine Crawlers', 'Detailed breakdown of how web search indexing engines discover, crawl, and rank dynamic web applications.', 45, 1, TRUE),
    ('l0000000-0000-0000-0000-000000000002', 'm0000000-0000-0000-0000-000000000001', 'Keyword Strategy and Competitive Gap Analysis', 'Techniques for identifying high-intent long-tail keywords with low competition.', 60, 2, FALSE)
ON CONFLICT DO NOTHING;
