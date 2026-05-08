# Playficent

Playficent is a simple Django + React typing game project with a Django backend and a Vite-powered React frontend.

## Overview

- Backend: Django
- Frontend: React + Vite
- Database: SQLite (included as `db.sqlite3`)

## Project structure

- `manage.py` - Django management entrypoint
- `playficentdjango/` - Django project settings, URLs, WSGI/ASGI
- `core/` - Django app with models, views, API and admin configuration
- `frontend/` - React application and frontend assets

## Getting started

1. Create and activate your Python virtual environment.
2. Install Django and any backend dependencies.
3. Run database migrations:

```bash
python manage.py migrate
```

4. Start the Django development server:

```bash
python manage.py runserver
```

5. Install frontend dependencies and start the React app:

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The frontend communicates with the Django backend via API endpoints defined in `core/api.py`.
- Use the admin site to inspect models and data.
- `db.sqlite3` is the local database file used for development.

## License

This project is licensed under the MIT License. See `LICENSE` for details.


