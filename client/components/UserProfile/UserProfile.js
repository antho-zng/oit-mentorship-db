import React, { useEffect, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './UserProfile.module.css';
import { getReviews } from '../../store/reviews';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import LoadingSkeleton from './LoadingSkeleton';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f0f8ff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
  boxShadow: `none`,
  borderRadius: `30`,
  fontFamily: 'IBM Plex Sans, sans-serif',
  padding: '20px',
}));

function UserProfile(props) {
  useEffect(() => {
    if (userId === null) {
      return;
    } else {
      const token = window.localStorage.getItem('token');
      props.getReviews(`userId=${userId}`, token);
    }
  }, [props.userId]);

  const [tabValue, setTabValue] = React.useState(0);
  const [completeReviews, setCompleteReviews] = React.useState(null);
  const [openReviews, setOpenReviews] = React.useState([]);

  const userId = useSelector((state) => state.auth.id || null);
  const reviewerName = useSelector((state) => state.auth.firstName || '');
  const reviews = useSelector((state) => state.reviews || []);

  const filterOpenReviews = useMemo(
    () => setOpenReviews(filterReviews(reviews, 'open')),
    [reviews]
  );

  const filterCompleteReviews = useMemo(
    () => setCompleteReviews(filterReviews(reviews, 'complete')),
    [reviews]
  );

  console.log(`complete reviews`);
  console.log(completeReviews);

  function filterReviews(reviews, filter) {
    const submitStatus = filter === 'complete';

    if (reviews === undefined) {
      return;
    } else if (Array.isArray(reviews)) {
      const filteredReviews = reviews.filter(
        (review) => review.submitStatus === submitStatus
      );
      return filteredReviews;
    } else {
      return;
    }
  }

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };
  const handleMenteeClick = (event, id) => {
    console.log(`menteeId is ${id}`);
    window.location.href = `/applications/${id}`;
  };
  return (
    <div className={style.container}>
      <div className={style.body}>
        <h2 className={style.header}>Hi {reviewerName ? reviewerName : ''}!</h2>
        <p className={style.bodyText}>
          Welcome to your reviewer profile. You can view all the applications
          assigned to you below.
        </p>
      </div>
      <Box className={style.tabBox} sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label='user reviews'
            className={style.tabLabel}
            TabIndicatorProps={{
              sx: { backgroundColor: '#DC493A' },
            }}
          >
            <Tab
              className={style.tabLabel}
              label='OPEN REVIEWS'
              {...a11yProps(0)}
            />
            <Tab
              className={style.tabLabel}
              label='COMPLETED REVIEWS'
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ width: '100%' }}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {Array.isArray(openReviews) ? (
                openReviews.length === 0 ? (
                  <p className={style.bodyText}>
                    You currently have no open reviews to display. Applications
                    pending review can be found on the{' '}
                    <a href='/applications' className={style.linkText}>
                      mentee application dashboard.
                    </a>
                  </p>
                ) : (
                  openReviews.map((review) => {
                    return (
                      <Grid
                        xs={4}
                        onClick={(event) =>
                          handleMenteeClick(event, review.mentee.id)
                        }
                        className={style.gridItemContainer}
                      >
                        <Item className={style.gridItem}>
                          <div>
                            <h3 className={style.cardName}>
                              {review.mentee.firstName} {review.mentee.lastName}
                            </h3>
                            <p>
                              <span className={style.cardSubhead}>COHORT</span>
                              <br></br>
                              {review.mentee.cohortId}
                            </p>
                            <p>
                              <span className={style.cardSubhead}>
                                APPLICATION STATUS
                              </span>
                              <br></br>
                              {review.mentee.acceptedStatus}
                            </p>
                            <p>
                              <span className={style.cardSubhead}>
                                ADDED AS REVIEWER ON
                              </span>
                              <br></br>
                              {`${new Date(review.createdAt)}`}
                            </p>
                          </div>
                        </Item>
                      </Grid>
                    );
                  })
                )
              ) : (
                <div>
                  <LoadingSkeleton />
                </div>
              )}
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ width: '100%' }}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {Array.isArray(completeReviews) ? (
                completeReviews.length === 0 ? (
                  <p className={style.bodyText}>
                    You currently have no submitted reviews to display.
                    Applications pending review can be found on the{' '}
                    <a href='/applications' className={style.linkText}>
                      mentee application dashboard.
                    </a>
                  </p>
                ) : completeReviews[0].mentee !== undefined ? (
                  completeReviews.map((review) => {
                    return (
                      <Grid
                        xs={4}
                        onClick={(event) =>
                          handleMenteeClick(event, review.mentee.id)
                        }
                        className={style.gridItemContainer}
                      >
                        <Item className={style.gridItem}>
                          <div>
                            <h3 className={style.cardName}>
                              {review.mentee.firstName} {review.mentee.lastName}
                            </h3>
                            <p>
                              <span className={style.cardSubhead}>COHORT</span>
                              <br></br>
                              {review.mentee.cohortId}
                            </p>
                            <p>
                              <span className={style.cardSubhead}>
                                APPLICATION STATUS
                              </span>
                              <br></br>
                              {review.mentee.acceptedStatus}
                            </p>
                            <p>
                              <span className={style.cardSubhead}>
                                ADDED AS REVIEWER ON
                              </span>
                              <br></br>
                              {`${new Date(review.createdAt)}`}
                            </p>
                          </div>
                        </Item>
                      </Grid>
                    );
                  })
                ) : (
                  <div>
                    <LoadingSkeleton />
                  </div>
                )
              ) : (
                <div>
                  <LoadingSkeleton />
                </div>
              )}
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getReviews: (searchParams, token) => {
      dispatch(getReviews(searchParams, token));
    },
  };
};

export default connect(null, mapDispatchToProps)(UserProfile);
