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
      <h3>hello! </h3>
      <p>
        Name: {mentee.firstName} {mentee.lastName}
      </p>
      <p>Email: {mentee.email}</p>
      <p>Candidate ID: {mentee.candidateID}</p>
      <p>Primary Focus: </p>
      <p>Secondary Focus: </p>
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
