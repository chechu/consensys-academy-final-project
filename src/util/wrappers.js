import { UserAuthWrapper } from 'redux-auth-wrapper';
import { routerActions } from 'react-router-redux';
import { ROLES } from './contracts/marketplace';

// Layout Component Wrappers

export const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.user.data,
    redirectAction: routerActions.replace,
    failureRedirectPath: '/', // '/login' by default.
    wrapperDisplayName: 'UserIsAuthenticated',
});

export const UserIsNotAuthenticated = UserAuthWrapper({
    authSelector: state => state.user,
    redirectAction: routerActions.replace,
    failureRedirectPath: (state, ownProps) => ownProps.location.query.redirect || '/dashboard',
    wrapperDisplayName: 'UserIsNotAuthenticated',
    predicate: user => user.data === null,
    allowRedirectBack: false,
});

// UI Component Wrappers

export const VisibleOnlyAuth = UserAuthWrapper({
    authSelector: state => state.user,
    wrapperDisplayName: 'VisibleOnlyAuth',
    predicate: user => user.data,
    FailureComponent: null,
});

export const HiddenOnlyAuth = UserAuthWrapper({
    authSelector: state => state.user,
    wrapperDisplayName: 'HiddenOnlyAuth',
    predicate: user => user.data === null,
    FailureComponent: null,
});

export const VisibleOnlyAuthorized = UserAuthWrapper({
    authSelector: (state, ownProps) => ({ user: state.user, authorizedRoles: ownProps.authorizedRoles || 0 }),
    wrapperDisplayName: 'VisibleOnlyAuthorized',
    predicate: authData => authData.user && authData.user.data && authData.authorizedRoles.includes(authData.user.data.role.name),
    FailureComponent: null,
});
