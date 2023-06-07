import * as React from 'react';
import Header from '../components/Header';
import logo from '../logo.svg';
import './App.css';
import Keycloak from 'keycloak-js';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    const keycloakConfig = {
      url: 'https://api3.hireya.org/',
      realm: 'admin_console_realm',
      clientId: 'admin_console_client',
    };
    this.keycloak = new Keycloak({ ...keycloakConfig });

    this.state = { initialized: false, authenticated: false };
  }

  componentDidMount() {
    const initKeycloak = async () => {
      try {
        await this.keycloak.init({
          onLoad: 'login-required',
          enableLogging: true,
          flow: 'implicit',
        });
        this.setState({
          initialized: true,
          authenticated: this.keycloak.authenticated,
        });
      } catch (err) {
        console.error('Error initializing keycloak', err);
      }
    };
    initKeycloak();
  }

  login = () => {
    const { initialized, authenticated } = this.state;
    if (initialized && !authenticated) {
      this.keycloak.login();
    }
  };

  logout = () => {
    const { initialized, authenticated } = this.state;
    if (initialized && authenticated) {
      this.keycloak.logout();
    }
  };

  callAuthorizedApi = async () => {
    const headers = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.keycloak.token,
    };
    try {
      var response = await axios.get(
        'https://api2.hireya.org/api/microservice/dashboard/test',
        { headers }
      );
      console.log('Response given', response.data);
    } catch (err) {
      console.error('Error while sending request to api: ', err);
    }
  };

  render() {
    const { initialized, authenticated } = this.state;
    if (!initialized) return <span>Initializing ...</span>;
    return (
      <div className='App'>
        <Header
          pageTitle='Frontend client connected to Keycloak'
          logoSrc={logo}
        />
        {authenticated && (
          <>
            <div className='flex-col'>
              <div className='flex-col'>
                <span>You are logged in</span>
                <button className='btn btn-primary' onClick={this.logout}>
                  Logout
                </button>
              </div>
              <div className='flex-col' style={{ marginTop: '20px' }}>
                <button
                  className='btn btn-warning'
                  onClick={this.callAuthorizedApi}
                >
                  Call API
                </button>
              </div>
            </div>
          </>
        )}
        {!authenticated && (
          <button className='btn btn-primary' onClick={this.login}>
            Login
          </button>
        )}
      </div>
    );
  }
}

export default App;
