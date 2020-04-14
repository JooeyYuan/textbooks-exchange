import React from 'react';
import Icon, { SmileOutlined } from '@ant-design/icons';

function Footer() {
  return (
    <div
      style={{
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
      }}
    >
      <p>
        {' '}
        Happy Study, Happy Textbooks Exchange <SmileOutlined type='smile' />
      </p>
      <p>Have question? email us at help@TBooks.com</p>
    </div>
  );
}

export default Footer;
