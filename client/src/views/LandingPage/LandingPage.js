import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Col, Card, Row, Button } from 'antd';
import Icon, { RocketOutlined, FilterOutlined } from '@ant-design/icons';
import ImageSlider from '../../components/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import {
  condition,
  price,
  level,
  department,
  category,
} from './Sections/Datas';
import SearchFeature from './Sections/SearchFeature';
import { Collapse } from 'antd';

const { Panel } = Collapse;
const { Meta } = Card;

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState();
  const [SearchTerms, setSearchTerms] = useState('');
  const [Filters, setFilters] = useState({
    condition: [],
    price: [],
    level: [],
    category: [],
    department: [],
  });

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: Limit,
    };
    getProducts(variables);
  }, []);

  const getProducts = (variables) => {
    Axios.post('/api/product/getProducts', variables).then((response) => {
      if (response.data.success) {
        if (variables.loadMore) {
          setProducts([...Products, ...response.data.products]);
        } else {
          setProducts(response.data.products);
        }
        setPostSize(response.data.postSize);
      } else {
        alert('Failed to fectch product datas');
      }
    });
  };

  const onLoadMore = () => {
    let skip = Skip + Limit;
    const variables = {
      skip: skip,
      limit: Limit,
      loadMore: true,
    };
    getProducts(variables);
    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24}>
        <Card
          hoverable={true}
          cover={
            <a href={`/product/${product._id}`}>
              {' '}
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    getProducts(variables);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    console.log('array', array);
    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };
    newFilters[category] = filters;
    if (category === 'price') {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }
    console.log(newFilters);
    showFilteredResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerms = (newSearchTerm) => {
    const variables = {
      skip: 0,
      limit: Limit,
      filters: Filters,
      searchTerm: newSearchTerm,
    };
    setSkip(0);
    setSearchTerms(newSearchTerm);
    getProducts(variables);
  };

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>
          {' '}
          Let's Make Use of Used Textbooks <RocketOutlined type='rocket' />{' '}
        </h2>
      </div>

      {/* Filter  */}
      <Collapse defaultActiveKey={['0']}>
        <Panel header='Filters' key='1'>
          <Row gutter={[8, 8]}>
            <Col lg={12} xs={12}>
              <label>
                <strong>
                  <FilterOutlined type='filter' />
                  Condition:
                </strong>
              </label>
              <CheckBox
                list={condition}
                handleFilters={(filters) => handleFilters(filters, 'condition')}
              />
            </Col>
            <Col lg={12} xs={12}>
              <label>
                <strong>
                  <FilterOutlined type='filter' />
                  Category:
                </strong>
              </label>
              <CheckBox
                list={category}
                handleFilters={(filters) => handleFilters(filters, 'category')}
              />
            </Col>
            <Col lg={12} xs={12}>
              <label>
                <strong>
                  <FilterOutlined type='filter' />
                  Department:
                </strong>
              </label>
              <CheckBox
                list={department}
                handleFilters={(filters) =>
                  handleFilters(filters, 'department')
                }
              />
            </Col>
            <Col lg={12} xs={12}>
              <label>
                <strong>
                  <FilterOutlined type='filter' />
                  Price:
                </strong>
              </label>
              <RadioBox
                list={price}
                handleFilters={(filters) => handleFilters(filters, 'price')}
              />
            </Col>
            <Col lg={12} xs={12}>
              <label>
                <strong>
                  <FilterOutlined type='filter' />
                  Program Level:
                </strong>
              </label>
              <CheckBox
                list={level}
                handleFilters={(filters) => handleFilters(filters, 'level')}
              />
            </Col>
          </Row>
        </Panel>
      </Collapse>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '1rem auto',
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerms} />
      </div>
      {Products.length === 0 ? (
        <div
          style={{
            display: 'flex',
            height: '300px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h2>No post yet...</h2>
        </div>
      ) : (
        <div>
          <Row gutter={[16, 16]}>{renderCards}</Row>
        </div>
      )}
      <br />
      <br />

      {PostSize >= Limit && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type='dashed' size='large' onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
