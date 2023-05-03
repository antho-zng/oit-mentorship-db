import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';

const questionCutoff = 8;

function SingleMentee(props) {
  useEffect(() => {
    props.getMentee(props.match.params.id);
  }, []);

  const mentee = useSelector((state) => state.mentee);
  const pronouns = useSelector((state) => state.mentee.pronouns || []);
  const firstName = useSelector((state) => state.mentee.firstName || []);
  const lastName = useSelector((state) => state.mentee.lastName || []);
  const cohort = useSelector((state) => state.mentee.cohort || []);

  const allQuestionsAndAnswers = useSelector(
    (state) => state.mentee.questions || []
  );

  const questionsAndAnswers = allQuestionsAndAnswers.slice(questionCutoff);

  // TO-DO : display mentee age instead of DOB

  return (
    <div className={style.menteeProfile}>
      <div className={style.sidebar} side='right'>
        <p>Mentee &gt; {mentee.acceptedStatus}</p>

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
          <span className={style.sidearSubhead}>DATE OF BIRTH</span>
          <br></br>
          {mentee.dateOfBirth}
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
        <p>
          <span className={style.sidearSubhead}>LOCATION</span>
          <br></br>
          {mentee.location}
        </p>
        <p>
          <span className={style.sidearSubhead}>COHORT</span>
          <br></br>
          {cohort.name}
        </p>
        {/* <p>Cohort: {cohort} </p> */}
      </div>
      <div className={style.questionsContainer}>
        <h3 className={style.questionsHeading}>Application Responses</h3>
        <div>
          {questionsAndAnswers.map((qaPair, idx) => {
            return (
              <div key={idx}>
                <p className={style.qaBlock}>
                  <span className={style.question}>{qaPair.text}</span>
                  <br></br>
                  {qaPair.answer.text}
                </p>
              </div>
            );
          })}
        </div>
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
