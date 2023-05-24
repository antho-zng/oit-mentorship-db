import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import style from './SingleMentee.module.css';
import { getMentee } from '../../store/mentee';
import { getReviews, addReview, editReview } from '../../store/reviews';

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
import Link from '@mui/material/Link';
import { Rating, StyledRating } from '@mui/material';
import { Recommend, RecommendOutlined } from '@mui/icons-material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';

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
    reviewCheck(reviews);
  });

  const [score, setScore] = React.useState(3);
  const [hover, setHover] = React.useState(-1);
  const [textFieldInput, setTextFieldInput] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);
  const [reviewDisabled, setReviewDisabled] = React.useState(false);
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [editingMode, setEditingMode] = React.useState(false);
  // const [accordionDisabled, setAccordionDisabled] = React.useState(false);
  const [reviewAccordionMessage, setReviewAccordionMessage] = React.useState(
    'Leave applicant score and comments here'
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleEnableReview = (event) => {
    event.preventDefault();
    setReviewDisabled(false);
    setEditingMode(true);
    console.log('review enabled');
    console.log(reviewDisabled);
  };

  const handleTextFieldChange = (event) => {
    event.preventDefault();
    setTextFieldInput(event.target.value);
  };

  const handleScoreChange = (event, newScore) => {
    event.preventDefault();
    setScore(newScore);
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
    setReviewSubmitted(true);
    setEditingMode(false);
  };

  const updateReview = (event) => {
    event.preventDefault();

    const reviewerComments = textFieldInput;
    const reviewerScore = score;

    const review = {
      userId: userId,
      reviewerComments: reviewerComments,
      reviewerScore: reviewerScore,
    };

    const token = window.localStorage.getItem('token');
    editReview(review, menteeId, token);
    setEditingMode(false);
  };

  const reviewCheck = (reviews) => {
    if (reviews === undefined) {
      return;
    } else if (Array.isArray(reviews) && !editingMode) {
      console.log('reviewcheck fired');
      reviewScoreCheck(reviews);
      filterMyReviews(reviews);
    } else {
      return;
    }
  };

  const reviewScoreCheck = (reviews) => {
    for (const review of reviews) {
      if (review.reviewerScore === 1 || review.reviewerScore === 5) {
        setReviewAccordionMessage(
          "Another reviewer has already marked this application as either 'Strong Accept' or 'Do Not Accept'."
        );
        setReviewDisabled(true);
        return;
      }
    }
  };

  const filterMyReviews = (reviews) => {
    const myReviews = reviews.filter((review) => review.userId === userId);
    if (myReviews.length > 0) {
      setReviewDisabled(true);
      setReviewSubmitted(true);
      setReviewAccordionMessage(
        `You've already submitted a review for this application on ${new Date(
          myReviews[0].updatedAt
        )}.`
      );
      setTextFieldInput(myReviews[0].reviewerComments);
      setScore(myReviews[0].reviewerScore);
    }
  };

  /**
   * TO-DO:
   * check reviewer assignment
   * check other scores for do not accept / high accept
   *
   */

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
          // disabled={accordionDisabled}
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
            <p>{reviewAccordionMessage}</p>

            {/* {!reviewDisabled ? (
              <p>Leave applicant score and comments here</p>
            ) : (
              <div>
                <p>{reviewAccordionMessage}</p>
              </div>
            )} */}
          </AccordionSummary>
          <AccordionDetails>
            {!reviewDisabled ? (
              ''
            ) : (
              <div className={style.enableReviewLink}>
                <Link
                  component='button'
                  variant='button'
                  onClick={(event) => {
                    handleEnableReview(event);
                  }}
                >
                  {reviewSubmitted ? (
                    <p>Update My Review</p>
                  ) : (
                    <p>Submit A Review Anyway</p>
                  )}
                  <br></br>
                </Link>
              </div>
            )}
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
            {editingMode && reviewSubmitted ? (
              <Button
                startIcon={<ArrowCircleUpOutlinedIcon />}
                onClick={(event) => updateReview(event)}
              >
                UPDATE REVIEW
              </Button>
            ) : (
              <Button
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={(event) => saveReviewInput(event)}
              >
                SUBMIT REVIEW
              </Button>
            )}
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
    editReview: (review, id, token) => {
      dispatch(editReview(review, id, token));
    },
  };
};

export default connect(null, mapDispatchToProps)(SingleMentee);
