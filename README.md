# Sistema de Validação de Modelos

Sistema administrativo para cadastro e consulta de modelos de dispositivos, com validações específicas por tipo (ex: monitor exige tamanho, celular não).

---

## 🧩 Funcionalidades

- Cadastro de modelos
- Listagem de modelos
- Filtro por tipo e marca
- Validações condicionais por tipo de dispositivo
- Atualização em tempo real da tabela após cadastro

---

## 🛠 Tecnologias Utilizadas

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic

### Frontend
- React
- TypeScript
- Vite
- Axios

---

## 📂 Estrutura do Projeto

backend/
├─ app/
│ ├─ main.py
│ ├─ models.py
│ ├─ schemas.py
│ ├─ database.py
│ └─ routers/
└─ venv/

frontend/
├─ src/
│ ├─ components/
│ ├─ pages/
│ ├─ api/
│ ├─ types/
│ └─ App.tsx

yaml
Copiar código

---

## ▶️ Como Rodar o Projeto

### 🔹 Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
Acesse:

Swagger: http://localhost:8000/docs

🔹 Frontend
bash
Copiar código
cd frontend
npm install
npm run dev
Acesse:

Frontend: http://localhost:5173

🔗 Principais Endpoints
Modelos
GET /admin/modelos

POST /modelos

Tipos
GET /tipos

Marcas
GET /admin/marcas

📌 Regras de Negócio
Monitor → campo tamanho obrigatório

Celular → não pode possuir tamanho

Validações são feitas no backend

🚀 Status do Projeto
✅ Cadastro e listagem funcionando
🔄 Próximos passos: edição, exclusão, autenticação e melhorias de UX

👨‍💻 Autor
Gabriel Marques