// import React, { useState, useEffect } from "react";
// import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
// import { authenticatedFetch } from "../Dashboard/pages/authService";
// import "../Styles/Products.css"; // You might need to create this CSS file
// import Footer from './Footer';

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoadingProducts(true);
//       try {
//         const res = await authenticatedFetch("${API_BASE_URL}/api/v1/products/", { method: "GET" });
//         const responseData = await res.json();
//         if (res.ok) {
//           setProducts(responseData.products);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loadingProducts) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   return (
//     <div id="products">
//       <Container className="my-5" style={{paddingTop:"150px"}}>
//         <div className="text-center mb-5 products-page-header">
//           <h2 className="fw-bold">Our Products</h2>
//           <p className="text-secondary">Explore our range of handmade and locally sourced products that empower and support our community.</p>
//         </div>
//         <Row xs={1} md={2} lg={3} className="g-4">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <Col key={product.id} className="d-flex">
//                 <Card className="product-card">
//                   {product.image && (
//                     <Card.Img
//                       variant="top"
//                       src={`${API_BASE_URL}/${product.image}`}
//                       alt={product.name}
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
//                       }}
//                     />
//                   )}
//                   <Card.Body>
//                     <Card.Title>{product.name}</Card.Title>
//                     <Card.Text className="description">{product.description}</Card.Text>
//                     <Card.Text className="fw-bold text-success mt-auto">
//                       UGX {product.price.toLocaleString()}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <Col xs={12}>
//               <p className="text-center text-muted">No products found.</p>
//             </Col>
//           )}
//         </Row>
//       </Container>
//       <Footer/>
//     </div>
//   );
// };

// export default ProductsPage;

import React, { useState, useEffect } from "react";
import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
import { authenticatedFetch } from "../Dashboard/pages/authService";
import "../Styles/Products.css";
import Footer from './Footer';

const ProductsPage = () => {
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = 'http://127.0.0.1:5000'; 
    const [products, setProducts] = useState([]);
    const [pageContent, setPageContent] = useState({ title: "", description: "" });
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        const fetchProductsAndContent = async () => {
            setLoadingProducts(true);
            try {
                const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/`, { method: "GET" });
                const responseData = await res.json();
                if (res.ok) {
                    setProducts(responseData.products);
                    setPageContent(responseData.page_content);
                }
            } catch (err) {
                console.error("Error fetching products and content:", err);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProductsAndContent();
    }, []);

    if (loadingProducts) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <div id="products">
            <Container className="my-5" style={{ paddingTop: "150px" }}>
                <div className="text-center mb-5 products-page-header">
                    <h2 className="fw-bold">{pageContent.title}</h2>
                    <p className="text-secondary">{pageContent.description}</p>
                </div>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Col key={product.id} className="d-flex">
                                <Card className="product-card">
                                    {product.image && (
                                        <Card.Img
                                            variant="top"
                                            src={`${API_BASE_URL}/${product.image}`}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                                            }}
                                        />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text className="description">{product.description}</Card.Text>
                                        <Card.Text className="fw-bold text-success mt-auto">
                                            UGX {product.price.toLocaleString()}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12}>
                            <p className="text-center text-muted">No products found.</p>
                        </Col>
                    )}
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ProductsPage;