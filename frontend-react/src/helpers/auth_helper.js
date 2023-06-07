import { UserManager } from 'oidc-client';

const settings = {
  authority: "https://api3.hireya.org/realms/admin_console_realm",
  client_id: "admin_console_client",
  client_secret: "auD2uP47zVYsegYH5eHoa1IPwuEytoBx",
  redirect_uri: "https://react2-liard.vercel.app/signin-callback.html",
  response_type: 'code',
  scope: "openid",
};

const userManager = new UserManager(settings);

export const getUser = () => {
    return userManager.getUser();
}

export const login = () => {
    return userManager.signinRedirect();
}

export const logout = () => {
    return userManager.signoutRedirect();
}
