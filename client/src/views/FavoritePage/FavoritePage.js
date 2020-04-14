import React, { useEffect} from 'react'
import axios from 'axios';
import {
  getFavoriteItems,
  removeFavoriteItem,
} from '../../actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { useDispatch } from 'react-redux';

function FavoritePage(props) {
  const dispatch = useDispatch();

    useEffect(() => {
        let favoriteItems = [];
        if (props.user.userData && props.user.userData.favorite) {
            if (props.user.userData.favorite.length > 0) {
                props.user.userData.favorite.forEach(item => {
                    favoriteItems.push(item.id)
                });
                dispatch(getFavoriteItems(favoriteItems, props.user.userData.favorite))
            }
        }
    }, [props.user.userData])

    const removeFromFavorite = (productId) => {
      dispatch(removeFavoriteItem(productId))
          .then(() => {
              axios.get('/api/users/userFavoriteInfo')
                  .then(response => {
                      if (response.data.success) {
                        console.log(response.data.favorite)
                      } 
                      else {
                          alert('Failed to get favorite info')
                      }
                  })
          })
  }

  return (
      <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My Favorite</h1>
        <div>
            <UserCardBlock
                products={props.user.favoriteDetail}
                removeItem={removeFromFavorite}
            />
        </div>
    </div>
    )
  }

export default FavoritePage