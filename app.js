
// ====================================
// API CONFIGURATION
// ====================================
const API_URL = "https://p3-api-productos-v2.onrender.com/api/productos";

// Classroom demonstration key only.
// Browser JavaScript exposes this value to visitors.
const API_KEY = "my-secret-key-2026";

// HTML elements
const productsDiv = document.getElementById("products");
const message = document.getElementById("message");
const productForm = document.getElementById("productForm");
const refreshButton = document.getElementById("refreshButton");

// ====================================
// GET - DISPLAY PRODUCTS
// ====================================

async function loadProducts() {
    try {
        message.textContent = "Loading products...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const products = await response.json();

        productsDiv.innerHTML = "";

        if (products.length === 0) {
            message.textContent = "No products available.";
            return;
        }

        products.forEach(product => {
            const div = document.createElement("div");
            div.className = "product";

            const info = document.createElement("span");

            info.textContent =
                `${product.nombre} - $${product.precio} - Stock: ${product.stock}`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", () => {
                deleteProduct(product.id);
            });

            div.appendChild(info);
            div.appendChild(deleteButton);
            productsDiv.appendChild(div);
        });

        message.textContent =
            `${products.length} product(s) loaded successfully.`;

    } catch (error) {
        message.textContent =
            "Error connecting to API: " + error.message;
    }
}

// ====================================
// POST - ADD PRODUCT
// ====================================

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const product = {
        nombre: document.getElementById("name").value.trim(),
        precio: Number(document.getElementById("price").value),
        stock: Number(document.getElementById("stock").value)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        productForm.reset();
        await loadProducts();

        message.textContent = "Product added successfully!";

    } catch (error) {
        message.textContent =
            "Error adding product: " + error.message;
    }
});

// ====================================
// DELETE - REMOVE PRODUCT
// ====================================

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "x-api-key": API_KEY
            }
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        await loadProducts();
        message.textContent = "Product deleted successfully!";

    } catch (error) {
        message.textContent =
            "Error deleting product: " + error.message;
    }
}

// ====================================
// REFRESH PRODUCTS
// ====================================

refreshButton.addEventListener("click", loadProducts);

// Load products automatically
loadProducts();
