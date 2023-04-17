import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';

/**
 * COMPONENT
 */
function SingleMentee(props) {
  useEffect(() => {
    props.getMentee(props.match.params.id);
  }, []);

  console.log(props.match.params.id);

  return (
    <div>
      <h3>hello! </h3>
    </div>
  );
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMentee: (id) => {
      dispatch(getMentee(id));
    },
  };
};

export default connect(mapState, mapDispatchToProps)(SingleMentee);
