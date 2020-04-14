import React from 'react';
import {
  NetInfo,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image
} from 'react-native';
import { navigationPropTypes, navigationDefaultProps, screenPropsPropTypes, screenPropsDefaultProps } from '../../../config/propTypes';
import { getGameFromDynamoDB } from '../../../../lib/Categories/DynamoDB/TeacherGameRoomAPI';
import { verticalScale } from 'react-native-size-matters';
import Touchable from 'react-native-platform-touchable';
import Message from '../../../components/Message';
import ButtonBack from '../../../components/ButtonBack';
import ButtonWide from '../../../components/ButtonWide';
import { colors, fonts } from '../../../utils/theme';
import styles from './styles';
import debug from '../../../utils/debug';
import RoundButton from '../../../components/RoundButton';


export default class StudentFirst extends React.PureComponent {
  static propTypes = {
    screenProps: screenPropsPropTypes,
    navigation: navigationPropTypes,
  }

  static defaultProps = {
    screenProps: screenPropsDefaultProps,
    navigation: navigationDefaultProps,
  }

  constructor(props) {
    super(props);

    this.state = {
      messageProps: null,
      portal: null,
      room: '',
    };

    this.gameInput = null;
  }


  componentWillUnmount() {
    this.props.screenProps.handleSetAppState('deviceSettings', { role: 'student' });
  }


  onRoomInput = room => this.setState({ room });


  onRoomSubmit = () => {
    this.handleGameEntry();
  }


  onJoinLater = () => {
    this.props.navigation.navigate('StudentApp');
  }


  handleGameEntry = () => {
    const { room } = this.state;
    if (!room && this.gameInput) {
      this.gameInput.focus();
      return;
    }
    const GameRoomID = room;
    this.setState({ portal: `Joining ${GameRoomID}` });
    NetInfo.isConnected.fetch()
      .then(async (isConnected) => {
        if (isConnected) {
          getGameFromDynamoDB(GameRoomID, this.handleGameFound, this.handleGameError);
        } else {
          this.setState({
            portal: '',
            messageProps: {
              closeFunc: this.handleCloseMessage,
              bodyStyle: { bottom: verticalScale(140) },
              message: 'Network connection error.',
              timeout: 4000,
            },
          });
        }
      });
  }


  handleGameFound = (res) => {
    if (typeof res === 'object' && res.GameRoomID) {
      this.props.screenProps.IOTSubscribeToTopic(res.GameRoomID);
      setTimeout(() => {
        const { gameState } = this.props.screenProps;
        if (typeof gameState === 'object' && Object.keys(gameState).length === 0) {
          debug.log('Problem joining game room');
          if (this.attemptedEntries < 2) {
            this.props.screenProps.IOTUnsubscribeFromTopic(res.GameRoomID);
            setTimeout(() => this.handleGameEntry(), 500);
            this.attemptedEntries += 1;
          } else {
            this.attemptedEntries = 0;
            this.setState({
              portal: '',
              messageProps: {
                closeFunc: this.handleCloseMessage,
                bodyStyle: { bottom: verticalScale(140) },
                message: 'Problem joining game. Please try again.',
                timeout: 4000,
              },
            });
          }
        } else {
          this.setState({
            portal: '',
            messageProps: {
              closeFunc: this.handleCloseMessage,
              bodyStyle: { bottom: verticalScale(140) },
              message: 'Entered game room. Select your team.',
              timeout: 4000,
            },
          });
          this.props.screenProps.handleSetAppState('GameRoomID', res.GameRoomID);
          setTimeout(() => this.props.navigation.navigate('StudentApp'), 0);
        }
        debug.log('JOIN GAME', res.GameRoomID);
      }, 3000);
    } else {
      // res is most likely an empty object `{}`
      // - either way notify user that GameRoom cannot be joined.
      this.setState({
        portal: '',
        messageProps: {
          closeFunc: this.handleCloseMessage,
          bodyStyle: { bottom: verticalScale(140) },
          message: 'Game room not found.',
          timeout: 4000,
        },
      });
      debug.log('Bad response from getGameFromDynamoDB():', JSON.stringify(res), 'Game Room cannot be found.');
    }
  }


  handleGameError = (exception) => {
    this.setState({
      portal: '',
      messageProps: {
        closeFunc: this.handleCloseMessage,
        bodyStyle: { bottom: verticalScale(140) },
        message: 'Game room cannot be joined.',
        timeout: 4000,
      },
    });
    debug.log('Error getting game from DynamoDB:', exception);
  }


  handleCloseMessage = () => {
    this.setState({ messageProps: null });
  }


  handleNavigateToOnboardApp = () => {
    this.props.navigation.navigate('OnboardAppRouter');
  }


  render() {
    const {
      messageProps,
      portal,
      room,
    } = this.state;

    return (
      <View style={styles.container}>

        <Image
          style={styles.rightOnHeroImage}
          resizeMode='contain'
          source={require('../../../assets/images/rightOnLogo.png')}
        />
        <Text style={styles.title}>
          Enter Game Code
        </Text>
        <TextInput
          keyboardType={'numeric'}
          maxLength={4}
          multiline={false}
          onChangeText={this.onRoomInput}
          onSubmitEditing={this.onRoomSubmit}
          placeholder={'####'}
          placeholderTextColor={colors.primary}
          ref={(ref) => { this.gameInput = ref; }}
          returnKeyType={'done'}
          style={styles.input}
          textAlign={'center'}
          underlineColorAndroid={colors.dark}
          value={room}
        />

        <RoundButton
          title="Enter"
          backgroundColor={colors.buttonPrimary}
          onPress={this.onRoomSubmit}
        />
      </View>
    );
  }
}


const GameRoomStyles = StyleSheet.create({
  skip: {
    color: colors.primary,
    fontSize: fonts.medium,
  },
  skipButton: {
    bottom: verticalScale(100),
    position: 'absolute',
  },
});
