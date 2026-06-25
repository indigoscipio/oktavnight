CREATE TABLE IF NOT EXISTS offerings (
  id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  mood TEXT NOT NULL,
  generated_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  witness_count INTEGER NOT NULL DEFAULT 0,
  candle_count INTEGER NOT NULL DEFAULT 0,
  release_count INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_offerings_expires_at ON offerings(expires_at);
CREATE INDEX IF NOT EXISTS idx_offerings_status ON offerings(status);
