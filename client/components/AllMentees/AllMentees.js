import React, { useEffect, useState, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
// import { getAllMentees } from '../../store/allMentees';
import MenteeTable from './menteeTable';
import style from './AllMentees.modules.css';

export default function AllMentees(props) {
  /**
   * want to display:
   * total apps
   * total pending (still need reviews)
   * total breakdown of score calculations
   *
   * 1 Do Not Accept -> Reject
   * 1 Strong Accept -> Questionnaire
   * 2 Accept -> Interview
   * 1 Borderline -> Waitlist
   * 1 Accept with low priority -> Interview (Low Priority)
   * 
   *     let numReject;
    let numQuestionnaire;
    let numInterview;
    let numWaitlist;
    let numInterviewLowPriority;
   */

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

  console.log(`scoreBreakdown`);
  console.log(scoreBreakdown);
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

        <p className={style.bodyText}>
          Mentee applications by the numbers:{' '}
          <ul>
            <span className={style.variableText}>{totalMenteeApps}</span> total
            applications submitted.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['STRONG ACCEPT']}
            </span>{' '}
            applications accepted for follow-up with questionnaire.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['ACCEPTED']}
            </span>{' '}
            applications accepted for follow-up with interview.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['LOW PRIORITY ACCEPT']}
            </span>{' '}
            applications accepted with low-priority.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['WAITLIST']}
            </span>{' '}
            applications waitlisted.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown['NOT ACCEPTED']}
            </span>{' '}
            applications not accepted.
          </ul>
        </p>

        <p className={style.bodyText}>
          <span className={style.variableText}>
            {scoreBreakdown['PENDING']}
          </span>{' '}
          applications still pending review.
        </p>
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
