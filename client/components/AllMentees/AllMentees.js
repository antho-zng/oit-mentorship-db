import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
// import { getAllMentees } from '../../store/allMentees';
import MenteeTable from './menteeTable';

export default function AllMentees(props) {
  // const mentees = useSelector((state) => state.allMentees || []);

  // useEffect(() => {
  //   props.getAllMentees();
  // }, []);

  return (
    <div>
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
