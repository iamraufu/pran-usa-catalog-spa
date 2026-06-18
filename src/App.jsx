import {
  useEffect,
  useState,
  useMemo,
  useDeferredValue,
} from "react";

import ProductCard from "./components/Product/ProductCard";
import "./App.css";

const ITEMS_PER_PAGE = 40;

function App() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [page, setPage] = useState(1);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const deferredSearch =
    useDeferredValue(searchText);

  useEffect(() => {
    fetch("./data/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        products
          .map((p) => p.category)
          .filter(Boolean)
      ),
    ];

    return ["ALL", ...unique.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "ALL") {
      result = result.filter(
        (p) =>
          p.category === selectedCategory
      );
    }

    if (deferredSearch) {
      const search =
        deferredSearch.toLowerCase();

      result = result.filter(
        (p) =>
          p.product_name
            ?.toLowerCase()
            .includes(search) ||
          p.category
            ?.toLowerCase()
            .includes(search) ||
          p.subcategory
            ?.toLowerCase()
            .includes(search)
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    deferredSearch,
  ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [selectedCategory, deferredSearch]);

  const totalPages = Math.ceil(
    filteredProducts.length /
      ITEMS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const start =
      (page - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProducts, page]);

  const groupedProducts = useMemo(() => {
    const grouped = {};

    paginatedProducts.forEach(
      (product) => {
        const category =
          product.category || "Other";

        const subcategory =
          product.subcategory ||
          "General";

        if (!grouped[category]) {
          grouped[category] = {};
        }

        if (
          !grouped[category][
            subcategory
          ]
        ) {
          grouped[category][
            subcategory
          ] = [];
        }

        grouped[category][
          subcategory
        ].push(product);
      }
    );

    return grouped;
  }, [paginatedProducts]);

  useEffect(() => {
  if (searchText.trim()) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategory("ALL");
  }
}, [searchText]);

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      <div className="app">

        <div className="mobile-header">
          <button
            className="menu-toggle"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
          >
            ☰ Categories
          </button>
        </div>

        <aside
          className={`sidebar ${
            mobileMenuOpen
              ? "open"
              : ""
          }`}
        >
          <h2>Categories</h2>

          {categories.map((cat) => (
            <button
              key={cat}
              className={
                selectedCategory === cat
                  ? "active-category"
                  : ""
              }
              onClick={() => {
                setSelectedCategory(
                  cat
                );
                setMobileMenuOpen(
                  false
                );
              }}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="content">

          <div className="top-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
            />

            <span className="product-count">
              {
                filteredProducts.length
              }{" "}
              Products
            </span>
          </div>

          {Object.entries(
            groupedProducts
          ).map(
            ([
              category,
              subcategories,
            ]) => (
              <div
                key={category}
                className="category-block"
              >
                <h2>
                  {category}
                </h2>

                {Object.entries(
                  subcategories
                ).map(
                  ([
                    subcategory,
                    products,
                  ]) => (
                    <div
                      key={
                        subcategory
                      }
                    >
                      <h3>
                        {subcategory}
                      </h3>

                      <div className="product-grid">
                        {products.map(
                          (
                            product
                          ) => (
                            <ProductCard
                              key={
                                product.sku
                              }
                              product={
                                product
                              }
                            />
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )
          )}

          <div className="pagination">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  page - 1
                )
              }
            >
              Previous
            </button>

            <span>
              Page {page} of{" "}
              {totalPages}
            </span>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(
                  page + 1
                )
              }
            >
              Next
            </button>

          </div>

        </main>
      </div>
    </>
  );
}

export default App;