import requests

def send_to_backend(articles, MONGO):
    backend_url = 'http://localhost:5001/mongo-receive-articles' if MONGO else 'http://localhost:5001/receive-articles'
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(backend_url, json=articles, headers=headers)
        response.raise_for_status()
        print(articles)
        print(f"Data sent successfully. Status code: {response.status_code}")
    except requests.RequestException as e:
        print(f"Failed to send data to backend: {e}")
