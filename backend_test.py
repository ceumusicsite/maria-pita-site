import requests
import sys
import json
from datetime import datetime

class MariaPitaAPITester:
    def __init__(self, base_url="https://gospel-voice-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: {len(response_data)} items returned")
                    else:
                        print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_releases_endpoints(self):
        """Test releases endpoints"""
        print("\n📀 Testing Releases Endpoints...")
        
        # Get all releases
        success, releases = self.run_test("Get All Releases", "GET", "releases", 200)
        
        # Get featured releases
        self.run_test("Get Featured Releases", "GET", "releases", 200, params={"featured": True})
        
        # Test individual release if any exist
        if success and releases and len(releases) > 0:
            release_id = releases[0].get('id')
            if release_id:
                self.run_test("Get Single Release", "GET", f"releases/{release_id}", 200)
        
        # Test creating a new release
        new_release = {
            "title": "Test Release",
            "description": "Test description",
            "cover_url": "https://example.com/cover.jpg",
            "spotify_url": "https://spotify.com/test",
            "youtube_url": "https://youtube.com/test",
            "release_date": "2024-01-01",
            "featured": True
        }
        self.run_test("Create Release", "POST", "releases", 200, data=new_release)

    def test_shows_endpoints(self):
        """Test shows endpoints"""
        print("\n🎤 Testing Shows Endpoints...")
        
        # Get all shows
        success, shows = self.run_test("Get All Shows", "GET", "shows", 200)
        
        # Get shows by state
        self.run_test("Get Shows by State", "GET", "shows", 200, params={"state": "RJ"})
        
        # Test creating a new show
        new_show = {
            "date": "2024-12-25",
            "city": "Rio de Janeiro",
            "state": "RJ",
            "venue": "Igreja Teste",
            "event_name": "Concerto de Natal",
            "time": "19:00"
        }
        self.run_test("Create Show", "POST", "shows", 200, data=new_show)

    def test_products_endpoints(self):
        """Test products endpoints"""
        print("\n🛍️ Testing Products Endpoints...")
        
        # Get all products
        success, products = self.run_test("Get All Products", "GET", "products", 200)
        
        # Get featured products
        self.run_test("Get Featured Products", "GET", "products", 200, params={"featured": True})
        
        # Get products by category
        self.run_test("Get Products by Category", "GET", "products", 200, params={"category": "CD"})
        
        # Test individual product if any exist
        if success and products and len(products) > 0:
            product_id = products[0].get('id')
            if product_id:
                self.run_test("Get Single Product", "GET", f"products/{product_id}", 200)
        
        # Test creating a new product
        new_product = {
            "name": "Test Product",
            "description": "Test product description",
            "price": 29.99,
            "image_url": "https://example.com/product.jpg",
            "category": "CD",
            "stock": 10,
            "featured": False
        }
        self.run_test("Create Product", "POST", "products", 200, data=new_product)

    def test_newsletter_endpoint(self):
        """Test newsletter subscription"""
        print("\n📧 Testing Newsletter Endpoint...")
        
        # Test newsletter subscription
        newsletter_data = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        }
        self.run_test("Newsletter Subscription", "POST", "newsletter", 200, data=newsletter_data)
        
        # Test duplicate subscription (should fail)
        self.run_test("Duplicate Newsletter Subscription", "POST", "newsletter", 400, data=newsletter_data)

    def test_booking_endpoints(self):
        """Test booking endpoints"""
        print("\n📅 Testing Booking Endpoints...")
        
        # Test creating a booking
        booking_data = {
            "name": "João Silva",
            "organization": "Igreja Teste",
            "city": "São Paulo",
            "state": "SP",
            "event_date": "2024-12-31",
            "email": f"joao_{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "(11) 99999-9999",
            "message": "Gostaria de contratar Maria Pita para nosso evento de fim de ano."
        }
        self.run_test("Create Booking", "POST", "booking", 200, data=booking_data)
        
        # Test getting bookings
        self.run_test("Get All Bookings", "GET", "booking", 200)
        
        # Test getting bookings by status
        self.run_test("Get Pending Bookings", "GET", "booking", 200, params={"status": "pending"})

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Maria Pita API Tests...")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)

        # Test all endpoints
        self.test_root_endpoint()
        self.test_releases_endpoints()
        self.test_shows_endpoints()
        self.test_products_endpoints()
        self.test_newsletter_endpoint()
        self.test_booking_endpoints()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")

        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
                print(f"   - {test['test']}: {error_msg}")

        return self.tests_passed == self.tests_run

def main():
    tester = MariaPitaAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())