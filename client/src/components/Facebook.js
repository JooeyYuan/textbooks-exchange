import React from 'react';
import { useDispatch } from 'react-redux';
import {withRouter} from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import { facebookLogin } from '../actions/user_actions';

const Facebook = (props) => {
  const dispatch = useDispatch();

  const responseFacebook = (response) => {
    if (response.status !== 'unknown') {
      const { name, id, picture } = response;
      let dataToSubmit = {
        email: `${id}@facebook.com`,
        password: id,
        fullname: name,
        image: picture.data.url,
      };
  
      dispatch(facebookLogin(dataToSubmit)).then((response) => {
        if (response.payload.success) {
          window.localStorage.setItem(
            'userId',
            response.payload.userId
          );          
          props.history.push('/Home');
        } else {
          alert(JSON.stringify(response), null, 2);
        }
      });
    }
  };

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID}
      fields='name,email,picture'
      callback={responseFacebook}
    />
  );
};

export default withRouter(Facebook);