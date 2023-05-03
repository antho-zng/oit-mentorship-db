import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';
import Box from '@mui/material/Box';

function SingleMentee(props) {
  useEffect(() => {
    props.getMentee(props.match.params.id);
    // const cohort = mentee.cohort.name;
  }, []);

  const mentee = useSelector((state) => state.mentee);
  const pronouns = useSelector((state) => state.mentee.pronouns || []);
  const firstName = useSelector((state) => state.mentee.firstName || []);
  const lastName = useSelector((state) => state.mentee.lastName || []);

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
      <Box
        className={style.questionsContainer}
        sx={{
          width: 300,
          height: 300,
          backgroundColor: 'primary.dark',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      />
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
