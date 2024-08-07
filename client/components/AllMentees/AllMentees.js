import React, { useEffect, useState, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import MenteeTable from "./menteeTable";
import style from "./AllMentees.module.css";
import { getAllCohorts } from "../../store/cohorts";
import { useAllMenteeData } from "../../hooks/useMenteeData";
import { REVIEW_DEADLINE } from "../../constants";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";

function AllMentees(props) {
  useEffect(() => {
    props.getAllCohorts();
  }, []);

  const initialScoreBreakdown = {
    "NOT ACCEPTED": 0,
    "STRONG ACCEPT": 0,
    ACCEPTED: 0,
    WAITLIST: 0,
    "LOW PRIORITY ACCEPT": 0,
    PENDING: 0,
  };

  const [totalMenteeApps, setTotalMenteeApps] = React.useState(0);
  const [totalPendingApps, setTotalPendingApps] = React.useState(0);
  const [selectedCohort, setSelectedCohort] = React.useState("");

  const cohorts = useSelector((state) => state.cohorts || []);

  const findCurrentCohort = (cohorts) => {
    if (Array.isArray(cohorts)) {
      let returnCohort;

      if (selectedCohort !== "") {
        returnCohort = cohorts.find((cohort) => cohort.name === selectedCohort);
      } else {
        returnCohort = cohorts.find((cohort) => cohort.isCurrent === true);
      }
      return returnCohort;
    } else {
      return null;
    }
  };

  const currentCohort = useMemo(
    () => findCurrentCohort(cohorts, selectedCohort),
    [cohorts, selectedCohort]
  );

  const { allMenteesPending, allMenteesError, allMentees, allMenteesFetching } =
    useAllMenteeData({
      searchBy: "cohortId",
      payload: currentCohort?.cohortId ?? "",
    });

  const calculateAppBreakdown = (allMentees) => {
    if (allMentees !== null && allMentees.length > 0) {
      const numApps = allMentees.length;
      const appStatusSummary = initialScoreBreakdown;
      setTotalMenteeApps(numApps);

      for (const mentee of allMentees) {
        const appStatus = mentee.acceptedStatus;
        if (appStatusSummary[appStatus] !== undefined) {
          appStatusSummary[appStatus] = appStatusSummary[appStatus] + 1;
        }
      }
      return appStatusSummary;
    } else {
      return initialScoreBreakdown;
    }
  };

  const scoreBreakdown = useMemo(
    () => calculateAppBreakdown(allMentees),
    [allMentees, selectedCohort]
  );

  const handleDropdownChange = (event) => {
    for (const cohort of cohorts) {
      if (cohort.name === event.target.value) {
        setSelectedCohort(cohort);
        return;
      }
    }
  };

  return (
    <div className={style.container}>
      <div className={style.body}>
        <h2 className={style.header}>MENTEE APPLICATION DASHBOARD</h2>
        <p className={style.bodyText}>
          Hi! Mentee applications are currently being reviewed for the{" "}
          <span className={style.variableText}>
            {currentCohort ? (
              currentCohort.name
            ) : (
              <Skeleton
                variant="rounded"
                width={100}
                height={20}
                sx={{ display: "inline-flex" }}
              />
            )}
          </span>{" "}
          Cohort. The deadline for review is{" "}
          <span className={style.variableText}>{REVIEW_DEADLINE}</span>.
        </p>
        <p className={style.bodyText}>
          Currently viewing mentee applications for:
          <Box
            sx={{ minWidth: 100, display: "inline-flex", paddingLeft: "20px" }}
          >
            <FormControl className={style.dropdown}>
              <InputLabel
                className={style.inputLabel}
                id="demo-simple-select-label"
              >
                Cohort
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={
                  selectedCohort
                    ? selectedCohort.name
                    : currentCohort?.name || ""
                }
                label="Cohort"
                onChange={(event) => {
                  handleDropdownChange(event);
                }}
              >
                {Array.isArray(cohorts)
                  ? cohorts.map((cohort) => {
                      return (
                        <MenuItem value={cohort.name} key={cohort.cohortId}>
                          {cohort.name}
                        </MenuItem>
                      );
                    })
                  : "Fetching Cohorts.."}
              </Select>
            </FormControl>
          </Box>
        </p>

        <div className={style.bodyTextNumbers}>
          <p className={style.bodyTextInner}>
            Mentee applications by the numbers:{" "}
          </p>
          <ul>
            <span className={style.variableText}>{totalMenteeApps}</span> total
            application
            {totalMenteeApps > 1 && totalMenteeApps !== 0 ? "s " : " "}
            submitted.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown["STRONG ACCEPT"]}
            </span>{" "}
            application
            {scoreBreakdown["STRONG ACCEPT"] > 1 ||
            scoreBreakdown["STRONG ACCEPT"] == 0
              ? "s "
              : " "}
            accepted for follow-up with questionnaire.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown["ACCEPTED"]}
            </span>{" "}
            application
            {scoreBreakdown["ACCEPTED"] > 1 || scoreBreakdown["ACCEPTED"] == 0
              ? "s "
              : " "}
            accepted for follow-up with interview.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown["LOW PRIORITY ACCEPT"]}
            </span>{" "}
            application
            {scoreBreakdown["LOW PRIORITY ACCEPT"] > 1 ||
            scoreBreakdown["LOW PRIORITY ACCEPT"] == 0
              ? "s "
              : " "}
            accepted with low-priority.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown["WAITLIST"]}
            </span>{" "}
            application
            {scoreBreakdown["WAITLIST"] > 1 || scoreBreakdown["WAITLIST"] == 0
              ? "s "
              : " "}
            waitlisted.
          </ul>
          <ul>
            <span className={style.variableText}>
              {scoreBreakdown["NOT ACCEPTED"]}
            </span>{" "}
            application
            {scoreBreakdown["NOT ACCEPTED"] > 1 ||
            scoreBreakdown["NOT ACCEPTED"] == 0
              ? "s "
              : " "}{" "}
            not accepted.
          </ul>
          <br></br>
          <p className={style.bodyTextInner}>
            <span className={style.variableText}>
              {scoreBreakdown["PENDING"]}
            </span>{" "}
            application
            {scoreBreakdown["PENDING"] > 1 || scoreBreakdown["PENDING"] == 0
              ? "s "
              : " "}{" "}
            still pending review.
          </p>
        </div>
      </div>
      <div className={style.menteeTable}>
        <MenteeTable
          menteeData={allMentees}
          menteesLoading={allMenteesPending && allMenteesFetching}
          allMenteesError={allMenteesError}
        />
      </div>
    </div>
  );
}

const mapDispatch = {
  getAllCohorts,
};

export default connect(null, mapDispatch)(AllMentees);
