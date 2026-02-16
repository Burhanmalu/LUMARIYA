import requests

print("Testing main app on port 8000...")
print("=" * 50)

endpoints = [
    ("Health Check", "http://localhost:8000/health"),
    ("Root", "http://localhost:8000/"),
    ("Docs", "http://localhost:8000/docs"),
]

for name, url in endpoints:
    try:
        print(f"\nTesting {name}: {url}")
        response = requests.get(url, timeout=5)
        print(f"✅ SUCCESS! Status: {response.status_code}")
        if 'json' in response.headers.get('content-type', ''):
            print(f"Response: {response.json()}")
    except requests.exceptions.Timeout:
        print(f"❌ TIMEOUT - No response after 5 seconds")
    except requests.exceptions.ConnectionError:
        print(f"❌ CONNECTION ERROR - Cannot connect to server")
    except Exception as e:
        print(f"❌ ERROR: {e}")

print("\n" + "=" * 50)
