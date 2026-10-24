-- 只查看“上次之后”新来的玩家消息：每次把下面四行整段贴进 Cloudflare D1 Console，点一次运行。
-- 第一次运行结果是空的（把已有消息记成“看过了”）；之后每次显示上次以后的新消息。
-- 显示一次就算看过，再运行就是下一批，所以先复制好结果。

CREATE TABLE IF NOT EXISTS export_mark (id INTEGER PRIMARY KEY CHECK (id = 1), prev INTEGER NOT NULL DEFAULT 0, last INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO export_mark (id, prev, last) SELECT 1, IFNULL(MAX(rowid), 0), IFNULL(MAX(rowid), 0) FROM feedback;
UPDATE export_mark SET prev = last, last = (SELECT IFNULL(MAX(rowid), 0) FROM feedback) WHERE id = 1;
SELECT f.created_at, f.character, f.message, f.reply FROM feedback f JOIN export_mark m ON m.id = 1 WHERE f.rowid > m.prev AND f.rowid <= m.last ORDER BY f.rowid;

-- 万一多运行了一次 / 忘了复制：单独运行这句，看最近 200 条
-- SELECT created_at, character, message, reply FROM feedback ORDER BY rowid DESC LIMIT 200;
