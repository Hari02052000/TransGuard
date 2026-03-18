-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================= USERS =================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL, -- ADMIN | ANALYST | SYSTEM
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | DISABLED
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================= TRANSACTIONS =================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT NOT NULL,
  source_account TEXT,
  destination_account TEXT,
  country TEXT,
  status TEXT DEFAULT 'SUCCESS', -- SUCCESS | FAILED | PENDING
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================= RULES =================
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  condition_json JSONB NOT NULL,
  risk_weight INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================= RISK EVALUATIONS =================
CREATE TABLE risk_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  risk_score INT NOT NULL,
  triggered_rules JSONB,
  evaluated_at TIMESTAMP DEFAULT NOW()
);

-- ================= ALERTS =================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  risk_score INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN | UNDER_REVIEW | ESCALATED | RESOLVED
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- ================= ALERT NOTES =================
CREATE TABLE alert_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================= AUDIT LOGS =================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);