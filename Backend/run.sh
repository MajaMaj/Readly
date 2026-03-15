#!/bin/bash
./venv/bin/python3 -m pip install sqlalchemy fastapi uvicorn
./venv/bin/python3 -m uvicorn main:app --reload