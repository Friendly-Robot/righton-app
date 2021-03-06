import React, { useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import QuestionForm from './QuestionForm';
import GameForm from './GameForm';
import NewGameDialogue from './NewGameDialogue';

export default function Games({ loading, games, saveGame, saveQuestion, saveNewGame }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('/games/:gameIndex');
  const [newGameOpen, setNewGameOpen] = useState(false);
  const handleNewGame = (game) => {
    setNewGameOpen(false);
    saveNewGame(game);
  };

  return (
    <Grid container className={classes.root} spacing={4}>
      <Grid item xs={3} className={classes.sidebar}>
        <Box className={classes.actions}>
          <Button variant="contained" color="primary" onClick={() => setNewGameOpen(true)} disabled={!!match}>
            Add game
          </Button>
          <NewGameDialogue open={newGameOpen} onClose={() => setNewGameOpen(false)} submit={handleNewGame} />
        </Box>
        {games.map(({ GameID, title, grade, q1, q2, q3, q4, q5 }, index) => {
          const questionCount = [q1, q2, q3, q4, q5].filter(q => !!q).length;
          return (
            <Card className={classes.game} key={GameID}>
              <CardContent>
                <Typography gutterBottom>
                  {title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : ''}{grade && ` — Grade ${grade}`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => history.push(`/games/${index + 1}`)}>Edit</Button>
              </CardActions>
            </Card>
          );
        })}
      </Grid>
      <Grid item xs={9} className={classes.content}>
        <Switch>
          <Route path="/games/:gameIndex/questions/:questionIndex" render={
            ({ match }) => {
              const { questionIndex, gameIndex } = match.params;
              return <QuestionForm loading={loading} saveQuestion={saveQuestion} question={games[Number(gameIndex) - 1][`q${Number(questionIndex)}`]} {...match.params} />;
            }
          } />
          <Route path="/games/:gameIndex" render={
            ({ match }) => {
              const { gameIndex } = match.params;
              return <GameForm loading={loading} saveGame={saveGame} game={games[Number(gameIndex) - 1]} gameIndex={gameIndex} />;
            }
          } />
        </Switch>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  game: {
    marginBottom: theme.spacing(2),
  },
  sidebar: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px !important`,
    borderRight: '1px #0000003b solid',
    height: 'calc(100vh - 105px)',
    overflowY: 'scroll',
  },
  content: {
    minHeight: 'calc(100vh - 105px)',
  },
  actions: {
    marginBottom: '16px',
  },
}));
