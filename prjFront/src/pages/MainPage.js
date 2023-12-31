import React, { useReducer, useEffect } from 'react'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logger from 'use-reducer-logger';
import LoadingBox from '../components/LoadingBox.js'
import MessageBox from '../components/MessageBox.js'
import Product from "../components/Product";

const reducer = (state, action) => {
  switch (action.type) {
  case 'FETCH_REQUEST':
    return { ...state, loading: true };
  case 'FETCH SUCCESS':
    return { ...state, products: action.payload, loading: false };
  case 'FETCH_FAIL':
    return { ...state, loading: false, error: action.payload };
  default:
  return state;
}
};

export default function MainPage() 
{
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: "",
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
    <h1>Recommended Products</h1>
      <h1>Featured Products</h1>
      
      <div className="products">
      {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

