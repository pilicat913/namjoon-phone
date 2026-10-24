CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  character TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT NOT NULL DEFAULT '',
  consent_version TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS feedback_created_at ON feedback(created_at);
CREATE TABLE IF NOT EXISTS quotas (minute INTEGER PRIMARY KEY, count INTEGER NOT NULL);
