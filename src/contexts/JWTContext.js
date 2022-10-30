import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  company: null,
  tokens: {},
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, tokens } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      tokens,
    };
  },
  LOGIN: (state, action) => {
    const { user, tokens, company } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      tokens,
      company,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    tokens: null,
  }),
  REGISTER: (state, action) => {
    const { user, tokens } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      tokens,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.post('auth/my-account');
          const { user, company } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
              company,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: {},
              company: {},
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: {},
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });
    const { tokens, user, company } = response.data;

    setSession(tokens.access.token);
    localStorage.setItem('refreshToken', tokens.refresh.token);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        tokens,
        company,
      },
    });

    return user;
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : '';

      if (refreshToken) {
        await axios.post('/auth/logout', {
          refreshToken,
        });
        setSession(null);
        dispatch({ type: 'LOGOUT' });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
