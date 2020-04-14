import React, { Suspense } from 'react';
import { Route, Switch, Redirect  } from 'react-router-dom';
import Home from "./views/Home/Home"
import NotFound from "./views/NotFound"
import LoginPage from "./views/LoginPage/LoginPage"
import RegisterPage from "./views/RegisterPage/RegisterPage"
import NavBar from "./views/NavBar/NavBar"
import Auth from "./auth"
import Footer from "./views/Footer/Footer"
import LandingPage from "./views/LandingPage/LandingPage"
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
import EditProductPage from './views/EditProductPage/EditProductPage'
import DetailProductPage from './views/DetailProductPage/DetailProductPage'
import CartPage from './views/CartPage/CartPage'
import Profile from './views/ProfilePage/ProfilePage'
import Setting from './views/ProfilePage/Setting'
import FavoritePage from "./views/FavoritePage/FavoritePage"
import ChatsPage from "./views/ChatPage/ChatsPage"

const App = () => {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/Home" component={Auth(Home, null)} />
          <Route exact path="/">
            <Redirect to="/Home" />
          </Route>
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/chats" component={Auth(ChatsPage, null)} />
          <Route exact path="/textbook" component={Auth(LandingPage, null)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/edit/:productId" component={Auth(EditProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/profile" component={Auth(Profile, true)} />
          <Route exact path="/settings" component={Auth(Setting, true)} />
          <Route exact path="/favorite" component={Auth(FavoritePage, null)} />
          <Route component={NotFound}/>
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
