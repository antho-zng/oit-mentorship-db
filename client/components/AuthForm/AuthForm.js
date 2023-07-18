import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../../store';
import style from './AuthForm.module.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

/**
 * COMPONENT
 */
function AuthForm(props) {
  const { name, displayName, error } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    const formName = event.target.name;
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (formName === 'signup') {
      console.log(`signup`);
      const firstName = event.target.firstName.value;
      const lastName = event.target.lastName.value;
      const email = event.target.email.value;

      const signupReq = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
      };

      console.log(signupReq);
      props.authenticate(signupReq, formName);

      return;
    }

    const loginReq = {
      username: username,
      password: password,
    };

    props.authenticate(loginReq, formName);
  };

  return (
    <div className={style.container}>
      {name === 'login' ? (
        <div className={style.loginMessage}>
          Hi! For demo purposes, feel free to login with any of the following
          demo credentials:
          <ul>
            <li>USERNAME: testAcc1 / PASSWORD: test123</li>
            <li>USERNAME: testAcc2 / PASSWORD: test123</li>
            <li>USERNAME: testAcc3 / PASSWORD: test123</li>
            <li>USERNAME: testAcc4 / PASSWORD: test123</li>
          </ul>
          You are also welcome to{' '}
          <a href='/signup' className={style.linkText}>
            sign up
          </a>{' '}
          with your own credentials.
        </div>
      ) : (
        ''
      )}
      <Box
        component='form'
        name={name}
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
        className={style.bodyContainer}
        onSubmit={handleSubmit}
      >
        <h2 className={style.header}>{displayName}</h2>
        <div className={style.body}>
          {name === 'signup' ? (
            <div className={style.body}>
              <TextField
                id='outlined-required'
                required
                label='First Name'
                name='firstName'
                inputProps={{
                  className: style.textFieldInput,
                }}
                InputProps={{
                  className: style.textFieldBox,
                }}
              />
              <TextField
                id='outlined-required'
                required
                label='Last Name'
                name='lastName'
                inputProps={{
                  className: style.textFieldInput,
                }}
                InputProps={{
                  className: style.textFieldBox,
                }}
              />
              <TextField
                id='outlined-required'
                required
                label='Email'
                name='email'
                inputProps={{
                  className: style.textFieldInput,
                }}
                InputProps={{
                  className: style.textFieldBox,
                }}
              />
            </div>
          ) : (
            ''
          )}

          <TextField
            id='outlined-required-error'
            required
            error={error}
            label={error ? 'Error' : 'Username'}
            name='username'
            inputProps={{
              className: style.textFieldInput,
            }}
            InputProps={{
              className: style.textFieldBox,
            }}
            helperText={error ? 'Invalid credentials.' : ''}
          />
          <TextField
            id='outlined-password-input-error'
            required
            error={error}
            label={error ? 'Error' : 'Password'}
            name='password'
            type='password'
            autoComplete='current-password'
            inputProps={{
              className: style.textFieldInput,
            }}
            InputProps={{
              className: style.textFieldBox,
            }}
            helperText={error ? 'Invalid credentials.' : ''}
          />
          <div className={style.buttonContainer}>
            <Button
              type='submit'
              variant='outlined'
              startIcon={<LoginRoundedIcon />}
            >
              {displayName}
            </Button>
          </div>
        </div>
      </Box>
      {error && error.response && (
        <div className={style.errorMessage}> {error.response.data} </div>
      )}
    </div>
  );
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.auth.error,
  };
};

const mapDispatch = {
  authenticate,
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
