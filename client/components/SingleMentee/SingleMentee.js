import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';

function SingleMentee(props) {
  useEffect(() => {
    props.getMentee(props.match.params.id);
    // const cohort = mentee.cohort.name;
  }, []);

  const mentee = useSelector((state) => state.mentee);
  const pronouns = useSelector((state) => state.mentee.pronouns || []);
  const firstName = useSelector((state) => state.mentee.firstName || []);
  const lastName = useSelector((state) => state.mentee.lastName || []);

  console.log('mentee');
  console.log(mentee);

  // TO-DO : display mentee cohort

  return (
    <div>
      <div className={style.sidebar} side='right'>
        <p>Mentee</p>

        <h2>
          {firstName} <br></br>
          {lastName}
        </h2>
        <p>
          <span className={style.sidearSubhead}>PRONOUNS</span>
          <br></br>
          {pronouns.map((pronoun, idx) => {
            return (
              <span key={idx}>
                {pronoun}
                <br></br>
              </span>
            );
          })}
        </p>
        <p>
          <span className={style.sidearSubhead}>EMAIL</span>
          <br></br>
          {mentee.email}
        </p>
        <p>
          <span className={style.sidearSubhead}>PHONE</span>
          <br></br>
          {mentee.phoneNum}
        </p>
        {/* <p>Cohort: {cohort} </p> */}
      </div>
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
