import requests
import json

url = "http://localhost:8000/api/auth/register"
data = {
    "email": "burhan.malu.learning@gmail.com",
    "password": "123456",
    "full_name": "Burhan Malu"
}

print("Registering user...")
print(f"Email: {data['email']}")
print(f"Password: {data['password']}")
print()

try:
    response = requests.post(url, json=data, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print()
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Account created successfully!")
        print(f"Access Token: {result.get('access_token', 'N/A')[:50]}...")
    elif response.status_code == 400:
        error = response.json()
        if "already registered" in error.get("detail", "").lower():
            print("⚠️  Account already exists!")
            print("You can login with these credentials!")
        else:
            print(f"❌ Error: {error.get('detail', 'Unknown error')}")
    else:
        print(f"❌ Unexpected status code: {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {e}")
