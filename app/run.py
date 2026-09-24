import webview
import uvicorn as uv
import threading


from main import app

def run_server():
    uv.run(app, host='localhost', port=2000)

if __name__ == "__main__":
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    main_window = webview.create_window(
        title="Test",
        url="http://localhost:2000",
        width=640,
        height=480,
        resizable=True
    )

    webview.start()