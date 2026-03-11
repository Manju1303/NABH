@echo off
echo Starting NABH Backend Server...
d:
cd \Github\NABH\backend
call venv\Scripts\activate.bat
uvicorn main:app --reload
