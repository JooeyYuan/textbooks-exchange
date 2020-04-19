import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Avatar } from 'antd';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import ShoppingFilled from '@ant-design/icons/ShoppingFilled';
import ScheduleOutlined from '@ant-design/icons/ScheduleOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

import { useDispatch } from 'react-redux';
import { fetchProfile, updateProfile } from '../../actions/user_actions';

const { TextArea } = Input;
const sex = [
  { key: '', value: "I don't want to provide" },
  { key: 'male', value: 'Male' },
  { key: 'female', value: 'Female' },
];

function ProfilePage() {
  const dispatch = useDispatch();
  const [emailValue, setemailValue] = useState('');
  const [fullnameValue, setfullnameValue] = useState('');
  const [birthdayValue, setbirthdayValue] = useState('');
  const [majorValue, setmajorValue] = useState('');
  const [sexValue, setsexValue] = useState(1);
  const [phoneValue, setphoneValue] = useState('');
  const [descriptionValue, setdescriptionValue] = useState('');
  const [addressValue, setaddressValue] = useState('');
  const [History, setHistory] = useState([]);
  const [Posts, setPosts] = useState([]);
  const [image, setimageValue] = useState('');

  useEffect(() => {
    Axios.get('/api/users/getHistory').then((response) => {
      if (response.data.success) {
        setHistory(response.data.history);
      } else {
        alert('Failed to get purchase history');
      }
    });
  }, []);

  useEffect(() => {
    Axios.get('/api/users/getPost').then((response) => {
      if (response.data.success) {
        setPosts(response.data.post);
      } else {
        alert('Failed to get post history');
      }
    });
  }, []);

  useEffect(() => {
    dispatch(fetchProfile()).then((response) => {
      setemailValue(response.payload.email);
      setfullnameValue(response.payload.fullname);
      setbirthdayValue(response.payload.birthday);
      setmajorValue(response.payload.major);
      setsexValue(response.payload.sex);
      setphoneValue(response.payload.phone);
      setdescriptionValue(response.payload.description);
      setaddressValue(response.payload.address);
      setimageValue(response.payload.image);
    });
  }, []);

  const onfullnameChange = (event) => {
    setfullnameValue(event.currentTarget.value);
  };
  const onbirthdayChange = (event) => {
    setbirthdayValue(event.currentTarget.value);
  };
  const onsexChange = (event) => {
    setsexValue(event.currentTarget.value);
  };
  const onphoneChange = (event) => {
    setphoneValue(event.currentTarget.value);
  };
  const ondescriptionChange = (event) => {
    setdescriptionValue(event.currentTarget.value);
  };
  const onaddressChange = (event) => {
    setaddressValue(event.currentTarget.value);
  };
  const onmajorChange = (event) => {
    setmajorValue(event.currentTarget.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (!fullnameValue) {
      return alert('fullname is required');
    }
    let dataToSubmit = {
      fullname: fullnameValue,
      birthday: birthdayValue,
      sex: sexValue,
      major: majorValue,
      phone: phoneValue,
      address: addressValue,
      description: descriptionValue,
    };
    dispatch(updateProfile(dataToSubmit)).then((response) => {
      alert('profile successfully updated');
    });
  };

  const renderImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return image;
    }
  };

  const removeItem = (productId) => {
    Axios.delete(`/api/product/products_by_id?id=${productId}`).then(
      (response) => {
        if (response.data.success) {
          alert(response.data.message);
        } else {
          alert('delete post failed');
        }
      }
    );
  };

  return (
    <div style={{ width: '80%', margin: '3rem auto ' }}>
      <div style={{ textAlign: 'left' }}>
        <h1>
          <Avatar src={image} alt='image' />
          My Profile{' '}
          <Link className='btn btn-light' to='/settings'>
            <ProfileOutlined type='setting' style={{ color: 'grey' }} />
          </Link>
        </h1>
      </div>
      <br />
      <Form onSubmit={onSubmit}>
        <label>Email</label>
        <Input value={emailValue} disabled />
        <br />
        <br />
        <label>Full Name</label>
        <Input onChange={onfullnameChange} value={fullnameValue} />
        <br />
        <br />
        <label>Major</label>
        <Input onChange={onmajorChange} value={majorValue} />
        <br />
        <br />
        <label>Birthday</label>
        <Input type='date' onChange={onbirthdayChange} value={birthdayValue} />
        <br />
        <br />
        <label>Sex</label>
        <br />
        <select
          style={{ width: 200, height: 30, borderRadius: 5 }}
          onChange={onsexChange}
          value={sexValue}
        >
          {sex.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Phone</label>
        <Input onChange={onphoneChange} value={phoneValue} />
        <br />
        <br />
        <label>Address</label>
        <Input onChange={onaddressChange} value={addressValue} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={ondescriptionChange} value={descriptionValue} />
        <br />
        <br />
        <Button type='dashed' size='large' onClick={onSubmit}>
          Update Profile
        </Button>
      </Form>
      <br />
      <br />

      <div style={{ textAlign: 'left' }}>
        <h1>
          My Purchase History <ShoppingFilled type='shopping' />
        </h1>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>Payment Id</th>
            <th>Textbook Title</th>
            <th>Textbook Price</th>
            <th>Textbook Quantity</th>
            <th>Date of Purchase</th>
          </tr>
        </thead>
        <tbody>
          {History.map((item) => (
            <tr key={item._id}>
              <td>{item.paymentId}</td>
              <td>{item.name}</td>
              <td>$ {item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.dateOfPurchase}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />

      <div style={{ textAlign: 'left' }}>
        <h1>
          My Post History <ScheduleOutlined type='schedule' />
        </h1>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>Textbook Image</th>
            <th>Textbook Title</th>
            <th>Textbook Author</th>
            <th>Textbook Price</th>
            <th>Date of Post</th>
            <th>Edit Post</th>
            <th>Delete Post</th>
          </tr>
        </thead>
        <tbody>
          {Posts.map((p) => (
            <tr key={p.title}>
              <td>
                <img
                  style={{ width: '70px' }}
                  alt='product'
                  src={renderImage(p.images)}
                />
              </td>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>$ {p.price}</td>
              <td>{p.dateOfPost}</td>
              <td>
                <a href={`/product/edit/${p.id}`}>
                  <Button type='dashed'>
                    <EditOutlined type='edit' />
                  </Button>
                </a>
              </td>
              <td>
                <Button
                  type='danger'
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you wish to delete this post?'
                      )
                    )
                      removeItem(p.id);
                  }}
                >
                  <DeleteOutlined type='delete' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfilePage;
