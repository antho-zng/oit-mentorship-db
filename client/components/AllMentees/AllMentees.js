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

  const [mentees, setMentees] = React.useState(null);
  const [totalMenteeApps, setTotalMenteeApps] = React.useState(0);
  const [totalPendingApps, setTotalPendingApps] = React.useState(0);
  const [scoreBreakdown, setScoreBreakdown] = React.useState({});

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
      const appStatusSummary = {};
      setTotalMenteeApps(numApps);

      for (const mentee of mentees) {
        const appStatus = mentee.acceptedStatus;
        if (appStatusSummary[appStatus] === undefined) {
          appStatusSummary[appStatus] = 1;
        } else if (appStatusSummary[appStatus] !== undefined) {
          appStatusSummary[appStatus] = appStatusSummary[appStatus] + 1;
        }
      }
      console.log(`app status summary`);
      console.log(appStatusSummary);
      return appStatusSummary;
    }
  };

  const setMenteeAppData = useMemo(
    () => setScoreBreakdown(calculateAppBreakdown(mentees)),
    [mentees]
  );

  return (
    <div>
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
