"""
Create test user via API endpoint.
"""
import requests
import json

# API endpoint
url = "http://localhost:8000/api/auth/register"

# User data
data = {
    "email": "burhan.malu.learning@gmail.com",
    "password": "123456",
    "full_name": "Burhan Malu"
}

print("👤 Creating test user via API...")
print(f"📧 Email: {data['email']}")
print(f"🔑 Password: {data['password']}")

try:
    response = requests.post(url, json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ Test user created successfully!")
        print(f"🎫 Access token: {result['access_token'][:50]}...")
    elif response.status_code == 400:
        error = response.json()
        if "already registered" in error.get("detail", "").lower():
            print("\n⚠️  User already exists!")
            print("You can now login with:")
            print(f"📧 Email: {data['email']}")
            print(f"🔑 Password: {data['password']}")
        else:
            print(f"\n❌ Error: {error.get('detail', 'Unknown error')}")
    else:
        print(f"\n❌ Error: {response.status_code}")
        print(response.text)
except requests.exceptions.ConnectionError:
    print("\n❌ Could not connect to backend server!")
    print("Make sure the backend is running on http://localhost:8000")
except Exception as e:
    print(f"\n❌ Error: {e}")
