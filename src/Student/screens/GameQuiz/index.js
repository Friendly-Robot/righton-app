import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import gamePreviewStyles from '../GamePreview/styles';
import { colors } from '../../../utils/theme';

export default class GameQuiz extends React.Component {
  static propTypes = {
    screenProps: PropTypes.shape({
      gameState: PropTypes.shape({}),
      handleSetAppState: PropTypes.func.isRequired,
      IOTPublishMessage: PropTypes.func.isRequired,
    }),
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({}),
      }),
    }),
  }

  static defaultProps = {
    screenProps: {
      gameState: {},
      handleSetAppState: () => {},
      IOTPublishMessage: () => {},
    },
    navigation: {
      navigate: () => {},
      state: {
        params: {},
      },
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedChoice: null,
      timeLeft: props.screenProps.gameState[props.screenProps.gameState.state.teamRef].time ?
        props.screenProps.gameState[props.screenProps.gameState.state.teamRef].time : '',
    };

    this.timerInterval = undefined;

    this.countdownTime = this.countdownTime.bind(this);
  }


  componentDidMount() {
    if (this.props.screenProps.gameState[this.props.screenProps.gameState.state.teamRef].time) {
      this.timerInterval = setInterval(this.countdownTime, 1000);
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.gameState.state.endQuiz === true) {
      if (this.state.timeLeft !== 'Time is up!') {
        this.publishChoice();
        clearInterval(this.timerInterval);
        this.setState({ timeLeft: 'Time is up!' });
      }
    } else if (nextProps.screenProps.gameState.state.startQuiz === true &&
    nextProps.screenProps.gameState.state.teamRef === `team${this.props.screenProps.team}`) {
      this.props.navigation.navigate('GameReasons');
    }
  }


  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }


  countdownTime() {
    const { timeLeft } = this.state;
    const seconds = parseInt(timeLeft.substr(timeLeft.indexOf(':') + 1), 10);
    const minutes = parseInt(timeLeft.substr(0, timeLeft.indexOf(':')), 10);
    let newTimeLeft = '';
    if (seconds > 10) {
      newTimeLeft = `${minutes}:${seconds - 1}`;
    } else if (seconds > 0) {
      newTimeLeft = `${minutes}:0${seconds - 1}`;
    } else if (seconds === 0 && minutes > 0) {
      newTimeLeft = `${minutes - 1}:59`;
    } else if (seconds === 0 && minutes === 0) {
      this.publishChoice();
      clearInterval(this.timerInterval);
      newTimeLeft = 'Time is up!';
    }
    this.setState({ timeLeft: newTimeLeft });
  }


  publishChoice() {
    const { selectedChoice } = this.state;
    if (!selectedChoice) return;
    const { teamRef } = this.props.screenProps.gameState.state;
    const message = {
      action: 'UPDATE_PLAYER_CHOICE',
      uid: `${Math.random()}`,
      teamRef,
      index: selectedChoice,
    };
    this.props.screenProps.IOTPublishMessage(message);
  }


  handleChoiceSelection(value) {
    const { timeLeft } = this.state;
    if (timeLeft !== 'Time is up!') {
      this.setState({ selectedChoice: value });
    }
  }


  render() {
    const { gameState } = this.props.screenProps;
    const { teamRef } = gameState.state;

    const { selectedChoice, timeLeft } = this.state;
    
    return (
      <ScrollView
        contentContainerStyle={gamePreviewStyles.container}
      >
        {Boolean(timeLeft) &&
          <View style={gamePreviewStyles.timeContainer}>
            <Text style={gamePreviewStyles.time}>{ timeLeft }</Text>
          </View>}
        <View style={gamePreviewStyles.questionContainer}>
          <Text style={gamePreviewStyles.question}>{ gameState[teamRef].question }</Text>
          {Boolean(gameState[teamRef].image) &&
            <Image source={{ uri: gameState[teamRef].image }} style={gamePreviewStyles.image} />} 
        </View>
        <View style={gamePreviewStyles.choiceContainerWrapper}>
          <View style={gamePreviewStyles.choicesContainer}>
            {gameState[teamRef].choices.map((choice, idx) => (
              Object.keys(choice).length &&
              <Touchable
                activeOpacity={0.8}
                key={choice.value}
                onPress={() => this.handleChoiceSelection(idx)}
              >
                <View style={gamePreviewStyles.choiceContainer}>
                  <View 
                    style={[
                      gamePreviewStyles.choiceDot,
                      selectedChoice === idx && { backgroundColor: colors.primary },
                    ]}
                  />
                  <Text style={gamePreviewStyles.choiceAnswer}>{ choice.value }</Text>
                </View>
              </Touchable>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}