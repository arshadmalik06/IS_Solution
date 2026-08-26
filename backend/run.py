import uvicorn

if __name__ == "__main__":
    print("Initializing BIS Intelligent Assistant API Server...")
    # 'app.main:app' points to the 'app' variable inside 'app/main.py'
    # reload=True automatically restarts the server when you save code changes
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)