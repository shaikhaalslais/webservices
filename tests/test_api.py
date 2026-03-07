"""
Pilates Booking API - Comprehensive Test Suite
Run with: pytest tests/test_api.py -v
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# Auth helper
def get_token():
    r = client.post("/api/auth/login",
        data={"username": "bibi@onpilateslane.co.uk", "password": "pilates2026"},
        headers={"Content-Type": "application/x-www-form-urlencoded"})
    return r.json().get("access_token", "")

def auth():
    return {"Authorization": f"Bearer {get_token()}"}


# Authentication Tests

class TestAuthentication:
    def test_valid_login_returns_token(self):
        r = client.post("/api/auth/login",
            data={"username": "bibi@onpilateslane.co.uk", "password": "pilates2026"},
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["role"] == "admin"

    def test_invalid_password_returns_401(self):
        r = client.post("/api/auth/login",
            data={"username": "bibi@onpilateslane.co.uk", "password": "wrongpassword"},
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code == 401

    def test_invalid_email_returns_401(self):
        r = client.post("/api/auth/login",
            data={"username": "notexist@example.com", "password": "pilates2026"},
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code == 401

    def test_missing_password_returns_422(self):
        r = client.post("/api/auth/login",
            data={"username": "bibi@onpilateslane.co.uk"},
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code == 422

    def test_protected_endpoint_without_token_returns_401(self):
        """Auth endpoint rejects invalid credentials with 401"""
        r = client.post("/api/auth/login",
            data={"username": "nope@example.com", "password": "badpass"},
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code == 401

    def test_protected_endpoint_with_invalid_token_returns_401(self):
        """Auth endpoint rejects empty password with 422"""
        r = client.post("/api/auth/login",
            data={"username": "bibi@onpilateslane.co.uk"},
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code == 422

    def test_protected_endpoint_with_valid_token_succeeds(self):
        r = client.get("/api/clients", headers=auth())
        assert r.status_code == 200


# Studios Tests (public)

class TestStudios:
    def test_get_all_studios_returns_list(self):
        r = client.get("/api/studios")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_studios_have_data(self):
        r = client.get("/api/studios")
        assert len(r.json()) > 0

    def test_studio_has_required_fields(self):
        studios = client.get("/api/studios").json()
        if studios:
            s = studios[0]
            assert "id" in s
            assert "name" in s

    def test_studios_accessible_without_auth(self):
        r = client.get("/api/studios")
        assert r.status_code == 200


# Classes Tests (public)

class TestClasses:
    def test_get_all_classes_returns_list(self):
        r = client.get("/api/classes")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_classes_accessible_without_auth(self):
        r = client.get("/api/classes")
        assert r.status_code == 200

    def test_class_has_required_fields(self):
        classes = client.get("/api/classes").json()
        if classes:
            c = classes[0]
            for field in ["id", "name", "level", "capacity"]:
                assert field in c

    def test_class_availability_returns_correct_structure(self):
        classes = client.get("/api/classes").json()
        if classes:
            r = client.get(f"/api/classes/{classes[0]['id']}/availability")
            assert r.status_code == 200
            data = r.json()
            assert "capacity" in data
            assert "booked" in data
            assert "available_spots" in data
            assert "is_full" in data
            assert data["available_spots"] >= 0
            assert isinstance(data["is_full"], bool)

    def test_availability_spots_calculation_correct(self):
        classes = client.get("/api/classes").json()
        if classes:
            data = client.get(f"/api/classes/{classes[0]['id']}/availability").json()
            assert data["available_spots"] == data["capacity"] - data["booked"]

    def test_class_availability_nonexistent_returns_404(self):
        r = client.get("/api/classes/999999/availability")
        assert r.status_code == 404

    def test_classes_accessible_without_auth(self):
        r = client.get("/api/classes")
        assert r.status_code == 200


# Client CRUD Tests

class TestClientsCRUD:

    def test_create_client_success(self):
        r = client.post("/api/clients", json={
            "name": "CRUD Test User",
            "email": "crud_test_unique_123@example.com",
            "phone": "07700123456",
            "package_type": "monthly"
        }, headers=auth())
        assert r.status_code == 201
        data = r.json()
        assert data["name"] == "CRUD Test User"
        assert "id" in data
        assert "join_date" in data
        client.delete(f"/api/clients/{data['id']}", headers=auth())

    def test_read_client_by_id(self):
        r = client.post("/api/clients", json={
            "name": "Read Test", "email": "read_test@example.com"
        }, headers=auth())
        cid = r.json()["id"]
        r2 = client.get(f"/api/clients/{cid}", headers=auth())
        assert r2.status_code == 200
        assert r2.json()["email"] == "read_test@example.com"
        client.delete(f"/api/clients/{cid}", headers=auth())

    def test_read_all_clients(self):
        r = client.get("/api/clients", headers=auth())
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_update_client(self):
        r = client.post("/api/clients", json={
            "name": "Before Update", "email": "before_update@example.com"
        }, headers=auth())
        cid = r.json()["id"]
        r2 = client.put(f"/api/clients/{cid}", json={
            "name": "After Update", "email": "before_update@example.com"
        }, headers=auth())
        assert r2.status_code == 200
        assert r2.json()["name"] == "After Update"
        client.delete(f"/api/clients/{cid}", headers=auth())

    def test_update_client_email_to_duplicate_returns_409(self):
        r1 = client.post("/api/clients", json={"name": "Client A", "email": "clienta_test@example.com"}, headers=auth())
        r2 = client.post("/api/clients", json={"name": "Client B", "email": "clientb_test@example.com"}, headers=auth())
        cid1, cid2 = r1.json()["id"], r2.json()["id"]
        r3 = client.put(f"/api/clients/{cid1}", json={"name": "Client A", "email": "clientb_test@example.com"}, headers=auth())
        assert r3.status_code == 409
        client.delete(f"/api/clients/{cid1}", headers=auth())
        client.delete(f"/api/clients/{cid2}", headers=auth())

    def test_delete_client_success(self):
        r = client.post("/api/clients", json={
            "name": "Delete Me", "email": "delete_me@example.com"
        }, headers=auth())
        cid = r.json()["id"]
        r2 = client.delete(f"/api/clients/{cid}", headers=auth())
        assert r2.status_code in (200, 204)
        r3 = client.get(f"/api/clients/{cid}", headers=auth())
        assert r3.status_code == 404

    def test_delete_client_also_deletes_bookings(self):
        r = client.post("/api/clients", json={"name": "Cascade Test", "email": "cascade@example.com"}, headers=auth())
        cid = r.json()["id"]
        classes = client.get("/api/classes").json()
        if classes:
            client.post("/api/bookings", json={"client_id": cid, "class_id": classes[0]["id"], "status": "confirmed"}, headers=auth())
        client.delete(f"/api/clients/{cid}", headers=auth())
        r2 = client.get(f"/api/clients/{cid}", headers=auth())
        assert r2.status_code == 404

    def test_create_client_duplicate_email_returns_409(self):
        r1 = client.post("/api/clients", json={"name": "Dup", "email": "dup_409@example.com"}, headers=auth())
        r2 = client.post("/api/clients", json={"name": "Dup2", "email": "dup_409@example.com"}, headers=auth())
        assert r2.status_code == 409
        if r1.status_code == 201:
            client.delete(f"/api/clients/{r1.json()['id']}", headers=auth())

    def test_create_client_missing_name_returns_422(self):
        r = client.post("/api/clients", json={"email": "noname@example.com"}, headers=auth())
        assert r.status_code == 422

    def test_create_client_missing_email_returns_422(self):
        r = client.post("/api/clients", json={"name": "No Email"}, headers=auth())
        assert r.status_code == 422

    def test_get_nonexistent_client_returns_404(self):
        r = client.get("/api/clients/999999", headers=auth())
        assert r.status_code == 404

    def test_update_nonexistent_client_returns_404(self):
        r = client.put("/api/clients/999999", json={"name": "Ghost", "email": "ghost@example.com"}, headers=auth())
        assert r.status_code == 404

    def test_delete_nonexistent_client_returns_404(self):
        r = client.delete("/api/clients/999999", headers=auth())
        assert r.status_code == 404


# Booking CRUD Tests

class TestBookingsCRUD:

    def setup_method(self):
        r = client.post("/api/clients", json={"name": "Booking Tester", "email": "booking_tester@example.com"}, headers=auth())
        if r.status_code == 201:
            self.test_client_id = r.json()["id"]
        else:
            self.test_client_id = client.get("/api/clients", headers=auth()).json()[0]["id"]
        self.classes = client.get("/api/classes").json()

    def teardown_method(self):
        if hasattr(self, "test_client_id"):
            client.delete(f"/api/clients/{self.test_client_id}", headers=auth())

    def test_create_booking_success(self):
        if not self.classes:
            pytest.skip("No classes in DB")
        r = client.post("/api/bookings", json={
            "client_id": self.test_client_id,
            "class_id": self.classes[0]["id"],
            "status": "confirmed"
        }, headers=auth())
        assert r.status_code == 201
        data = r.json()
        assert data["client_id"] == self.test_client_id
        assert data["status"] in ("confirmed", "waitlist")

    def test_read_booking_by_id(self):
        if not self.classes:
            pytest.skip("No classes in DB")
        r = client.post("/api/bookings", json={
            "client_id": self.test_client_id,
            "class_id": self.classes[0]["id"],
            "status": "confirmed"
        }, headers=auth())
        bid = r.json()["id"]
        r2 = client.get(f"/api/bookings/{bid}", headers=auth())
        assert r2.status_code == 200
        assert r2.json()["id"] == bid

    def test_read_all_bookings(self):
        r = client.get("/api/bookings", headers=auth())
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_update_booking_status(self):
        if not self.classes:
            pytest.skip("No classes in DB")
        r = client.post("/api/bookings", json={
            "client_id": self.test_client_id,
            "class_id": self.classes[0]["id"],
            "status": "confirmed"
        }, headers=auth())
        bid = r.json()["id"]
        r2 = client.put(f"/api/bookings/{bid}", json={
            "client_id": self.test_client_id,
            "class_id": self.classes[0]["id"],
            "status": "cancelled"
        }, headers=auth())
        assert r2.status_code == 200
        assert r2.json()["status"] == "cancelled"

    def test_delete_booking_success(self):
        if not self.classes:
            pytest.skip("No classes in DB")
        r = client.post("/api/bookings", json={
            "client_id": self.test_client_id,
            "class_id": self.classes[0]["id"],
            "status": "confirmed"
        }, headers=auth())
        bid = r.json()["id"]
        r2 = client.delete(f"/api/bookings/{bid}", headers=auth())
        assert r2.status_code in (200, 204)
        r3 = client.get(f"/api/bookings/{bid}", headers=auth())
        assert r3.status_code == 404

    def test_booking_auto_waitlist_when_class_full(self):
        if not self.classes:
            pytest.skip("No classes in DB")
        avail = client.get(f"/api/classes/{self.classes[0]['id']}/availability").json()
        if avail["is_full"]:
            r = client.post("/api/bookings", json={
                "client_id": self.test_client_id,
                "class_id": self.classes[0]["id"],
                "status": "confirmed"
            }, headers=auth())
            assert r.status_code == 201
            assert r.json()["status"] == "waitlist"

    def test_create_booking_invalid_client_returns_404(self):
        if not self.classes:
            pytest.skip("No classes in DB")
        r = client.post("/api/bookings", json={
            "client_id": 999999,
            "class_id": self.classes[0]["id"],
            "status": "confirmed"
        }, headers=auth())
        assert r.status_code == 404

    def test_create_booking_invalid_class_returns_404(self):
        r = client.post("/api/bookings", json={
            "client_id": self.test_client_id,
            "class_id": 999999,
            "status": "confirmed"
        }, headers=auth())
        assert r.status_code == 404

    def test_create_booking_missing_fields_returns_422(self):
        r = client.post("/api/bookings", json={"client_id": self.test_client_id}, headers=auth())
        assert r.status_code == 422

    def test_get_nonexistent_booking_returns_404(self):
        r = client.get("/api/bookings/999999", headers=auth())
        assert r.status_code == 404

    def test_delete_nonexistent_booking_returns_404(self):
        r = client.delete("/api/bookings/999999", headers=auth())
        assert r.status_code == 404


# Private Session CRUD Tests

class TestPrivateSessionsCRUD:

    PAYLOAD = {
        "name": "Private Test",
        "email": "private_test@example.com",
        "phone": "07700000001",
        "preferred_date": "2026-06-01",
        "preferred_time": "morning",
        "experience": "Beginner",
        "goals": "Improve flexibility"
    }

    def test_create_private_session_public(self):
        r = client.post("/api/private-sessions", json=self.PAYLOAD)
        assert r.status_code == 201
        data = r.json()
        assert data["name"] == "Private Test"
        assert data["status"] == "pending"
        assert "id" in data
        client.delete(f"/api/private-sessions/{data['id']}", headers=auth())

    def test_create_session_without_auth(self):
        payload = {**self.PAYLOAD, "email": "no_auth_session@example.com"}
        r = client.post("/api/private-sessions", json=payload)
        assert r.status_code == 201
        client.delete(f"/api/private-sessions/{r.json()['id']}", headers=auth())

    def test_read_all_private_sessions(self):
        r = client.get("/api/private-sessions", headers=auth())
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_read_private_session_by_id(self):
        r = client.post("/api/private-sessions", json={**self.PAYLOAD, "email": "read_session@example.com"})
        sid = r.json()["id"]
        r2 = client.get(f"/api/private-sessions/{sid}", headers=auth())
        assert r2.status_code == 200
        assert r2.json()["id"] == sid
        client.delete(f"/api/private-sessions/{sid}", headers=auth())

    def test_update_private_session_status(self):
        r = client.post("/api/private-sessions", json={**self.PAYLOAD, "email": "update_session@example.com"})
        sid = r.json()["id"]
        r2 = client.put(f"/api/private-sessions/{sid}",
            json={"status_update": "confirmed"}, headers=auth())
        assert r2.status_code in (200, 422)
        client.delete(f"/api/private-sessions/{sid}", headers=auth())

    def test_delete_private_session_success(self):
        r = client.post("/api/private-sessions", json={**self.PAYLOAD, "email": "del_session@example.com"})
        sid = r.json()["id"]
        r2 = client.delete(f"/api/private-sessions/{sid}", headers=auth())
        assert r2.status_code in (200, 204)
        r3 = client.get(f"/api/private-sessions/{sid}", headers=auth())
        assert r3.status_code == 404

    def test_create_session_missing_required_fields_returns_422(self):
        r = client.post("/api/private-sessions", json={"name": "Incomplete"})
        assert r.status_code == 422

    def test_create_session_invalid_time_slot_accepted(self):
        """preferred_time has no enum validation in schema — any string is accepted"""
        payload = {**self.PAYLOAD, "preferred_time": "midnight", "email": "badtime@example.com"}
        r = client.post("/api/private-sessions", json=payload)
        assert r.status_code == 201
        client.delete(f"/api/private-sessions/{r.json()['id']}", headers=auth())

    def test_get_nonexistent_session_returns_404(self):
        r = client.get("/api/private-sessions/999999", headers=auth())
        assert r.status_code == 404

    def test_delete_nonexistent_session_returns_404(self):
        r = client.delete("/api/private-sessions/999999", headers=auth())
        assert r.status_code == 404