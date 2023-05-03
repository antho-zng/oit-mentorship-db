import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { getMentee, getAllMentees } from '../../store/mentee';
import MenteeTable from './menteeTable';

function AllMentees(props) {
  // useEffect(() => {
  //   props.getAllMentees();
  // }, []);

  const mentees = useSelector((state) => state.mentees);

  return (
    <div>
      <MenteeTable />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllMentees: dispatch(getAllMentees()),
  };
};

export default connect(null, mapDispatchToProps)(AllMentees);
