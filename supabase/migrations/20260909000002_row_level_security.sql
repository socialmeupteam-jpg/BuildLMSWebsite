-- =============================================================================
-- SocialMeUp Academy LMS — Row Level Security (RLS) Policies
-- Version: 1.0.0
-- Database: PostgreSQL / Supabase
-- =============================================================================

-- Enable RLS on all domain tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Helper Functions for Security Evaluation
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_parent_of(student_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.parent_students
        WHERE parent_id = auth.uid()
          AND student_id = student_uuid
          AND status = 'active'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_trainer_of_batch(batch_uuid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.batches
        WHERE id = batch_uuid AND trainer_id = auth.uid()
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 1. Profiles RLS
-- -----------------------------------------------------------------------------
-- Users can view their own profile, admins can view all, parents can view linked children
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = id
        OR public.is_admin()
        OR public.is_parent_of(id)
        -- Trainers can view students enrolled in their batches
        OR (public.current_user_role() = 'trainer' AND EXISTS (
            SELECT 1 FROM public.enrollments e
            JOIN public.batches b ON b.id = e.batch_id
            WHERE e.student_id = profiles.id AND b.trainer_id = auth.uid()
        ))
    );

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Parent-Students Linkage RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Parents and students can view their relationships"
    ON public.parent_students FOR SELECT
    USING (parent_id = auth.uid() OR student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can manage parent-student linkages"
    ON public.parent_students FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Courses, Modules, Lessons RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Published courses are readable by authenticated users"
    ON public.courses FOR SELECT
    USING (status = 'published' OR public.is_admin() OR created_by = auth.uid());

CREATE POLICY "Admins can manage courses"
    ON public.courses FOR ALL
    USING (public.is_admin());

CREATE POLICY "Modules readable by authenticated enrolled users or admins"
    ON public.course_modules FOR SELECT
    USING (TRUE);

CREATE POLICY "Lessons readable by authenticated enrolled users or preview"
    ON public.lessons FOR SELECT
    USING (is_preview = TRUE OR auth.uid() IS NOT NULL);

-- -----------------------------------------------------------------------------
-- 4. Batches RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Trainers and admins can view their batches"
    ON public.batches FOR SELECT
    USING (
        public.is_admin()
        OR trainer_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.enrollments
            WHERE batch_id = batches.id AND student_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM public.enrollments e
            WHERE e.batch_id = batches.id AND public.is_parent_of(e.student_id)
        )
    );

CREATE POLICY "Admins can manage batches"
    ON public.batches FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. Enrollments RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Students and parents can view own enrollments"
    ON public.enrollments FOR SELECT
    USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.is_trainer_of_batch(batch_id)
        OR public.is_admin()
    );

CREATE POLICY "Students can self-enroll or admins enroll"
    ON public.enrollments FOR INSERT
    WITH CHECK (student_id = auth.uid() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Attendance RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Students view own attendance, parents view child, trainers view batch"
    ON public.attendance FOR SELECT
    USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.is_trainer_of_batch(batch_id)
        OR public.is_admin()
    );

CREATE POLICY "Trainers and admins can insert or update attendance"
    ON public.attendance FOR ALL
    USING (public.is_trainer_of_batch(batch_id) OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. Assignments & Submissions RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Assignments viewable by enrolled students, trainers, admins"
    ON public.assignments FOR SELECT
    USING (TRUE);

CREATE POLICY "Trainers and admins can create assignments"
    ON public.assignments FOR ALL
    USING (public.current_user_role() = 'trainer' OR public.is_admin());

CREATE POLICY "Student can view and manage own submissions"
    ON public.assignment_submissions FOR SELECT
    USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR (public.current_user_role() = 'trainer' AND EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_submissions.assignment_id AND a.created_by = auth.uid()
        ))
        OR public.is_admin()
    );

CREATE POLICY "Students can create and update own submission"
    ON public.assignment_submissions FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Trainers and admins can grade submissions"
    ON public.assignment_submissions FOR UPDATE
    USING (public.current_user_role() IN ('trainer', 'admin'));

-- -----------------------------------------------------------------------------
-- 8. Finance (Invoices & Payments) RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Students and parents can view own payments"
    ON public.payments FOR SELECT
    USING (student_id = auth.uid() OR public.is_parent_of(student_id) OR public.is_admin());

CREATE POLICY "Admins can manage payments"
    ON public.payments FOR ALL
    USING (public.is_admin());

CREATE POLICY "Students and parents can view own invoices"
    ON public.invoices FOR SELECT
    USING (student_id = auth.uid() OR public.is_parent_of(student_id) OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 9. Certificates RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Students view own certificates, admins manage"
    ON public.certificates FOR SELECT
    USING (student_id = auth.uid() OR public.is_parent_of(student_id) OR public.is_admin());

CREATE POLICY "Admins can issue certificates"
    ON public.certificates FOR ALL
    USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 10. Messages, Announcements & Notifications RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view messages sent to or by them"
    ON public.messages FOR SELECT
    USING (sender_id = auth.uid() OR recipient_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Announcements readable by target audience"
    ON public.announcements FOR SELECT
    USING (
        target_role = 'all'
        OR target_role = public.current_user_role()::text
        OR public.is_admin()
    );

CREATE POLICY "Users view own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 11. Grievances RLS
-- -----------------------------------------------------------------------------
CREATE POLICY "Users view own grievances, admins view all"
    ON public.grievances FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create grievances"
    ON public.grievances FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update grievances"
    ON public.grievances FOR UPDATE
    USING (public.is_admin());
