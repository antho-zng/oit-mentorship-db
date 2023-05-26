// function ReviewAccordion(props) {
//   return (
//     <Accordion
//       expanded={expanded === 'panel1'}
//       onChange={handleChange('panel1')}
//       className={style.reviewAccordion}
//     >
//       <AccordionSummary
//         expandIcon={<ExpandMoreIcon className={style.expandMoreIcon} />}
//         aria-controls='panel1bh-content'
//         id='panel1bh-header'
//         classes={{
//           content: style.reviewAccordionSummary,
//           expanded: style.expandedAccordion,
//           root: style.reviewAccordionSummary,
//         }}
//       >
//         <h4>REVIEW</h4>
//         <p>Leave applicant score and comments here</p>
//       </AccordionSummary>
//       <AccordionDetails>
//         <TextField
//           id='outlined-multiline-static'
//           label='Comments'
//           multiline
//           rows={4}
//           placeholder='Your comments here...'
//           value={textFieldInput}
//           disabled={reviewDisabled}
//           InputProps={{
//             classes: {
//               input: style.textFieldInput,
//             },
//           }}
//           onChange={(event) => handleTextFieldChange(event)}
//         />
//         <div className={style.scoreContainer}>
//           <Rating
//             name='customized-color'
//             value={score}
//             max={4}
//             getLabelText={(score) => `${score} Heart${score !== 1 ? 's' : ''}`}
//             disabled={reviewDisabled}
//             onChange={(event, newScore) => {
//               handleScoreChange(event, newScore);
//             }}
//             onChangeActive={(event, newHover) => {
//               setHover(newHover);
//             }}
//             precision={1}
//             icon={<Recommend fontSize='inherit' />}
//             emptyIcon={<RecommendOutlined fontSize='inherit' />}
//             className={style.scoreIcons}
//           />
//           {score !== null && (
//             <Box sx={{ ml: 3 }}>
//               <p className={style.scoreLabels}>
//                 {scoreLabels[hover !== -1 ? hover : score]}
//               </p>
//             </Box>
//           )}
//         </div>
//       </AccordionDetails>
//       <div className={style.submitReviewButton}>
//         <Button
//           startIcon={<AddCircleOutlineOutlinedIcon />}
//           onClick={(event) => saveReviewInput(event)}
//         >
//           SUBMIT REVIEW
//         </Button>
//       </div>
//     </Accordion>
//   );
// }
