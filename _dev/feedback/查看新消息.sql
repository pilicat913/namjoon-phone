-- 只查看“上次之后”新来的玩家消息：每次把下面四行整段贴进 Cloudflare D1 Console，点一次运行。
-- 第一次运行结果是空的（把已有消息记成“看过了”）；之后每次显示上次以后的新消息。
-- 显示一次就算看过，再运行就是下一批，所以先复制好结果。

CREATE TABLE IF NOT EXISTS export_mark (id INTEGER PRIMARY KEY CHECK (id = 1), prev INTEGER NOT NULL DEFAULT 0, last INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO export_mark (id, prev, last) SELECT 1, IFNULL(MAX(rowid), 0), IFNULL(MAX(rowid), 0) FROM feedback;
UPDATE export_mark SET prev = last, last = (SELECT IFNULL(MAX(rowid), 0) FROM feedback) WHERE id = 1;
SELECT f.created_at, f.character, f.message, f.reply FROM feedback f JOIN export_mark m ON m.id = 1 WHERE f.rowid > m.prev AND f.rowid <= m.last ORDER BY f.rowid;

-- 万一多运行了一次 / 忘了复制：单独运行这句，看最近 200 条
-- SELECT created_at, character, message, reply FROM feedback ORDER BY rowid DESC LIMIT 200;

-- 【推荐】只看“没接住”的话（按句子去重、按次数排序）。把时间换成上一次的截止时间
SELECT character, message, COUNT(*) AS n
FROM feedback
WHERE created_at > '2026-10-24 16:30:00'
  AND character NOT IN ('妈妈', '经纪人哥', '方PD')
  AND (reply LIKE '%没明白%' OR reply LIKE '%没看懂%' OR reply LIKE '%没跟上%'
    OR reply LIKE '%理解错%' OR reply LIKE '%再说一遍%' OR reply LIKE '%换个说法%'
    OR reply LIKE '%什么意思%' OR reply LIKE '%没懂%' OR reply LIKE '%说重点%'
    OR reply LIKE '%在说什么%' OR reply LIKE '%说什么呀%' OR reply LIKE '%你说啥%'
    OR reply LIKE '？%' OR reply LIKE '……什么%' OR reply LIKE '啥？%'
    OR reply LIKE '哥？%' OR reply LIKE '啊？%' OR reply LIKE '嗯？%')
GROUP BY character, message
ORDER BY n DESC;
