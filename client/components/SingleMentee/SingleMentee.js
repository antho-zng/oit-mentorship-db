import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';

/**
 * COMPONENT
 */
function SingleMentee(props) {
  useEffect(() => {
    props.getMentee(props.match.params.id);
  }, []);

  const mentee = useSelector((state) => state.mentee);
  console.log(mentee);

  return (
    <div>
      <p>Mentee</p>
      <h3>
        {mentee.firstName} {mentee.lastName}
      </h3>
      <p>Pronouns: {mentee.pronouns}</p>
      <p>Email: {mentee.email}</p>
      <p>Phone Number: {mentee.phoneNum}</p>
    </div>
  );
}

/**
 * CONTAINER
 */

const mapDispatchToProps = (dispatch) => {
  return {
    getMentee: (id) => {
      dispatch(getMentee(id));
    },
  };
};

export default connect(null, mapDispatchToProps)(SingleMentee);
