import PropTypes from 'prop-types';
// @mui
import { Grid, Stack, Typography } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfileAboutCompany from './ProfileAboutCompany';

import ProfileFollowInfo from './ProfileFollowInfo';

// ----------------------------------------------------------------------

Profile.propTypes = {
  myProfile: PropTypes.object,
  posts: PropTypes.array,
  company: PropTypes.object,
};

export default function Profile({ myProfile, company }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileFollowInfo profile={myProfile} />
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <ProfileAbout profile={myProfile} />
      </Grid>
      {company ? (
        <Grid item xs={12} md={4}>
          <ProfileAboutCompany profile={company} />
        </Grid>
      ) : (
        <Grid item xs={12} md={4}>
          <Typography variant="body2">No company is created for you yet</Typography>
        </Grid>
      )}

      {/* <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProfilePostInput />
          {posts.map((post) => (
            <ProfilePostCard key={post.id} post={post} />
          ))}
        </Stack>
      </Grid> */}
    </Grid>
  );
}
