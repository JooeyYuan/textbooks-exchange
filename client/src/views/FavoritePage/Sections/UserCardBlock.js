import React from 'react';
import { Button } from 'antd';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

function UserCardBlock(props) {
  const renderFavoriteImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `/uploads/${image}`;
    }
  };

  const renderItems = () =>
    props.products &&
    props.products.map((product) => (
      <tr key={product._id}>
        <td>
          <img
            style={{ width: '70px' }}
            alt='product'
            src={renderFavoriteImage(product.images)}
          />
        </td>
        <td>{product.title} </td>
        <td>{product.author} </td>
        <td>$ {product.price} </td>
        <td>
          <Button type='danger' onClick={() => props.removeItem(product._id)}>
            <DeleteOutlined type='delete' />{' '}
          </Button>{' '}
        </td>
      </tr>
    ));

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Textbook Image</th>
            <th>Textbook Title</th>
            <th>Textbook Author</th>
            <th>Textbook Price</th>
            <th>Remove from Favorite</th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>
    </div>
  );
}

export default UserCardBlock;
