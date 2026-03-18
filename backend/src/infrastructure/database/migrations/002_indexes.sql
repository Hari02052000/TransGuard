CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_assigned_to ON alerts(assigned_to);

CREATE INDEX idx_risk_transaction ON risk_evaluations(transaction_id);

CREATE INDEX idx_audit_entity ON audit_logs(entity_id);