import { Fragment, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { ReactComponent as CrwnLogo } from "../../assets/crown.svg";
import { UserContext } from "../../context/user.context";
import { CartContext } from "../../context/cartContext";

import { signOutUser } from "../../utils/firebase/firebase.utils";
import CartIcon from "../../components/cart-icon.component/cart-icon-component";
import CartDropdown from "../../components/cart-dropdown/cart-dropdown-component";
import "./navigation-styles.scss";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const { isCartOpen } = useContext(CartContext);

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo--container" to="/">
          <CrwnLogo className="logo" />
        </Link>
        <div className="nav-links--container">
          <Link className="nav--link" to="/shop">
            SHOP
          </Link>
          <Link className="nav--link" to="/auth">
            CONTACT
          </Link>

          {currentUser ? (
            <span className="nav--link" onClick={signOutUser}>
              SIGN OUT
            </span>
          ) : (
            <Link className="nav--link" to="/auth">
              SIGN IN
            </Link>
          )}

          <CartIcon />
        </div>
        {isCartOpen && <CartDropdown />}
      </div>
      {/* the outlet here makes it possible to render the home and shop pages */}
      <Outlet />;
    </Fragment>
  );
};

export default Navigation;
