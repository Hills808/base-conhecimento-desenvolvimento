-- Dedicated Curva Aberta project. No login, no content history.
create table public.shared_study_notes (
 scope text primary key,
 content text not null default '' check (char_length(content) <= 10000),
 revision integer not null default 0 check (revision >= 0),
 updated_at timestamptz
);
alter table public.shared_study_notes enable row level security;
revoke all on public.shared_study_notes from public, anon, authenticated;
grant select on public.shared_study_notes to anon;
grant update(content) on public.shared_study_notes to anon;
create policy notes_read on public.shared_study_notes for select to anon using (true);
create policy notes_edit on public.shared_study_notes for update to anon using (true) with check (true);
create function public.guard_shared_note() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare expected text;
begin
 expected := coalesce(current_setting('request.headers', true), '{}')::jsonb ->> 'x-curva-revision';
 if expected is null or expected <> old.revision::text then
   raise sqlstate 'PT409' using message = 'Revision mismatch';
 end if;
 if old.updated_at > clock_timestamp() - interval '3 seconds' then
   raise sqlstate 'PT429' using message = 'Wait three seconds';
 end if;
 new.revision := old.revision + 1;
 new.updated_at := clock_timestamp();
 return new;
end;
$$;
revoke all on function public.guard_shared_note() from public, anon, authenticated;
create trigger shared_note_guard before update on public.shared_study_notes
for each row execute function public.guard_shared_note();
-- Seed known curriculum scopes only; public callers cannot create arbitrary rows.
insert into public.shared_study_notes(scope) values ('mod-0-0'),('mod-0-1'),('mod-0-2'),('mod-0-3'),('mod-0-4'),('mod-1-0'),('mod-1-1'),('mod-1-2'),('mod-1-3'),('mod-1-4'),('mod-2-0'),('mod-2-1'),('mod-2-2'),('mod-2-3'),('mod-2-4'),('mod-3-0'),('mod-3-1'),('mod-3-2'),('mod-3-3'),('mod-3-4'),('mod-4-0'),('mod-4-1'),('mod-4-2'),('mod-4-3'),('mod-4-4'),('mod-5-0'),('mod-5-1'),('mod-5-2'),('mod-5-3'),('mod-5-4'),('mod-6-0'),('mod-6-1'),('mod-6-2'),('mod-6-3'),('mod-6-4'),('mod-7-0'),('mod-7-1'),('mod-7-2'),('mod-7-3'),('mod-7-4'),('mod-8-0'),('mod-8-1'),('mod-8-2'),('mod-8-3'),('mod-8-4'),('lab-http'),('lab-bruno'),('lab-contratos'),('lab-prompts'),('lab-rotas'),('lab-csharp'),('lab-dotnet'),('lab-mcp'),('lab-integracao'),('lab-seguranca'),('lab-rag'),('lab-skills'),('lab-qualidade'),('lab-projeto');
