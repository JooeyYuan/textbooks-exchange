import React, { useContext } from 'react';
import { Menu, Badge, Tooltip } from 'antd';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { AppContext } from '../../../Context';

function RightMenu(props) {
  const { unreadMsgsCount } = useContext(AppContext);
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${'/api/users'}/logout`).then((response) => {
      if (response.status === 200) {
        localStorage.clear();
        props.history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key='mail'>
          <a href='/login' style={{ fontSize: 20 }}>
            Signin
          </a>
        </Menu.Item>
        <Menu.Item key='app'>
          <a href='/register' style={{ fontSize: 20 }}>
            Signup
          </a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key='profile'>
          <Tooltip placement='bottom' title='user profile'>
            <a href='/profile'>
              <UserAddOutlined style={{ fontSize: 25 }} />
            </a>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key='upload'>
          <Tooltip placement='bottom' title='post and sell'>
            <a href='/product/upload'>
              <UploadOutlined style={{ fontSize: 25 }} />
            </a>
          </Tooltip>
        </Menu.Item>

        <Menu.Item key='wishlist' style={{ paddingBottom: 8 }}>
          <Badge dot={Boolean(user.userData && user.userData.favorite.length)}>
            <Tooltip placement='bottom' title='wish list'>
              <a href='/favorite'>
                <HeartOutlined style={{ fontSize: 25 }} />
              </a>
            </Tooltip>
          </Badge>
        </Menu.Item>

        <Menu.Item key='cart' style={{ paddingBottom: 8 }}>
          <Badge count={user.userData && user.userData.cart.length}>
            <Tooltip placement='bottom' title='personal cart'>
              <a href='/user/cart'>
                <ShoppingCartOutlined style={{ fontSize: 25 }} />
              </a>
            </Tooltip>
          </Badge>
        </Menu.Item>

        <Menu.Item key='chat' style={{ paddingBottom: 8 }}>
          <Badge count={unreadMsgsCount}>
            <Tooltip placement='bottom' title='chats'>
              <a href='/chats'>
                <MessageOutlined style={{ fontSize: 25 }} />
              </a>
            </Tooltip>
          </Badge>
        </Menu.Item>

        <Menu.Item key='logout'>
          <Tooltip placement='bottom' title='sign out'>
            <a onClick={logoutHandler}>
              <LogoutOutlined style={{ fontSize: 25 }} />
            </a>
          </Tooltip>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
