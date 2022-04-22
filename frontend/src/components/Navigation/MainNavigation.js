import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

const MainNavigation = (props) => {
    const ctx = useContext(AuthContext);
    return (
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h3>Easy Event</h3>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    {!ctx.token && (
                        <li>
                            <NavLink to="/auth">Authenticate</NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {ctx.token && (
                        <React.Fragment>
                            <li>
                                <NavLink to="/bookings">Bookings</NavLink>
                            </li>
                            <button onClick={ctx.logout}>Logout</button>
                        </React.Fragment>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;
