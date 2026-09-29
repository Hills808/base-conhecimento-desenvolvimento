-- Dados inteiramente fictícios para praticar SELECT, JOIN e ausência.
CREATE TABLE categorias (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
CREATE TABLE itens (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, categoria_id INTEGER, valor NUMERIC, FOREIGN KEY (categoria_id) REFERENCES categorias(id));
INSERT INTO categorias VALUES (1, 'Essencial'), (2, 'Opcional');
INSERT INTO itens VALUES (1, 'Caderno', 1, 18.50), (2, 'Caneta', 1, 4.00), (3, 'Sem categoria', NULL, 7.00);

-- 1. Liste itens e categoria, preservando o item sem categoria.
SELECT i.nome, c.nome AS categoria, i.valor
FROM itens i LEFT JOIN categorias c ON c.id = i.categoria_id;

-- 2. Escreva uma consulta que encontre itens sem categoria.

-- 3. Compare a contagem antes e depois do JOIN.

