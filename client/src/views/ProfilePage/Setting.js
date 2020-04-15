import { Button, Form, Input } from 'antd';
import LockOutlined from '@ant-design/icons/LockOutlined';
import { changePassword } from '../../actions/user_actions';
import React, { useState } from 'react';

function Setting() {
  const [oldpassValue, setoldpassValue] = useState('');
  const [newpassValue, setnewpassValue] = useState('');
  const [confirmnewpassValue, setconfirmnewpassValue] = useState('');

  const onoldpassChange = (event) => {
    setoldpassValue(event.currentTarget.value);
  };
  const onnewpassChange = (event) => {
    setnewpassValue(event.currentTarget.value);
  };
  const onconfirmnewpassChange = (event) => {
    setconfirmnewpassValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (newpassValue != confirmnewpassValue) {
      return alert('new password must match');
    }
    let dataToSubmit = {
      oldPassword: oldpassValue,
      newPassword: newpassValue,
    };
    changePassword(dataToSubmit);
    alert('password successfully changed');
  };

  return (
    <div style={{ width: '80%', margin: '3rem auto ' }}>
      <div style={{ textAlign: 'left' }}>
        <h1>
          Change Password <LockOutlined type='lock' />
        </h1>
      </div>
      <Form onSubmit={onSubmit}>
        <label>Old Password</label>
        <Input onChange={onoldpassChange} value={oldpassValue} />
        <br />
        <br />
        <label>New Password</label>
        <Input onChange={onnewpassChange} value={newpassValue} />
        <br />
        <br />
        <label>Confirm New Password</label>
        <Input onChange={onconfirmnewpassChange} value={confirmnewpassValue} />
        <br />
        <br />
        <Button type='dashed' size='large' onClick={onSubmit}>
          Change Password
        </Button>
      </Form>
    </div>
  );
}

export default Setting;
