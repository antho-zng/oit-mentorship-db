import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { getAllMentees } from '../../store/allMentees';
import MenteeTable from './menteeTable';

function AllMentees(props) {
  const mentees = useSelector((state) => state.allMentees || []);
  useEffect(() => {
    props.getAllMentees();
  }, []);

  // console.log('mentees');
  // console.log(mentees);
  return (
    <div>
      <MenteeTable mentees={mentees} />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMentees: () => {
      dispatch(getAllMentees());
    },
  };
};

export default connect(null, mapDispatchToProps)(AllMentees);
