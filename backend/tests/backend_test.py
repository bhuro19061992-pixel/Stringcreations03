"""Backend tests for String Creations 03 API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or "https://fiber-art-market.preview.emergentagent.com"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_TOKEN = "stringcreations03-admin"

TINY_PNG = (
    "data:image/png;base64,"
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
)


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def admin(s):
    s2 = requests.Session()
    s2.headers.update({"Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN})
    return s2


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_products(s, admin):
    """Cleanup TEST_ prefixed products after all tests."""
    yield
    try:
        products = s.get(f"{API}/products", timeout=10).json()
        for p in products:
            if p.get("title", "").startswith("TEST_"):
                admin.delete(f"{API}/products/{p['id']}", timeout=10)
    except Exception:
        pass


# ---------- Root / Health ----------
class TestRoot:
    def test_root(self, s):
        r = s.get(f"{API}/", timeout=10)
        assert r.status_code == 200
        assert "String Creations 03" in r.json().get("message", "")


# ---------- Admin verify ----------
class TestAdminVerify:
    def test_verify_valid(self, s):
        r = s.post(f"{API}/admin/verify", headers={"X-Admin-Token": ADMIN_TOKEN}, timeout=10)
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_verify_invalid(self, s):
        r = s.post(f"{API}/admin/verify", headers={"X-Admin-Token": "wrong"}, timeout=10)
        assert r.status_code == 401

    def test_verify_missing(self, s):
        r = s.post(f"{API}/admin/verify", timeout=10)
        assert r.status_code == 401


# ---------- Settings ----------
class TestSettings:
    def test_get_settings_default(self, s):
        r = s.get(f"{API}/settings", timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert "brand_name" in d
        assert "about_long" in d
        assert "whatsapp" in d
        assert "email" in d
        assert d["brand_name"] == "String Creations 03" or isinstance(d["brand_name"], str)

    def test_update_settings_requires_auth(self, s):
        r = s.put(f"{API}/settings", json={"whatsapp": "919999888877"}, timeout=10)
        assert r.status_code == 401

    def test_update_settings_ok(self, s, admin):
        # capture original
        orig = s.get(f"{API}/settings", timeout=10).json()
        new_wa = "919812345678"
        new_email = "test_hello@stringcreations03.com"
        new_about = "TEST_ABOUT string art is drawing with thread."

        r = admin.put(
            f"{API}/settings",
            json={"whatsapp": new_wa, "email": new_email, "about_long": new_about},
            timeout=10,
        )
        assert r.status_code == 200
        d = r.json()
        assert d["whatsapp"] == new_wa
        assert d["email"] == new_email
        assert d["about_long"] == new_about

        # GET to verify persistence
        r2 = s.get(f"{API}/settings", timeout=10)
        d2 = r2.json()
        assert d2["whatsapp"] == new_wa
        assert d2["email"] == new_email
        assert d2["about_long"] == new_about

        # restore
        admin.put(
            f"{API}/settings",
            json={
                "whatsapp": orig.get("whatsapp"),
                "email": orig.get("email"),
                "about_long": orig.get("about_long"),
            },
            timeout=10,
        )


# ---------- Products CRUD ----------
class TestProductsCRUD:
    created_id = None

    def test_list_products_public(self, s):
        r = s.get(f"{API}/products", timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_requires_auth(self, s):
        r = s.post(f"{API}/products", json={"title": "TEST_nope"}, timeout=10)
        assert r.status_code == 401

    def test_create_product(self, admin, s):
        payload = {
            "title": "TEST_Portrait One",
            "description": "TEST product",
            "price": "\u20b94,800",
            "size": "24x24",
            "colour": "Ivory",
            "thread": "Cotton",
            "category": "Portrait",
            "images": [TINY_PNG],
            "in_stock": True,
            "featured": True,
        }
        r = admin.post(f"{API}/products", json=payload, timeout=10)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["title"] == payload["title"]
        assert d["category"] == "Portrait"
        assert d["images"] == [TINY_PNG]
        assert isinstance(d["id"], str) and len(d["id"]) > 0
        assert d["featured"] is True
        TestProductsCRUD.created_id = d["id"]

        # verify persistence in list
        r2 = s.get(f"{API}/products", timeout=10)
        ids = [p["id"] for p in r2.json()]
        assert d["id"] in ids

    def test_get_single_product(self, s):
        assert TestProductsCRUD.created_id
        r = s.get(f"{API}/products/{TestProductsCRUD.created_id}", timeout=10)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Portrait One"

    def test_update_product(self, admin, s):
        pid = TestProductsCRUD.created_id
        assert pid
        r = admin.put(
            f"{API}/products/{pid}",
            json={"title": "TEST_Portrait Updated", "price": "\u20b95,500"},
            timeout=10,
        )
        assert r.status_code == 200
        d = r.json()
        assert d["title"] == "TEST_Portrait Updated"
        assert d["price"] == "\u20b95,500"

        r2 = s.get(f"{API}/products/{pid}", timeout=10)
        assert r2.json()["title"] == "TEST_Portrait Updated"

    def test_update_requires_auth(self, s):
        pid = TestProductsCRUD.created_id
        r = s.put(f"{API}/products/{pid}", json={"title": "TEST_hack"}, timeout=10)
        assert r.status_code == 401

    def test_update_404(self, admin):
        r = admin.put(f"{API}/products/nonexistent-id", json={"title": "x"}, timeout=10)
        assert r.status_code == 404

    def test_delete_requires_auth(self, s):
        pid = TestProductsCRUD.created_id
        r = s.delete(f"{API}/products/{pid}", timeout=10)
        assert r.status_code == 401

    def test_delete_product(self, admin, s):
        pid = TestProductsCRUD.created_id
        assert pid
        r = admin.delete(f"{API}/products/{pid}", timeout=10)
        assert r.status_code == 200
        assert r.json().get("ok") is True

        # confirm 404 after delete
        r2 = s.get(f"{API}/products/{pid}", timeout=10)
        assert r2.status_code == 404

    def test_delete_404(self, admin):
        r = admin.delete(f"{API}/products/nonexistent-id", timeout=10)
        assert r.status_code == 404
