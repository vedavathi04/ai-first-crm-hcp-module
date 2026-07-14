# AI-First CRM HCP Module – Log Interaction Screen

A full-stack implementation of an AI-First Customer Relationship Management (CRM) system tailored for Healthcare Professional (HCP) management in the life sciences sector. The solution features a conversational chat and structured form interface built with React and Redux Toolkit, integrated with a high-performance Python FastAPI backend incorporating an execution router and SQLite tracking logic.

---

## 🏗️ Project Architecture & Layout

```text
📁 ai-first-crm-hcp-module
 ├── 📁 backend
 │    ├── main.py            # FastAPI Application & Agent Tools Logic
 │    ├── requirements.txt   # Backend Pip Dependencies
 │    └── crm_hcp.db         # Auto-generated SQL Database
 ├── 📁 frontend
 │    └── 📁 hcp-crm-ui
 │         ├── 📁 src
 │         │    ├── 📁 store
 │         │    │    ├── store.js             # Redux Central Store Config
 │         │    │    └── interactionSlice.js  # Interaction Action Reducers
 │         │    ├── App.js     # Responsive Split View Layout UI (Form vs Chat)
 │         │    └── index.js   # Global App Context & State Injector
 │         └── package.json    # Frontend Node Node Modules Config
 └── README.md
