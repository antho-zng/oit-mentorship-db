import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
// import { getAllMentees } from '../../store/allMentees';
import MenteeTable from './menteeTable';
import style from './AllMentees.modules.css';

export default function AllMentees(props) {
  return (
    <div className={style.menteeTable}>
      <MenteeTable />
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
