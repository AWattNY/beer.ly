import React from 'react';
import styles from './App.css';
import NavBar from '../NavBar/NavBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UserProfile from '../UserProfile/userProfile';
const cartSize = 4;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      inCheckout: false,
      auth: this.props.route.auth,
      profile: this.props.route.auth.getProfile(),
      showUserProfile: false
    };

    // listen to profile_updated events to update internal state
    this.props.route.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile});
    });
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  addToCart(beer) {
    // https://facebook.github.io/react/tutorial/tutorial.html#why-immutability-is-important
    if (this.state.cart.length === cartSize) {
      return;
    }
    const newCart = this.state.cart.slice(0);
    newCart.push(beer);
    this.setState({
      cart: newCart
    });
  }
  toggleUserProfile() {
    this.setState({ showUserProfile: !this.state.showUserProfile });
  }
  removeFromCart(indexToRemove) {
    const newCart = this.state.cart.slice(0);
    newCart.splice(indexToRemove, 1);
    if (this.state.inCheckout) {
      window.history.back();
    }
    this.setState({
      cart: newCart,
      inCheckout: false
    });
  }

  checkout() {
    window.history.pushState('not sure what this arg is', 'Title-In-Browser-History', '/checkout');
    this.setState({inCheckout: true});
  }

  render() {
    const childrenWithMoreProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        auth: this.props.route.auth, // eslint-disable-line
        cart: this.state.cart,
        addToCart: this.addToCart,
        removeFromCart: this.removeFromCart,
        checkout: this.checkout,
        inCheckout: this.state.inCheckout
      });
    });
    return (
      <MuiThemeProvider>
        <div className={styles.app}>
          <NavBar
            cart={this.state.cart}
            location={this.props.location}
            showProfile={this.toggleUserProfile.bind(this)}
            profile={this.state.profile}
            auth={this.state.auth}
            checkout={this.checkout}
            inCheckout={this.state.inCheckout}
          />
          <UserProfile profile={this.state.profile} open={this.state.showUserProfile}/>
        
          {childrenWithMoreProps}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
};

export default App;
