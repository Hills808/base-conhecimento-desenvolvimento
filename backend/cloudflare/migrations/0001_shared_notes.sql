-- Fixed public blocks. Writes are disabled in the Worker until migration is verified.
CREATE TABLE shared_study_notes (
 scope TEXT PRIMARY KEY,
 content TEXT NOT NULL DEFAULT '' CHECK (length(content) <= 50000 AND instr(content, char(0)) = 0),
 revision INTEGER NOT NULL DEFAULT 0 CHECK (revision >= 0),
 updated_at TEXT
);
insert into shared_study_notes(scope) values ('mod-0-0'),('mod-0-1'),('mod-0-2'),('mod-0-3'),('mod-0-4'),('mod-1-0'),('mod-1-1'),('mod-1-2'),('mod-1-3'),('mod-1-4'),('mod-2-0'),('mod-2-1'),('mod-2-2'),('mod-2-3'),('mod-2-4'),('mod-3-0'),('mod-3-1'),('mod-3-2'),('mod-3-3'),('mod-3-4'),('mod-4-0'),('mod-4-1'),('mod-4-2'),('mod-4-3'),('mod-4-4'),('mod-5-0'),('mod-5-1'),('mod-5-2'),('mod-5-3'),('mod-5-4'),('mod-6-0'),('mod-6-1'),('mod-6-2'),('mod-6-3'),('mod-6-4'),('mod-7-0'),('mod-7-1'),('mod-7-2'),('mod-7-3'),('mod-7-4'),('mod-8-0'),('mod-8-1'),('mod-8-2'),('mod-8-3'),('mod-8-4'),('lab-http'),('lab-bruno'),('lab-contratos'),('lab-prompts'),('lab-rotas'),('lab-csharp'),('lab-dotnet'),('lab-mcp'),('lab-integracao'),('lab-seguranca'),('lab-rag'),('lab-skills'),('lab-qualidade'),('lab-projeto');
