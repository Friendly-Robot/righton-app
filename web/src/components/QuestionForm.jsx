import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    maxWidth: '75%',
  },

  input: {
    margin: `${theme.spacing(2)}px 0`,
    width: '100%'
  },

  half: {
    width: '50%'
  },

  imagePreview: {
    padding: theme.spacing(2),
    display: 'inline-block',
    boxSizing: 'border-box',
  },

  image: {
    maxWidth: '100%',
    maxHeight: '250px',
  },

  divider: {
    margin: `${theme.spacing(2)}px 0`,
  },

  number: {
    width: '40px',
  },

  deleteButton: {
    marginLeft: theme.spacing(1),
    height: '56px',
  },
}));

function QuestionForm({ loading, saveQuestion, question: originalQuestion, questionIndex, gameIndex }) {
  useEffect(() => {
    document.title = 'RightOn! | Edit question';
    return () => { document.title = 'RightOn! | Game management'; }
  }, []);
  const [question, setQuestion] = useState(originalQuestion || {
    question: '',
    image: '',
    answer: '',
    instructions: [],
  });
  const classes = useStyles();
  const history = useHistory();
  const onChangeMaker = useCallback((field) => ({ currentTarget }) => { setQuestion({ ...question, [field]: currentTarget.value }); }, [question, setQuestion]);
  const onStepChangeMaker = useCallback((index) => ({ currentTarget }) => {
    const newInstructions = [...question.instructions];
    newInstructions[index] = currentTarget.value;
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);
  const addInstruction = useCallback(() => { setQuestion({ ...question, instructions: [...question.instructions, ''] }); }, [question, setQuestion]);
  const handleSaveQuestion = useCallback(() => {
    saveQuestion(question, Number(gameIndex) - 1, questionIndex);
    history.push(`/games/${gameIndex}`);
  }, [question, saveQuestion, gameIndex, questionIndex, history])
  const handleBack = useCallback(() => {
    history.push(`/games/${gameIndex}`);
  }, [gameIndex, history])
  const handleRemoveInstruction = useCallback((index) => {
    const newInstructions = [...question.instructions];
    newInstructions.splice(index, 1);
    setQuestion({ ...question, instructions: newInstructions });
  }, [question, setQuestion]);

  if (loading) return <Skeleton variant="rect" width={210} height={118} />;

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Button onClick={handleBack}>
        Back
      </Button>
      <Typography gutterBottom variant="h4" component="h1">
        {originalQuestion ? 'Edit' : 'New'} question
      </Typography>

      <TextField className={classes.input} id="question-text" value={question.question} onChange={onChangeMaker('question')} label="Question Text" variant="outlined" multiline rows={4} required />
      <TextField className={classnames(classes.input, classes.half)} id="image-url" value={question.image} onChange={onChangeMaker('image')} label="URL for Photo" variant="outlined" />
      <div className={classnames(classes.half, classes.imagePreview)}>
        {question.image && <img className={classes.image} src={question.image} alt="Preview" />}
      </div>

      <Divider className={classes.divider} />

      <TextField className={classes.input} id="answer" value={question.answer} onChange={onChangeMaker('answer')} label="Answer" variant="outlined" required />
      <h3>Solution Steps</h3>
      <List>
        {question.instructions.map((step, index) => (
          <>
            <ListItem key={index}>
              <TextField className={classes.input} id={`step-${index + 1}`} value={step} onChange={onStepChangeMaker(index)} label={`Step ${index + 1}`} variant="outlined" required />
              <Button className={classes.deleteButton} onClick={() => handleRemoveInstruction(index)} inline>X</Button>
            </ListItem>
          </>
        ))}
        <ListItem>
          <Button variant="contained" onClick={addInstruction}>
            Add step
          </Button>
        </ListItem>
      </List>

      <Divider className={classes.divider} />

      <Button variant="contained" color="primary" onClick={handleSaveQuestion}>
        Save
      </Button>
    </form>
  );
}

export default QuestionForm;
