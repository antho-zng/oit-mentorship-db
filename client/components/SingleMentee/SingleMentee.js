import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';
import { getReviews, addReview } from '../../store/reviews';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import { Rating, StyledRating } from '@mui/material';
import { Recommend, RecommendOutlined } from '@mui/icons-material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const questionCutoff = 8;

function getLabelText(score) {
  return `${score} Star${score !== 1 ? 's' : ''}, ${scoreLabels[score]}`;
}

function SingleMentee(props) {
  useEffect(() => {
    props.getMentee(props.match.params.id);
  }, []);

  useEffect(() => {
    props.getReviews(props.match.params.id);
  }, []);

  useEffect(() => {
    filterMyReviews(reviews);
  });

  useEffect(() => {
    setTextFieldInput(localStorage.getItem('textFieldInputValue'));
  }, []);

  useEffect(() => {
    setScore(localStorage.getItem('score'));
  }, []);

  // useEffect(() => {
  //   setReviewDisabled(document.cookie.split('=')[1] === 'true');
  // }, []);

  // useEffect(() => {
  //   setReviewDisabled(reviews.length > 0 === 'true');
  // }, []);

  const [score, setScore] = React.useState(3);
  const [hover, setHover] = React.useState(-1);
  const [textFieldInput, setTextFieldInput] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);
  const [reviewDisabled, setReviewDisabled] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleTextFieldChange = (event) => {
    event.preventDefault();
    setTextFieldInput(event.target.value);
    localStorage.setItem('textFieldInputValue', event.target.value);
  };

  const handleScoreChange = (event, newScore) => {
    event.preventDefault();
    setScore(newScore);
    localStorage.setItem('score', newScore);
  };

  const saveReviewInput = (event) => {
    event.preventDefault();

    const reviewerComments = textFieldInput;
    const reviewerScore = score;

    const review = {
      menteeId: menteeId,
      userId: userId,
      reviewerComments: reviewerComments,
      reviewerScore: reviewerScore,
    };

    const token = window.localStorage.getItem('token');
    addReview(review, token);

    const disableReviewCookie =
      `reviewDisabled=true; path=` +
      window.location.pathname +
      `; max-age=` +
      365 * 24 * 60 * 60 +
      `; Secure`;
    console.log(`reviews disabled`);
    console.log(disableReviewCookie);

    // document.cookie = `reviewDisabled=true;Secure`;
    document.cookie = disableReviewCookie;
  };

  const filterMyReviews = (reviews) => {
    if (reviews === undefined) {
      console.log('reviews undefined');
      return;
    }
    if (Array.isArray(reviews)) {
      const myReviews = reviews.filter((review) => review.userId === userId);
      console.log(`myReviews`);
      console.log(myReviews);
    } else {
      console.log('reviews idk lol');
      return;
    }
  };

  const scoreLabels = {
    1: 'Do not recommend',
    2: 'Recommend with reservations',
    3: 'Recommend',
    4: 'Strongly recommend',
  };

  const mentee = useSelector((state) => state.mentee);
  const menteeId = useSelector((state) => state.mentee.id || []);
  const pronouns = useSelector((state) => state.mentee.pronouns || []);
  const firstName = useSelector((state) => state.mentee.firstName || []);
  const lastName = useSelector((state) => state.mentee.lastName || []);
  const cohort = useSelector((state) => state.mentee.cohort || []);
  const userId = useSelector((state) => state.auth.id || []);

  const reviews = useSelector((state) => state.reviews || []);

  console.log('reviews');
  console.log(reviews);
  // console.log('my reviews');
  // console.log(myReviews);

  const allQuestionsAndAnswers = useSelector(
    (state) => state.mentee.questions || []
  );

  const questionsAndAnswers = allQuestionsAndAnswers.slice(questionCutoff);

  // TO-DO : display mentee age instead of DOB

  return (
    <div className={style.menteeProfile}>
      <div className={style.leftSidebar}>
        <Card className={style.sidebarCard}>
          <CardContent>
            <p>Mentee ({mentee.acceptedStatus})</p>

            <h2 className={style.menteeName}>
              {firstName} <br></br>
              {lastName}
            </h2>
            <p>
              <span className={style.sidearSubhead}>PRONOUNS</span>
              <br></br>
              {pronouns.map((pronoun, idx) => {
                return (
                  <span key={idx}>
                    {pronoun}
                    <br></br>
                  </span>
                );
              })}
            </p>
            <p>
              <span className={style.sidearSubhead}>DATE OF BIRTH</span>
              <br></br>
              {mentee.dateOfBirth}
            </p>
            <p>
              <span className={style.sidearSubhead}>EMAIL</span>
              <br></br>
              {mentee.email}
            </p>
            <p>
              <span className={style.sidearSubhead}>PHONE</span>
              <br></br>
              {mentee.phoneNum}
            </p>
            <p>
              <span className={style.sidearSubhead}>LOCATION</span>
              <br></br>
              {mentee.location}
            </p>
            <p>
              <span className={style.sidearSubhead}>COHORT</span>
              <br></br>
              {cohort.name}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className={style.questionsContainer}>
        <h2>APPLICATION RESPONSES</h2>
        <div>
          {questionsAndAnswers.map((qaPair, idx) => {
            return (
              <div key={idx} className={style.qaCard}>
                <span className={style.question}>{qaPair.text}</span>
                <br></br>
                <br></br>
                {qaPair.answer.text}
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.reviewContainer}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
          className={style.reviewAccordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={style.expandMoreIcon} />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'
            classes={{
              content: style.reviewAccordionSummary,
              expanded: style.expandedAccordion,
              root: style.reviewAccordionSummary,
            }}
          >
            <h4>REVIEW</h4>
            <p>Leave applicant score and comments here</p>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id='outlined-multiline-static'
              label='Comments'
              multiline
              rows={4}
              placeholder='Your comments here...'
              value={textFieldInput}
              disabled={reviewDisabled}
              InputProps={{
                classes: {
                  input: style.textFieldInput,
                },
              }}
              onChange={(event) => handleTextFieldChange(event)}
            />
            <div className={style.scoreContainer}>
              <Rating
                name='customized-color'
                value={score}
                max={4}
                getLabelText={(score) =>
                  `${score} Heart${score !== 1 ? 's' : ''}`
                }
                disabled={reviewDisabled}
                onChange={(event, newScore) => {
                  handleScoreChange(event, newScore);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                precision={1}
                icon={<Recommend fontSize='inherit' />}
                emptyIcon={<RecommendOutlined fontSize='inherit' />}
                className={style.scoreIcons}
              />
              {score !== null && (
                <Box sx={{ ml: 3 }}>
                  <p className={style.scoreLabels}>
                    {scoreLabels[hover !== -1 ? hover : score]}
                  </p>
                </Box>
              )}
            </div>
          </AccordionDetails>
          <div className={style.submitReviewButton}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={(event) => saveReviewInput(event)}
            >
              SUBMIT REVIEW
            </Button>
          </div>
        </Accordion>
      </div>
    </div>
  );
}

/**
 * CONTAINER
 */

const mapDispatchToProps = (dispatch) => {
  return {
    getMentee: (id) => {
      dispatch(getMentee(id));
    },
    getReviews: (id) => {
      dispatch(getReviews(id));
    },
    addReview: (review, token) => {
      dispatch(addReview(review, token));
    },
  };
};

export default connect(null, mapDispatchToProps)(SingleMentee);
