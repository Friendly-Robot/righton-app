import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
// import Triangle from '../../components/Triangle';
import Circle from '../../components/Circle';
import { colors, deviceHeight, deviceWidth, fonts } from '../../utils/theme';

const circleOne = deviceHeight;
const circleTwo = deviceHeight - 150;
const circleThree = deviceWidth;
const circleFour = deviceWidth - 100;
const circleFive = circleFour - 75; // Has thicker border
const circleSix = circleFive - 50;
const circleSeven = circleSix - 25;
const circleEight = circleSeven - 15;
const circleNine = circleEight - 10;
const circleTen = circleNine - 5;

// const triangleOneTop = {
//   height: deviceWidth + (deviceWidth / 2),
//   width: deviceWidth,
//   position: {
//     bottom: (height / 2) + 200, 
//     top: -100, 
//     justifyContent: 'flex-end'
//   },
//   points: `
//     10, ${deviceWidth + (deviceWidth / 2)}
//     ${deviceWidth - 10}, ${deviceWidth + (deviceWidth / 2)}
//     ${deviceWidth / 2}, 10
//   `
// };
// const triangleOneBot = {
//   height: deviceWidth + (deviceWidth / 2),
//   width: deviceWidth,
//   position: {
//     bottom: -100,
//     top: (deviceHeight / 2) + 200, 
//     justifyContent: 'flex-start'
//   },
//   points: `
//     10, 10
//     ${deviceWidth - 10}, 10
//     ${deviceWidth / 2}, ${(deviceWidth + (deviceWidth / 2)) - 10}
//   `
// };

export default class Portal extends React.PureComponent {
  static propTypes = {
    messageType: PropTypes.string,
    messageValues: PropTypes.shape({
      message: PropTypes.string,
      players: PropTypes.string,
      rewardImageUri: PropTypes.string,
      subMessage: PropTypes.string,
      superMessage: PropTypes.string,
    }),
  }

  static defaultProps = {
    messageType: '',
    messageValues: {},
  }

  constructor() {
    super();

    this.state = {
      countdown: null,
    };
  }

  componentDidMount() {
    // setTimeout switches to next event after pre-defined ms
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messageType === 'countdown') {
      this.igniteCountdown(3);
    }
  }

  igniteCountdown(count) {
    if (count === 1) {
      setTimeout(() => {
        // TODO: Render next event
      }, 1000);
    } else {
      this.setState({ countdown: count });
      setTimeout(() => {
        this.igniteCountdown(count - 1);
      }, 1000);
    }
  }

  renderMessageType(type) {
    switch (type) {
      case 'righton':
        return this.renderRightOnMessage();
      case 'single':
        return this.renderSingleMessage();
      case 'doubleSub':
        return this.renderDoubleSubMessage();
      case 'doubleSuper':
        return this.renderDoubleSuperMessage();
      case 'reward':
        return this.renderRewardMessage();
      case 'countdown':
        return this.renderCountdown();
      default:
        return null;
    }
  }

  renderRightOnMessage() {
    // *TODO: Where do we check whether players share the same wrong answers?
    // - This must happen prior to rendering this screen as the `messageValues` prop must be set.
    // TODO: Replace TouchableOpacity w/ react-native-touchable
    const { players } = this.props.messageValues; 
    // @prop players: [{image: base64, name: playerName}, ...]
    let others = '';
    for (let i = 1; i < players.length; i += 1) {
      others += ` and ${players[i].name}`;
    }
    return (
      <View style={styles.rightOnContainer}>
        <Text style={styles.mainMessage}>RIGHT ON!</Text>
        <Text style={styles.subMessage}>{`You${others} came up with the same wrong answer!`}</Text>
        <View style={styles.rightOnPlayersContainer}>
          { 
            players.map(player => (
              <View style={styles.rightOnPlayerContainer}>
                {
                  player.image ? 
                    <Image source={{ uri: player.image }} style={styles.rightOnPlayerImage} />
                    : 
                    <View style={styles.rightOnPlayerImage} />
                }
                <Text style={styles.rightOnPlayerName}>{ player.name }</Text>
              </View>
            )) 
          }
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.rightOnWaveContainer}
          onPress={() => {}}
        >
          { /* Wave icon */ }
          <Text style={styles.subMessage}>Wave</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSingleMessage() {
    const { message } = this.props.messageValues;
    return (
      <Text style={styles.mainMessage}>{ message }</Text>
    );
  }

  renderDoubleSubMessage() {
    const { message, subMessage } = this.props.messageValues;
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.mainMessage}>{ message }</Text>
        <Text style={styles.subMessage}>{ subMessage }</Text>
      </View>
    );
  }

  renderDoubleSuperMessage() {
    const { message, superMessage } = this.props.messageValues;
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.superMessage}>{ superMessage }</Text>
        <Text style={styles.mainMessage}>{ message }</Text>
      </View>
    );
  }

  renderRewardMessage() {
    const { rewardImageUri, subMessage, superMessage } = this.props.messageValues;
    return (
      <View style={styles.messageContainer}>
        <Text>{ superMessage }</Text>
        <View style={styles.rewardContainer}>
          <Image source={rewardImageUri} style={styles.rewardImage} />
        </View>
        <Text>{ subMessage }</Text>
      </View>
    );
  }

  renderCountdown() {
    const { countdown } = this.state;
    return (
      <View style={styles.messagecontainer}>
        <Text style={styles.mainMessage}>{ countdown }</Text>
      </View>
    );
  }

  render() {
    const {
      // messageValues,
      // @messageValues = {
      //   message: '',
      //   subMessage: '',
      //   superMessage: '',
      //   players: [{image, name}, {image, name}, ...],
      //   rewardImageUri: '../../assets/rewards/icon.png',
      // }
      messageType, // "rightOn", "single", "doubleSub", "doubleSuper", "reward", "countdown"
      // userImage,
    } = this.props;

    const { countdown } = this.state;

    const circleFourBackground = countdown === null || messageType !== 'rightOn' ? '#000' : null;

    return (
      <View style={styles.container}>

        { this.renderMessageType(messageType) }

        <Circle styles={{ height: circleOne, width: circleOne }} />
        <Circle styles={{ height: circleTwo, width: circleTwo }} />
        <Circle styles={{ height: circleThree, width: circleThree }} />
        <Circle 
          styles={{
            height: circleFour,
            width: circleFour,
            backgroundColor: circleFourBackground,
            borderWidth: 1,
            opacity: 0.5,
          }} 
        />
        <Circle styles={{ height: circleFive, width: circleFive }} />
        <Circle styles={{ height: circleSix, width: circleSix, borderWidth: 1 }} />
        <Circle 
          styles={{
            height: circleSeven,
            width: circleSeven,
            backgroundColor: colors.white
          }}
        />
        <Circle styles={{ height: circleEight, width: circleEight }} />
        <Circle styles={{ height: circleNine, width: circleNine }} />
        <Circle styles={{ height: circleTen, width: circleTen }} />

        {/* <Triangle styles={triangleOneTop}/>

        <Triangle styles={triangleOneBot}/> */}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
  },
  mainMessage: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontStyle: 'italic',
    zIndex: 10,
  },
});
