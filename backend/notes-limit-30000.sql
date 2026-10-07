-- Expand only the text constraint; all existing content and permissions remain.
alter table public.shared_study_notes
 drop constraint shared_study_notes_content_check,
 add constraint shared_study_notes_content_check check (char_length(content) <= 30000);
