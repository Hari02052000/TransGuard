# TransGuard – FinOps Transaction Monitoring System

A production-grade backend system for monitoring financial transactions, evaluating risk, and managing fraud alerts.

---

## 🚀 Overview

TransGuard is a FinOps monitoring system designed to:

- Analyze transactions using configurable risk rules
- Generate risk scores
- Automatically create alerts for suspicious activity
- Enable analysts to investigate and resolve alerts
- Maintain audit logs for compliance
- Provide dashboard metrics for monitoring

---

## 🧠 Core Flow

Transaction → Risk Evaluation → Rules Applied → Risk Score → Alert Created → Investigation → Audit Logs → Dashboard

---

## 🏗️ Architecture

- Clean Architecture (Uncle Bob)
- Module-based structure
- Feature-first design

### Layers:

- Domain
- Application (Use Cases)
- Infrastructure
- Interface (HTTP)

---

## 🛠️ Tech Stack

### Backend

- Node.js
- TypeScript
- Express.js
- PostgreSQL (Raw SQL)
- JWT Authentication
- Zod (Validation)
- Winston (Logging)
- Vitest (Testing)

---

## 📦 Project Structure
