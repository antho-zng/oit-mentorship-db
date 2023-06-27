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

    console.log(formName);

    props.authenticate(username, password, formName);
  };

  return (
    <div className={style.container}>
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
          <TextField
            id='outlined-required-error'
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
          {error && error.response && <div> {error.response.data} </div>}
        </div>
      </Box>
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
