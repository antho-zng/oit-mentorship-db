import React, { useEffect, useState, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import MenteeTable from './menteeTable';
import style from './AllMentees.module.css';

export default function AllMentees(props) {
  const initialScoreBreakdown = {
    'NOT ACCEPTED': 0,
    'STRONG ACCEPT': 0,
    ACCEPTED: 0,
    WAITLIST: 0,
    'LOW PRIORITY ACCEPT': 0,
    PENDING: 0,
  };
  const [mentees, setMentees] = React.useState(null);
  const [totalMenteeApps, setTotalMenteeApps] = React.useState(0);
  const [totalPendingApps, setTotalPendingApps] = React.useState(0);
  const [scoreBreakdown, setScoreBreakdown] = React.useState(
    initialScoreBreakdown
  );

  const currentCohort = 'SPRING 2023';
  const reviewDeadline = 'JULY 23, 2023';

  const sendMenteeData = (mentees, menteesFetched) => {
    if (menteesFetched == true) {
      setMentees(mentees);
    } else {
      return;
    }
  };

  const calculateAppBreakdown = (mentees) => {
    if (mentees !== null && mentees.length > 0) {
      const numApps = mentees.length;
      const appStatusSummary = initialScoreBreakdown;
      setTotalMenteeApps(numApps);

      for (const mentee of mentees) {
        const appStatus = mentee.acceptedStatus;
        if (appStatusSummary[appStatus] !== undefined) {
          appStatusSummary[appStatus] = appStatusSummary[appStatus] + 1;
        }
      }
      console.log(`app status summary`);
      console.log(appStatusSummary);
      return appStatusSummary;
    } else {
      return initialScoreBreakdown;
    }
  };

  const setMenteeAppData = useMemo(
    () => setScoreBreakdown(calculateAppBreakdown(mentees)),
    [mentees]
  );

  return (
    <div className={style.container}>
      <div className={style.body}>
        <h2 className={style.header}>MENTEE APPLICATION DASHBOARD</h2>
        <p className={style.bodyText}>
          Hi! Mentee applications are currently being reviewed for the{' '}
          <span className={style.variableText}>{currentCohort}</span> Cohort.
          The deadline for review is{' '}
          <span className={style.variableText}>{reviewDeadline}</span>.
        </p>

        <div className={style.bodyTextNumbers}>
          <p className={style.bodyTextInner}>
            Mentee applications by the numbers:{' '}
          </p>
          <ul>
            <span className={style.variableText}>{totalMenteeApps}</span> total
            application
            {totalMenteeApps > 1 && totalMenteeApps !== 0 ? 's ' : ' '}
            submitted.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['STRONG ACCEPT']}
            </span>{' '}
            application
            {scoreBreakdown['STRONG ACCEPT'] > 1 ||
            scoreBreakdown['STRONG ACCEPT'] == 0
              ? 's '
              : ' '}
            accepted for follow-up with questionnaire.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['ACCEPTED']}
            </span>{' '}
            application
            {scoreBreakdown['ACCEPTED'] > 1 || scoreBreakdown['ACCEPTED'] == 0
              ? 's '
              : ' '}
            accepted for follow-up with interview.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['LOW PRIORITY ACCEPT']}
            </span>{' '}
            application
            {scoreBreakdown['LOW PRIORITY ACCEPT'] > 1 ||
            scoreBreakdown['LOW PRIORITY ACCEPT'] == 0
              ? 's '
              : ' '}
            accepted with low-priority.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['WAITLIST']}
            </span>{' '}
            application
            {scoreBreakdown['WAITLIST'] > 1 || scoreBreakdown['WAITLIST'] == 0
              ? 's '
              : ' '}
            waitlisted.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['NOT ACCEPTED']}
            </span>{' '}
            application
            {scoreBreakdown['NOT ACCEPTED'] > 1 ||
            scoreBreakdown['NOT ACCEPTED'] == 0
              ? 's '
              : ' '}{' '}
            not accepted.
          </ul>
          <br></br>
          <p className={style.bodyTextInner}>
            <span className={style.variableText}>
              {scoreBreakdown['PENDING']}
            </span>{' '}
            application
            {scoreBreakdown['PENDING'] > 1 || scoreBreakdown['PENDING'] == 0
              ? 's '
              : ' '}{' '}
            still pending review.
          </p>
        </div>
      </div>
      <div className={style.menteeTable}>
        <MenteeTable sendMenteeData={sendMenteeData} />
      </div>
    </div>
  );
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getAllMentees: () => {
//       dispatch(getAllMentees());
//     },
//   };
// };

// export default connect(null, mapDispatchToProps)(AllMentees);

/*
        <p className={style.bodyTextCentered}>
          Mentee applications by the numbers:
        </p>
        <br />
        <br />
        <span className={style.numbersRow}>
          <div className={style.numberBox}>
            <p className={style.appCount}>{totalMenteeApps}</p>
            <p className={style.numberCaption}>TOTAL APPLICATIONS</p>
          </div>
        </span>
        <br />
        <span className={style.numbersRow}>
          <div className={style.numberBox}>
            <p className={style.number}>{scoreBreakdown['STRONG_ACCEPT']}</p>
            <p className={style.numberCaption}>STRONG ACCEPT</p>
          </div>
          <div className={style.numberBox}>
            <p className={style.number}>{scoreBreakdown['ACCEPT']}</p>
            <p className={style.numberCaption}>ACCEPTED</p>
          </div>
          <div className={style.numberBox}>
            <p className={style.number}>
              {scoreBreakdown['LOW_PRIORITY_ACCEPT']}
            </p>
            <p className={style.numberCaption}>
              ACCEPTED
              <br />
              (LOW PRIORITY)
            </p>
          </div>
          <div className={style.numberBox}>
            <p className={style.number}>{scoreBreakdown['WAITLIST']}</p>
            <p className={style.numberCaption}>WAITLISTED</p>
          </div>
          <div className={style.numberBox}>
            <p className={style.number}>{scoreBreakdown['DO_NOT_ACCEPT']}</p>
            <p className={style.numberCaption}>REJECTED</p>
          </div>
        </span>
*/
