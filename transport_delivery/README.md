# Transport Delivery Management System

## Prerequisites
- Python installed
- Node.js installed

## Setup (First Time Only)

### Backend Setup
```powershell
cd transport_delivery\transport_delivery
python -m venv venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python create_admin.py
```

### Frontend Setup
```powershell
cd transport_delivery\transport_delivery\frontend
npm install
```

## Run the Project

### Terminal 1 - Backend
```powershell
cd transport_delivery\transport_delivery
venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 - Frontend
```powershell
cd transport_delivery\transport_delivery\frontend
npm run dev
```3YERYERYERYEY

## Login
- **Email:** `admin@transport.com`
- **Password:** `admin123`

Open: **http://localhost:3000**
