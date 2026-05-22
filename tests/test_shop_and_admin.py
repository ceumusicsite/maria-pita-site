import requests
import sys

BASE_URL = "http://localhost:8000/api"

def test_flow():
    print("--- Starting Integration Test: Shop & Admin API Flow ---")
    print("=" * 60)
    
    # 1. Fetch Products
    print("\n1. Fetching products...")
    response = requests.get(f"{BASE_URL}/products")
    assert response.status_code == 200, f"Failed to fetch products: {response.text}"
    products = response.json()
    print(f"Found {len(products)} products.")
    
    if not products:
        print("No products available in the database. Cannot continue testing checkout.")
        sys.exit(1)
        
    product = None
    for p in products:
        if p.get("stock", 0) > 0:
            product = p
            break
            
    if not product:
        product = products[0]
        print(f"First product '{product['name']}' has 0 stock. Using it anyway.")

    product_id = product["id"]
    print(f"Selected product: '{product['name']}' (ID: {product_id}, Stock: {product.get('stock', 0)}, Price: R$ {product['price']})")
    
    # 2. Calculate Shipping
    print("\n2. Calculating shipping...")
    shipping_payload = {
        "cep_destino": "01001-000",
        "items": [
            {
                "product_id": product_id,
                "quantity": 1
            }
        ]
    }
    response = requests.post(f"{BASE_URL}/shipping/calculate", json=shipping_payload)
    assert response.status_code == 200, f"Failed to calculate shipping: {response.text}"
    shipping_data = response.json()
    print("Shipping calculated successfully:")
    for option in shipping_data.get("options", []):
        print(f"   - {option['method']}: R$ {option['cost']} ({option['delivery_time']})")
        
    selected_option = shipping_data["options"][0]
    
    print("\n3. Logging in as Admin...")
    login_payload = {
        "username": "admin",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    assert response.status_code == 200, f"Failed to login: {response.text}"
    login_data = response.json()
    admin_token = login_data["token"]
    print(f"Admin logged in successfully. Token: {admin_token[:10]}...")
    
    # 4. Verify Admin Token
    print("\n4. Verifying Admin Token...")
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.get(f"{BASE_URL}/auth/verify", headers=headers)
    assert response.status_code == 200, f"Failed to verify admin: {response.text}"
    print(f"Token verified. Welcome {response.json().get('username')}")

    # 5. Place Order
    print("\n5. Placing customer order...")
    order_payload = {
        "customer_name": "Test Runner",
        "customer_email": "test@runner.com",
        "customer_phone": "(11) 99999-9999",
        "cep": "01001-000",
        "address": "Praca da Se",
        "number": "123",
        "complement": "Apt 42",
        "neighborhood": "Se",
        "city": "Sao Paulo",
        "state": "SP",
        "shipping_method": selected_option["method"],
        "shipping_cost": selected_option["cost"],
        "payment_method": "pix",
        "items": [
            {
                "product_id": product_id,
                "quantity": 1
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/orders", json=order_payload)
    if response.status_code == 400 and "Estoque insuficiente" in response.text:
        print("Stock was insufficient. Let's create a new temporary test product first!")
        new_prod_payload = {
            "name": "Temp Test Product",
            "description": "Created for integration tests",
            "price": 9.99,
            "image_url": "https://example.com/image.jpg",
            "category": "CD",
            "stock": 50,
            "featured": False
        }
        prod_resp = requests.post(f"{BASE_URL}/products", json=new_prod_payload, headers=headers)
        assert prod_resp.status_code == 200, f"Failed to create test product: {prod_resp.text}"
        temp_product = prod_resp.json()
        product_id = temp_product["id"]
        print(f"Created temp product with stock: ID {product_id}")
        
        # Retry Order
        order_payload["items"][0]["product_id"] = product_id
        response = requests.post(f"{BASE_URL}/orders", json=order_payload)
        
    assert response.status_code == 200, f"Failed to place order: {response.text}"
    order_data = response.json()
    order_id = order_data["id"]
    print(f"Order placed successfully! Order ID: {order_id}, Total: R$ {order_data['total_amount']}")
    
    # 6. Fetch Admin Orders List
    print("\n6. Fetching admin orders list...")
    response = requests.get(f"{BASE_URL}/orders", headers=headers)
    assert response.status_code == 200, f"Failed to fetch orders: {response.text}"
    orders = response.json()
    found_order = any(o["id"] == order_id for o in orders)
    assert found_order, f"Created order {order_id} not found in admin orders list!"
    print(f"Order found in admin listing. Total orders in list: {len(orders)}")
    
    # 7. Fetch Order Details
    print("\n7. Fetching order details...")
    response = requests.get(f"{BASE_URL}/orders/{order_id}", headers=headers)
    assert response.status_code == 200, f"Failed to fetch order details: {response.text}"
    order_details = response.json()
    assert order_details["customer_name"] == "Test Runner"
    assert len(order_details["items"]) == 1
    print(f"Details match. Status is: {order_details['status']}")
    
    # 8. Update Order Status (Mark Paid)
    print("\n8. Updating order status to 'paid'...")
    status_payload = {
        "status": "paid"
    }
    response = requests.patch(f"{BASE_URL}/orders/{order_id}/status", json=status_payload, headers=headers)
    assert response.status_code == 200, f"Failed to update status to paid: {response.text}"
    print(f"Order status updated to 'paid'.")
    
    # 9. Update Order Status (Mark Shipped with tracking code)
    print("\n9. Updating order status to 'shipped' with tracking code...")
    tracking_payload = {
        "status": "shipped",
        "tracking_code": "AA123456789BR"
    }
    response = requests.patch(f"{BASE_URL}/orders/{order_id}/status", json=tracking_payload, headers=headers)
    assert response.status_code == 200, f"Failed to update status to shipped: {response.text}"
    updated_details = response.json()
    assert updated_details["status"] == "shipped"
    assert updated_details["tracking_code"] == "AA123456789BR"
    print(f"Order status updated to 'shipped'. Tracking: {updated_details['tracking_code']}")
    
    print("\nAll integration tests passed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    test_flow()
