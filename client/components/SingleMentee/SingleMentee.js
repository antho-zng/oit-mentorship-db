import React, { useEffect, useMemo } from "react";
import { connect, useSelector } from "react-redux";
import style from "./SingleMentee.module.css";
import {
  getReviews,
  addReview,
  editReview,
  deleteReview,
} from "../../services/reviews-service";
import { useMenteeData } from "../../hooks/useMenteeData";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import AlertSnackbar from "../Common/AlertSnackbar";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { Rating } from "@mui/material";
import { Recommend, RecommendOutlined } from "@mui/icons-material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

//CONSTANTS
const questionCutoff = 8;
const generalInfoQuestionsCutoff = 15;
const essayResponseCutoff = 29;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function getLabelText(score) {
  return `${score} Star${score !== 1 ? "s" : ""}, ${scoreLabels[score]}`;
}

function SingleMentee(props) {
  const queryClient = useQueryClient();
  const menteeId = props.match.params.id;
  const userId = useSelector((state) => state.auth.id || []);

  const [score, setScore] = React.useState(3);
  const [hover, setHover] = React.useState(-1);
  const [textFieldInput, setTextFieldInput] = React.useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [reviewAccordionMessage, setReviewAccordionMessage] =
    React.useState("");
  const [reviewStatus, setReviewStatus] = React.useState({
    reviewerAdded: false,
    reviewDisabled: true,
    reviewSubmitted: false,
    editingMode: false,
    reviewAccordionMessage: "",
  });
  const [tabValue, setTabValue] = React.useState(0);
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    alertSeverity: "info",
    alertMessage: "",
  });

  const initialMenteeData = {
    id: "",
    firstName: "",
    lastName: "",
    pronouns: [],
    cohort: { name: "" },
    acceptedStatus: "",
    dateOfBirth: "",
    email: "",
    phoneNum: "",
    location: "",
    gendersAndSexualities: {},
    raceEthnicity: {},
    questions: [],
  };

  const { menteePending, menteeError, mentee } = useMenteeData(menteeId);

  console.log("mentee is", { mentee });

  const {
    isPending: reviewsPending,
    error: reviewsError,
    data: reviews,
  } = useQuery({
    queryKey: ["reviews", menteeId],
    queryFn: () => {
      const getReviewsResponse = getReviews(menteeId);
      return getReviewsResponse;
    },
    enabled: menteeId !== "",
    retry: 10,
    refetchInterval: 10000, // Will check for updates every 10 sec
  });

  const pronouns = mentee.pronouns;
  const firstName = mentee.firstName;
  const lastName = mentee.lastName;
  const cohort = mentee.cohort;
  const allQuestionsAndAnswers = mentee.questions;
  const generalInfoQA = allQuestionsAndAnswers.slice(
    questionCutoff,
    generalInfoQuestionsCutoff
  );
  const essayRespQA = allQuestionsAndAnswers.slice(
    generalInfoQuestionsCutoff,
    essayResponseCutoff
  );
  const miscQA = allQuestionsAndAnswers.slice(essayResponseCutoff);

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const newReview = (userId, menteeId) => {
    const review = {
      userId: userId,
      menteeId: menteeId,
      reviewerComments: null,
      reviewerScore: null,
      submitStatus: false,
    };

    return review;
  };

  const handleEnableReview = (event) => {
    event.preventDefault();
    setReviewStatus((prev) => ({
      ...prev,
      reviewDisabled: false,
      editingMode: true,
    }));
  };

  const handleTextFieldChange = (event) => {
    event.preventDefault();
    setTextFieldInput(event.target.value);
  };

  const handleScoreChange = (event, newScore) => {
    event.preventDefault();
    setScore(newScore);
  };

  const addReviewMutation = useMutation({
    mutationFn: (review) => {
      return addReview(review);
    },
    onSuccess: async () => {
      setReviewStatus((prev) => ({
        ...prev,
        reviewerAdded: true,
        reviewDisabled: false,
        editingMode: true,
      }));
      setSnackbarState((prev) => ({
        ...prev,
        open: true,
        alertSeverity: "success",
        alertMessage: "You've been added as a reviewer for this application.",
      }));
      setExpanded(true);
      setReviewAccordionMessage(
        "You have been added as a reviewer for this mentee application. Please leave your comments and score below." //TODO: move to constants
      );
      queryClient.invalidateQueries({ queryKey: ["reviews", menteeId] });
    },
    onError: async (error) => {
      setSnackbarState({
        open: true,
        alertSeverity: "error",
        alertMessage:
          "Unable to add you as a reviewer. Please refresh and try again!",
      });
    },
  });

  const editReviewMutation = useMutation({
    mutationFn: (review) => {
      return editReview(review, menteeId);
    },
    onSuccess: async () => {
      setReviewStatus((prev) => ({
        ...prev,
        reviewDisabled: true,
        reviewSubmitted: true,
        editingMode: false,
      }));
      setSnackbarState((prev) => ({
        ...prev,
        open: true,
        alertSeverity: "success",
        alertMessage: "Thank you for submitting your review!",
      }));
      queryClient.invalidateQueries({ queryKey: ["reviews", menteeId] });
    },
    onError: async (error) => {
      setSnackbarState({
        open: true,
        alertSeverity: "error",
        alertMessage: "Unable to submit review. Please refresh and try again.",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: () => {
      return deleteReview(userId, menteeId);
    },
    onSuccess: async () => {
      setReviewStatus((prev) => ({
        ...prev,
        reviewSubmitted: false,
        reviewDisabled: true,
        editingMode: false,
        reviewerAdded: false,
      }));
      setExpanded(false);
      setTextFieldInput("");
      setScore(3);
      queryClient.invalidateQueries({ queryKey: ["reviews", menteeId] });
      queryClient.invalidateQueries({ queryKey: ["mentee", menteeId] });
      setSnackbarState((prev) => ({
        ...prev,
        open: true,
        alertSeverity: "success",
        alertMessage: "Your review has been successfully deleted.",
      }));
    },
    onError: async (error) => {
      setSnackbarState({
        open: true,
        alertSeverity: "error",
        alertMessage:
          "Unable to delete your review. Please refresh and try again.",
      });
    },
  });

  const handleAddReviewer = (event) => {
    event.preventDefault();
    const review = newReview(userId, menteeId);
    addReviewMutation.mutate(review);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();

    const reviewerComments = textFieldInput;
    const reviewerScore = score;

    const review = {
      userId: userId,
      reviewerComments: reviewerComments,
      reviewerScore: reviewerScore,
      submitStatus: true,
    };
    editReviewMutation.mutate(review);

    setTextFieldInput(reviewerComments);
    setScore(reviewerScore);
  };

  const handleDeleteReview = (event) => {
    event.preventDefault();
    deleteReviewMutation.mutate();
  };

  useEffect(() => {
    if (menteeError) {
      setSnackbarState({
        open: true,
        alertSeverity: "error",
        alertMessage:
          "Unable to fetch mentee data. Please refresh the page and try again.",
      });
    } else if (reviewsError) {
      setSnackbarState({
        open: true,
        alertSeverity: "error",
        alertMessage:
          "Unable to fetch reviews. Please refresh the page and try again.",
      });
    }
  }, [menteeError, reviewsError]);

  useEffect(() => {
    reviewCheck(reviews);
  }, [reviews]);

  function reviewCheck(reviews) {
    if (reviews === undefined) {
      return;
    } else if (Array.isArray(reviews) && !reviewStatus.editingMode) {
      maxReviewCheck(reviews);
      reviewScoreCheck();
      filterMyReviews(reviews);
    } else {
      return;
    }
  }

  function maxReviewCheck(reviews) {
    if (reviews.length > 1) {
      setReviewAccordionMessage("This application has already been reviewed.");
      setReviewStatus((prev) => ({
        ...prev,
        reviewDisabled: true,
      }));
      return;
    } else if (reviews.length === 0) {
      setReviewAccordionMessage(
        "Add yourself as a reviewer to leave score and comments for this application."
      );
    } else {
      return;
    }
  }

  function reviewScoreCheck() {
    if (mentee.acceptedStatus !== "PENDING" && mentee.acceptedStatus !== "") {
      setReviewAccordionMessage(
        `This application has already been reviewed and is currently marked as ${mentee.acceptedStatus}. No further reviews are needed.`
      );
      setReviewStatus((prev) => ({
        ...prev,
        reviewDisabled: true,
      }));
      return;
    }
  }

  function filterMyReviews(reviews) {
    const myReviews = reviews.filter((review) => review.userId === userId);
    if (myReviews.length > 0 && myReviews[0].submitStatus === false) {
      setReviewStatus((prev) => ({
        ...prev,
        reviewerAdded: true,
        reviewDisabled: false,
        editingMode: true,
      }));
      setReviewAccordionMessage(
        "You have been added as a reviewer for this mentee application. Please leave your comments and score below."
      );
      return;
    } else if (myReviews.length > 0) {
      setReviewStatus((prev) => ({
        ...prev,
        reviewerAdded: true,
        reviewDisabled: true,
        reviewSubmitted: true,
      }));
      setReviewAccordionMessage(
        `You've already submitted a review for this application on ${new Date(
          myReviews[0].updatedAt
        )}.`
      );
      setTextFieldInput(myReviews[0].reviewerComments);
      setScore(myReviews[0].reviewerScore);
    }
  }

  const scoreLabels = {
    1: "Reject",
    2: "Waitlist",
    3: "Interview (Low Priority)",
    4: "Interview",
    5: "Questionnaire (Strong Accept)",
  };
  /**
   * 1 Do Not Accept -> Reject
1 Strong Accept -> Questionnaire
2 Accept -> Interview (allow 2)
1 Borderline -> Waitlist (allow 2)
1 Accept with low priority -> Interview (Low Priority)(allow 2)

   */

  return (
    <div className={style.menteeProfile}>
      <div className={style.leftSidebar}>
        <Card
          style={{ border: "none", boxShadow: "none" }}
          className={style.sidebarCard}
        >
          <CardContent className={style.cardContent}>
            <p>Mentee ({mentee.acceptedStatus})</p>
            <h2 className={style.menteeName}>
              {menteePending || menteeError ? (
                <CircularProgress
                  style={{ justifySelf: "center", alignSelf: "center" }}
                />
              ) : (
                <>
                  {firstName} <br></br>
                  {lastName}
                </>
              )}
            </h2>
            <p>
              <span className={style.sidebarSubhead}>PRONOUNS</span>
              <br></br>
              {pronouns.map((pronoun, idx) => {
                return (
                  <p className={style.sidebarText} key={idx}>
                    {pronoun}
                    <br></br>
                  </p>
                );
              })}
            </p>
            <p>
              <span className={style.sidebarSubhead}>DATE OF BIRTH</span>
              <br></br>
              <p className={style.sidebarText}>{mentee.dateOfBirth}</p>
            </p>
            <p>
              <span className={style.sidebarSubhead}>EMAIL</span>
              <br></br>
              <p className={style.sidebarText}>{mentee.email}</p>
            </p>
            <p>
              <span className={style.sidebarSubhead}>PHONE</span>
              <br></br>
              <p className={style.sidebarText}>{mentee.phoneNum}</p>
            </p>
            <p>
              <span className={style.sidebarSubhead}>LOCATION</span>
              <br></br>
              <p className={style.sidebarText}>{mentee.location}</p>
            </p>
            <p>
              <span className={style.sidebarSubhead}>COHORT</span>
              <br></br>
              <p className={style.sidebarText}>{cohort?.name}</p>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className={style.questionsContainer}>
        <AlertSnackbar
          snackbarState={snackbarState}
          setSnackbarState={setSnackbarState}
        />
        <h2>APPLICATION RESPONSES</h2>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="application responses"
              className={style.tabLabel}
              TabIndicatorProps={{
                sx: { backgroundColor: "#DC493A" },
              }}
            >
              <Tab
                className={style.tabLabel}
                label="GENERAL INFO"
                {...a11yProps(0)}
              />
              <Tab
                className={style.tabLabel}
                label="ESSAY RESPONSES"
                {...a11yProps(1)}
              />
              <Tab className={style.tabLabel} label="MISC" {...a11yProps(2)} />
            </Tabs>
          </Box>
          {menteePending || menteeError ? (
            <Box style={{ width: "100%", height: "100vh", display: "grid" }}>
              <CircularProgress
                style={{ justifySelf: "center", alignSelf: "center" }}
              />
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                {generalInfoQA.map((qaPair, idx) => {
                  return (
                    <div key={idx} className={style.qaCard}>
                      <span className={style.question}>{qaPair.text}</span>
                      <br></br>
                      <br></br>
                      {qaPair.answer.text}
                    </div>
                  );
                })}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {essayRespQA.map((qaPair, idx) => {
                  return (
                    <div key={idx} className={style.qaCard}>
                      <span className={style.question}>{qaPair.text}</span>
                      <br></br>
                      <br></br>
                      {qaPair.answer.text}
                    </div>
                  );
                })}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {miscQA.map((qaPair, idx) => {
                  return (
                    <div key={idx} className={style.qaCard}>
                      <span className={style.question}>{qaPair.text}</span>
                      <br></br>
                      <br></br>
                      {qaPair.answer.text}
                    </div>
                  );
                })}
              </TabPanel>
            </>
          )}
        </Box>
      </div>
      <div className={style.reviewBar}>
        <div className={style.reviewContainer}>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            style={{
              boxShadow: "none",
              backgroundColor: "aliceblue",
              borderRadius: "30px",
            }}
            disabled={!reviewStatus.reviewerAdded && !reviewsPending}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={style.expandMoreIcon} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              classes={{
                content: style.reviewAccordionSummary,
                expanded: style.expandedAccordion,
                root: style.reviewAccordionSummary,
              }}
            >
              <h4 className={style.reviewHeader}>REVIEW</h4>
              {reviewsPending || reviewsError ? (
                <CircularProgress />
              ) : (
                <p>{reviewAccordionMessage}</p>
              )}
            </AccordionSummary>
            <AccordionDetails>
              {!reviewStatus.reviewDisabled ? (
                ""
              ) : (
                <div className={style.enableReviewLink}>
                  <Button
                    size="small"
                    onClick={(event) => {
                      handleEnableReview(event);
                    }}
                  >
                    {reviewStatus.reviewSubmitted ? (
                      <span className={style.enableReviewButton}>
                        <EditIcon className={style.editIcon} />{" "}
                        <p>Edit My Review</p>
                      </span>
                    ) : (
                      <p>Submit A Review Anyway</p>
                    )}
                    <br></br>
                  </Button>
                </div>
              )}
              <TextField
                className={style.textField}
                id="outlined-multiline-static"
                label="Comments"
                multiline
                rows={4}
                placeholder="Your comments here..."
                value={textFieldInput}
                disabled={reviewStatus.reviewDisabled}
                inputProps={{
                  className: style.textFieldInput,
                }}
                InputProps={{
                  className: style.textFieldBox,
                }}
                onChange={(event) => handleTextFieldChange(event)}
              />
              <div className={style.scoreContainer}>
                <Rating
                  name="customized-color"
                  value={score}
                  max={5}
                  getLabelText={(score) =>
                    `${score} Heart${score !== 1 ? "s" : ""}`
                  }
                  disabled={reviewStatus.reviewDisabled}
                  onChange={(event, newScore) => {
                    handleScoreChange(event, newScore);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  precision={1}
                  icon={<Recommend fontSize="inherit" />}
                  emptyIcon={<RecommendOutlined fontSize="inherit" />}
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
              {reviewStatus.editingMode && reviewStatus.reviewSubmitted ? (
                <Button
                  startIcon={<ArrowCircleUpOutlinedIcon />}
                  onClick={(event) => handleSubmitReview(event)}
                  disabled={!reviewStatus.editingMode}
                  value="update"
                >
                  UPDATE REVIEW
                </Button>
              ) : (
                <Button
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={(event) => handleSubmitReview(event)}
                  disabled={reviewStatus.reviewSubmitted}
                  value="submit"
                >
                  SUBMIT REVIEW
                </Button>
              )}
            </div>
          </Accordion>
          {reviewStatus.reviewerAdded ? (
            <div className={style.deleteReviewButton}>
              <Button
                size="small"
                onClick={(event) => {
                  handleDeleteReview(event);
                }}
              >
                <span className={style.deleteReviewButton}>
                  <DeleteIcon className={style.editIcon} />{" "}
                  {reviewStatus.reviewSubmitted ? (
                    <p>Remove My Review</p>
                  ) : (
                    <p>Remove Me As Reviewer</p>
                  )}
                </span>
              </Button>
            </div>
          ) : (
            ""
          )}
          <div>
            {reviewStatus.reviewerAdded ? (
              ""
            ) : (
              <div className={style.addReviewButton}>
                <Fab
                  variant="extended"
                  size="small"
                  color="primary"
                  aria-label="add"
                  onClick={(event) => handleAddReviewer(event)}
                  disabled={mentee.acceptedStatus !== "PENDING"}
                >
                  <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
                  Add review
                </Fab>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CONTAINER
 */

const mapDispatch = {
  getMentee,
  getReviews,
  addReview,
  editReview,
  deleteReview,
};

export default connect(null, mapDispatch)(SingleMentee);
