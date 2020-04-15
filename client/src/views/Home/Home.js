import React from 'react';
import { Button } from 'antd';
import Icon, { ReadOutlined, SafetyOutlined, ShopOutlined, SearchOutlined, SaveOutlined, PayCircleOutlined } from '@ant-design/icons';
import './Home.css';
import { Row, Col } from 'antd';

function Home() {
  return (
    <div>
      <div id='home-hero'>
        <div className='container'>
          <h1 style={{ color: 'white', fontSize: 50 }}>Textbook Exchange</h1>
          <h1 style={{ color: 'white', fontSize: 30 }}>
            We are here to help you save money
            <br />
            We can help make your college study easy and convenient
          </h1>
        </div>
      </div>
      <div className='container'>
        <h2 style={{ fontSize: 50, textAlign: 'center', paddingTop: '100px' }}>
          What can you do with Textbook Exchange?
          <br />
        </h2>
        <h2 style={{ fontSize: '1.75rem', textAlign: 'center' }}>
          It's so simple!
        </h2>
        <hr />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className='gutter-row' span={12}>
              <div>
                <SearchOutlined type='search' style={{ fontSize: '4em' }} />
                <h3 style={{ fontSize: '30px' }}>Search textbooks</h3>
                <p
                  style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    color: 'grey',
                  }}
                >
                  Use filters to search for any textbooks you look for
                </p>
                <hr />
                <br />
              </div>
            </Col>
            <Col className='gutter-row' span={12}>
              <div>
                <ReadOutlined type='read' style={{ fontSize: '4em' }} />
                <h3 style={{ fontSize: '30px' }}>Browse contents</h3>
                <p
                  style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    color: 'grey',
                  }}
                >
                  See all on-sale textbooks' information
                </p>
                <hr />
                <br />
              </div>
            </Col>
            <Col className='gutter-row' span={12}>
              <div>
                <PayCircleOutlined type='dollar' style={{ fontSize: '4em' }} />
                <h3 style={{ fontSize: '30px' }}>Purchase cheap textbooks</h3>
                <p
                  style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    color: 'grey',
                  }}
                >
                  Purchase textbooks you need in a low price
                </p>
                <hr />
                <br />
              </div>
            </Col>
            <Col className='gutter-row' span={12}>
              <div>
                <SaveOutlined type='save' style={{ fontSize: '4em' }} />
                <h3 style={{ fontSize: '30px' }}>Collect favorites</h3>
                <p
                  style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    color: 'grey',
                  }}
                >
                  Save your desired textbooks to your favorite list for future
                </p>
                <hr />
                <br />
              </div>
            </Col>
            <Col className='gutter-row' span={12}>
              <div>
                <SafetyOutlined type='safety' style={{ fontSize: '4em' }} />
                <h3 style={{ fontSize: '30px' }}>Secure information</h3>
                <p
                  style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    color: 'grey',
                  }}
                >
                  Secure information, personal privacy and user authentication
                </p>
                <hr />
                <br />
              </div>
            </Col>
            <Col className='gutter-row' span={12}>
              <div>
                <ShopOutlined type='shop' style={{ fontSize: '4em' }} />
                <h3 style={{ fontSize: '30px' }}>Post and sell</h3>
                <p
                  style={{
                    fontSize: '18px',
                    marginBottom: '30px',
                    color: 'grey',
                  }}
                >
                  Upload and sell your own used textbooks to help other students
                </p>
                <hr />
                <br />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div id='home-hero1'>
        <div className='container'>
          <h2 className='intro'>
            Stop wasting money
            <br />
            Start exchanging old textbooks
            <br />
            <a href='/textbook'>
              <Button
                className='start'
                type='default'
                size='large'
                icon='right'
              >
                Let's get started
              </Button>
            </a>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Home;
