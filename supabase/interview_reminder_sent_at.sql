-- Run once in Supabase SQL editor so reminder pushes are only sent once per interview.
alter table public.submissions
  add column if not exists interview_reminder_sent_at timestamptz;

comment on column public.submissions.interview_reminder_sent_at is
  'Set when the 30-minute interview reminder push was sent to admin devices.';
