-- 只查看“上次之后”新来的玩家消息（在 Cloudflare D1 Console 里运行）

-- 【第一次，只做一次】把现在已有的消息都记成“已经看过”
CREATE TABLE IF NOT EXISTS export_mark (id INTEGER PRIMARY KEY CHECK (id = 1), prev INTEGER NOT NULL DEFAULT 0, last INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO export_mark (id, prev, last) SELECT 1, IFNULL(MAX(rowid), 0), IFNULL(MAX(rowid), 0) FROM feedback;

-- 【以后每次】先运行第 1 步（每次只运行一次），再运行第 2 步（可以重复运行）

-- 第 1 步：记下“到这里为止”
UPDATE export_mark SET prev = last, last = (SELECT IFNULL(MAX(rowid), 0) FROM feedback) WHERE id = 1;

-- 第 2 步：显示上次之后的新消息（从早到晚）
SELECT f.created_at, f.character, f.message, f.reply FROM feedback f JOIN export_mark m ON m.id = 1 WHERE f.rowid > m.prev AND f.rowid <= m.last ORDER BY f.rowid;

-- 万一第 1 步多运行了一次、第 2 步变成空的：用下面这句看最近 200 条，把没发过的挑出来
-- SELECT created_at, character, message, reply FROM feedback ORDER BY rowid DESC LIMIT 200;
