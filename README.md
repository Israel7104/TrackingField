![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-639?style=for-the-badge&logo=css&logoColor=fff)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=FFF)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

# TrackingField

> Tu panel de nutricion y entrenamiento en una sola app.

TrackingField es una aplicacion fullstack para registrar alimentos, planes de dieta, ejercicios y rutinas de entrenamiento, con un dashboard diario y autenticacion con Firebase.

| Despliegue | URL |
|------------|-----|
| Frontend | [Vercel](https://tracking-field-ppeil6oi0-israel7104s-projects.vercel.app) |

---

## Caracteristicas

- Registro de alimentos con calorias y macronutrientes.
- Creacion de dietas y agregado de alimentos por plan.
- Registro de ejercicios con series, repeticiones e intensidad.
- Creacion de rutinas y agregado de ejercicios por rutina.
- Dashboard consolidado con datos de nutricion y entrenamiento.
- Autenticacion de usuarios con Firebase Auth.

---

## Tecnologias

| Frontend | Uso |
|----------|-----|
| React 19 + TypeScript | SPA, componentes y tipado estatico |
| Vite | Desarrollo local y build de produccion |
| Tailwind CSS | Sistema de estilos utilitarios |
| React Router | Navegacion entre vistas |
| Firebase Auth | Registro e inicio de sesion |

| Backend | Uso |
|---------|-----|
| Node.js | Runtime del servidor |
| Express 5 | API REST y middleware HTTP |
| TypeScript | Tipado y mantenibilidad de la API |
| CORS | Control de origenes permitidos |

| Auxiliares | Uso |
|------------|-----|
| ESLint | Reglas de calidad de codigo |
| tsx | Ejecucion del backend en desarrollo |
| Vercel | Despliegue del frontend |

---

## Estructura del proyecto

```text
TrackingField/
├── front/                     # Aplicacion React + Vite
│   ├── src/
│   │   ├── api/client.ts      # Cliente HTTP hacia la API
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # Estado global (AppContext)
│   │   ├── firebase/          # Configuracion Firebase
│   │   ├── hooks/             # Hooks personalizados
│   │   ├── pages/             # Vistas principales
│   │   └── utils/routes.ts    # Rutas de la app
│   └── package.json
├── server/                    # API Express
│   ├── data/store.json        # Persistencia actual (JSON)
│   ├── src/
│   │   ├── app.ts             # Configuracion de Express y CORS
│   │   ├── index.ts           # Entry point del servidor
│   │   ├── config/            # Variables de entorno y store
│   │   ├── routes/            # Definicion de rutas API
│   │   ├── controllers/       # Capa HTTP
│   │   ├── services/          # Logica de negocio
│   │   └── utils/validators.ts
│   └── package.json
├── docs/                      # Documentacion tecnica y funcional
├── vercel.json                # Build/rewrite del frontend en Vercel
└── README.md
```

---

## Descargar y ejecutar

```bash
git clone <git@github.com:Israel7104/TrackingField.git>
cd TrackingField
```

### 1. Backend

```bash
cd server
npm install
npm run dev
```

API local por defecto: `http://localhost:4000/api/v1`

### 2. Frontend

En otra terminal:

```bash
cd front
npm install
npm run dev
```

Frontend local por defecto: `http://localhost:5173`

### Variables de entorno recomendadas

- Frontend: `VITE_API_URL` (ejemplo: `http://localhost:4000/api/v1`)
- Backend: `PORT`, `FRONTEND_ORIGIN`, `ALLOW_VERCEL_PREVIEWS`

---

## Desplegar en Vercel

### Frontend

1. Conecta el repositorio a Vercel.
2. Usa `front/` como Root Directory.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Define `VITE_API_URL` con la URL publica de la API.

### Backend

1. Despliega `server/` como servicio Node en Vercel, Railway o Render.
2. Configura `PORT` y `FRONTEND_ORIGIN` con el dominio del frontend.
3. Valida CORS y endpoints principales (`/health`, `/dashboard`, `/foods`).

---

## Documentacion adicional

- API: `docs/api.md`
- Despliegue: `docs/deployment.md`
- Arquitectura tecnica: `tecnico.md`

---

Desarrollado durante las practicas en [Corner Estudios](https://www.corner-estudios.com) - Israel - 2026

Tablero de trabajo: https://trello.com/invite/b/69f7cd5c4743cf94c72b362d/ATTI7c02052bbdd11977f1a3b2eeaf8ac505123B8A04/trackingfieldce