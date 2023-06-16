import React from 'react';
import { connect } from 'react-redux';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function LoadingSkeleton(props) {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={4}>
          <Skeleton variant='rounded' width={263.547} height={243.547} />
        </Grid>
        <Grid xs={4}>
          <Skeleton variant='rounded' width={263.547} height={243.547} />
        </Grid>
        <Grid xs={4}>
          <Skeleton variant='rounded' width={263.547} height={243.547} />
        </Grid>
        <Grid xs={4}>
          <Skeleton variant='rounded' width={263.547} height={243.547} />
        </Grid>
        <Grid xs={4}>
          <Skeleton variant='rounded' width={263.547} height={243.547} />
        </Grid>
        <Grid xs={4}>
          <Skeleton variant='rounded' width={263.547} height={243.547} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoadingSkeleton;
