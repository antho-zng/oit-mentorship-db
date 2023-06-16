import React, { useEffect, useState, useMemo } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import style from './UserProfile.module.css';
import { getReviews } from '../../store/reviews';
import { getMentee } from '../../store/mentee';

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
  const reviews = useSelector((state) => state.reviews || []);

  console.log(reviews);

  const filterOpenReviews = useMemo(
    () => setOpenReviews(_filterOpenReviews(reviews)),
    [reviews]
  );

  const filterCompleteReviews = useMemo(
    () => setCompleteReviews(_filterCompleteReviews(reviews)),
    [reviews]
  );
  // const sortReviews = (reviews) => {
  //   if (reviews === undefined) {
  //     console.log(`boo`);
  //     return;
  //   } else if (Array.isArray(reviews)) {
  //     filterOpenReviews(reviews);
  //     filterCompleteReviews(reviews);

  //     console.log('filteredReviews');
  //     console.log(completeReviews);
  //     console.log(openReviews);
  //   } else {
  //     console.log(`boo boooooo`);

  //     return;
  //   }
  // };

  function _filterOpenReviews(reviews) {
    if (reviews === undefined) {
      console.log(`boo`);
      return;
    } else if (Array.isArray(reviews)) {
      const filteredOpenReviews = reviews.filter(
        (review) => review.submitStatus === false
      );
      console.log(openReviews);
      return filteredOpenReviews;
    } else {
      console.log(`boo boooooo`);
      return;
    }
  }

  function _filterCompleteReviews(reviews) {
    if (reviews === undefined) {
      console.log(`boo`);
      return;
    } else if (Array.isArray(reviews)) {
      const filteredCompleteReviews = reviews.filter(
        (review) => review.submitStatus === true
      );
      console.log(completeReviews);
      return filteredCompleteReviews;
    } else {
      console.log(`boo boooooo`);
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

/*
<Stack spacing={1}>
<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
<Skeleton
  variant='rounded'
  width={243.547}
  height={223.547}
/>
<Skeleton
  variant='rounded'
  width={243.547}
  height={223.547}
/>
<Skeleton
  variant='rounded'
  width={243.547}
  height={223.547}
/>
</Stack>
*/
