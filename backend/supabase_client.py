import os
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def insert(table, rows):
    res = requests.post(f"{SUPABASE_URL}/rest/v1/{table}", headers=headers, json=rows)
    res.raise_for_status()
    return res.json()

def select(table, params=None):
    res = requests.get(f"{SUPABASE_URL}/rest/v1/{table}", headers=headers, params=params or {})
    res.raise_for_status()
    return res.json()

def update(table, match_params, patch_body):
    """match_params: dict like {'id': 'eq.<uuid>'}. patch_body: dict of columns to set."""
    res = requests.patch(f"{SUPABASE_URL}/rest/v1/{table}", headers=headers, params=match_params, json=patch_body)
    res.raise_for_status()
    return res.json()