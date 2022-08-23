import React from "react";
import { Route, Redirect } from "react-router";

const ProtectedRoute = ({ children, component, ...props }) => {
    // const user = localStorage.getItem('user');
    const user = localStorage.getItem('user');
    const Component = component;
    return (
        <Route
            {...props}
            render={
                ({ location }) => user ? children || <Component/>: (
                    <Redirect to={{
                        pathname: "/",
                        state: {from: location}
                    }} />
                )
            }
        />
    )



}

export default ProtectedRoute;