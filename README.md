# EstateLens

Document intelligence platform for real estate, planning, and legal due diligence. Upload property documents (planning certificates, zoning reports, contracts, title documents, surveys), get cited answers, cross-document conflict detection, risk scoring, and automated due diligence reports.

## Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui
- Backend: FastAPI, PostgreSQL (Supabase), ChromaDB, LangChain, Groq LLaMA

## Local development

### Frontend
\`\`\`
cd client
npm install
cp .env.example .env
npm run dev
\`\`\`

### Backend
\`\`\`
cd server
python -m venv venv

# activate (Mac/Linux)
source venv/bin/activate
# activate (Windows)
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
\`\`\`