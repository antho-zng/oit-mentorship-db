import React, { useEffect, useState } from 'react';
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
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function UserProfile(props) {
  useEffect(() => {
    if (userId === null) {
      return;
    } else {
      console.log(userId);
      const token = window.localStorage.getItem('token');
      props.getReviews(`userId=${userId}`, token);
    }
  });

  const [tabValue, setTabValue] = React.useState(0);

  const userId = useSelector((state) => state.auth.id || null);

  // const getReviews = (userId) => {
  //   if (userId === null) {
  //     return;
  //   } else {
  //     console.log(userId);
  //     props.getReviews(userId);
  //   }
  // };

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
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
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid xs={6}>
                <Item>1</Item>
              </Grid>
              <Grid xs={6}>
                <Item>2</Item>
              </Grid>
              <Grid xs={6}>
                <Item>3</Item>
              </Grid>
              <Grid xs={6}>
                <Item>4</Item>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          test
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
