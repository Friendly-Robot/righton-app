import React from 'react';
import {
  ActivityIndicator,
  findNodeHandle,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import NativeMethodsMixin from 'NativeMethodsMixin';
import Touchable from 'react-native-platform-touchable';
import { verticalScale } from 'react-native-size-matters';
import { Storage } from 'aws-amplify';
import RNImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Aicon from 'react-native-vector-icons/FontAwesome';
import InputModal from '../../../../../components/InputModal';
import ButtonWide from '../../../../../components/ButtonWide';
import parentStyles from '../styles';
import { colors, elevation, fonts } from '../../../../../utils/theme';
import debug from '../../../../../utils/debug';


export default class GameBuilderQuestion extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    question: PropTypes.shape({
      answer: PropTypes.string,
      image: PropTypes.string,
      instructions: PropTypes.arrayOf(PropTypes.string),
      question: PropTypes.string,
    }),
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    closeModal: () => {},
    question: {
      answer: '',
      image: '',
      instructions: [],
      question: '',
      uid: '',
    },
    visible: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      question: {
        answer: null,
        image: null,
        instructions: [],
        question: null,
        quizTime: '1:00',
        trickTime: '3:00',
        uid: null,
      },
      showInput: false,
    };

    this.blankQuestionState = this.state.question;

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleExitModal = this.handleExitModal.bind(this);
    this.handleAddInstruction = this.handleAddInstruction.bind(this);

    this.onQuestionLayout = this.onQuestionLayout.bind(this);
    this.handleQuestionRef = this.handleQuestionRef.bind(this);
    this.onAnswerLayout = this.onAnswerLayout.bind(this);
    this.handleAnswerRef = this.handleAnswerRef.bind(this);
    this.handleInputModal = this.handleInputModal.bind(this);
    this.closeInputModal = this.closeInputModal.bind(this);
  }


  componentDidMount() {
    this.hydrateState(this.props.question);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.question.uid !== nextProps.question.uid) {
      this.hydrateState(nextProps.question);
      debug.log('Question:', JSON.stringify(nextProps.question));
    } else if (nextProps.question.uid === undefined) {
      this.hydrateState(this.blankQuestionState);
    }
  }


  onQuestionLayout() {
    if (this.questionRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.questionRef),
        (x, y) => {
          this.questionX = x;
          this.questionY = y + 12 + fonts.small;
        }
      );
    }
  }


  onAnswerLayout() {
    if (this.answerRef) {
      NativeMethodsMixin.measureInWindow.call(
        findNodeHandle(this.answerRef),
        (x, y) => {
          this.answerX = x;
          this.answerY = y + 12 + fonts.small;
        }
      );
    }
  }


  hydrateState(question) {
    this.setState({ question });
  }

  
  handleQuestionRef(ref) {
    this.questionRef = ref;
  }


  handleAnswerRef(ref) {
    this.answerRef = ref;
  }


  closeInputModal(input, inputLabel) {
    switch (inputLabel) {
      case 'question':
        this.setState({ question: { ...this.state.question, question: input }, showInput: false });
        break;
      case 'answer':
        this.setState({ question: { ...this.state.question, answer: input }, showInput: false });
        break;
      case 'instruction':
        if (typeof this.instructionIndex === 'number') {
          const updatedInstructions = [...this.state.question.instructions];
          if (input) {
            updatedInstructions.splice(this.instructionIndex, 1, input);
          } else {
            updatedInstructions.splice(this.instructionIndex, 1);
          }
          this.setState({
            question: { ...this.state.question, instructions: updatedInstructions },
            showInput: false,
          });
          this.instructionIndex = null;
        } else if (input) {
          this.setState({
            question: {
              ...this.state.question,
              instructions: [...this.state.question.instructions, input],
            },
            showInput: false,
          });
        } else {
          this.setState({ showInput: false });
        }
        break;
      default:
        break;
    }
  }


  handleAddInstruction(idx) {
    let input = '';
    if (typeof idx === 'number') {
      this.instructionIndex = idx;
      input = this.state.question.instructions[idx];
    }
    const index = typeof idx === 'number' ? index + 1 : this.state.question.instructions.length + 1;
    this.handleInputModal('instruction', `${index}. Instruction Step`, 100, input, 'default');
  }


  handleInputModal(inputLabel, placeholder, maxLength, input = '', keyboardType = 'default') {
    if (inputLabel === 'question') {
      this.onQuestionLayout();
    } else if (inputLabel === 'answer') {
      this.onAnswerLayout();
    }
    setTimeout(() => {
      this.setState({
        showInput: {
          autoCapitalize: 'sentences',
          closeModal: this.closeInputModal,
          keyboardType,
          input,
          inputLabel,
          maxLength,
          multiline: false,
          placeholder,
          visible: true,
          spellCheck: true,
          x: this[`${inputLabel}X`],
          y: this[`${inputLabel}Y`],
        }
      });
    }, 100);
  }


  handleCloseModal() {
    const { question } = this.state;
    const { edit } = question;
    const updatedQuestion = { ...question };
    if (typeof edit === 'number') {
      delete updatedQuestion.edit;
      this.props.closeModal(null, updatedQuestion, edit);
    } else {
      updatedQuestion.uid = `${Math.random()}`;
      this.props.closeModal(null, updatedQuestion);
    }
  }

  
  handleExitModal() {
    this.props.closeModal();
  }


  handleImagePicker = () => {
    const options = {
      title: 'Choose an image/diagram',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    RNImagePicker.showImagePicker(options, (response) => {
      debug.log('Response = ', JSON.stringify(response));
    
      if (response.didCancel) {
        debug.log('User cancelled image picker');
      } else if (response.error) {
        debug.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        debug.log('User tapped custom button: ', response.customButton);
      } else {
        if (this.state.question.image && this.state.question.image !== 'null') {
          Storage.remove(this.state.question.image, { level: 'public' });
        }

        this.setState({ question: { ...this.state.question, image: 'loading' } });

        const imagePath = response.uri;
        const imageType = 'image/png';

        // TODO! Resize image to make read access more efficient.
        this.readFile(imagePath).then((buffer) => {
          Storage.put(imagePath, buffer, {
            contentType: imageType,
            level: 'public',
          })
            .then(() => {
              Storage.get(imagePath)
                .then((res) => {
                  debug.log('RESPONSE FROM GETTING IMAGE:', res);
                  this.setState({
                    question: { ...this.state.question, image: res },
                  });
                }).catch(e => this.catchImageError(e));
            }).catch(e => this.catchImageError(e));
        }).catch(e => this.catchImageError(e));
      }
    });
  }


  catchImageError = (exception) => {
    this.setState({ question: { ...this.state.question, image: 'null' } });
    debug.warn('Error PUTTING/GETTING image @S3 Storage:', JSON.stringify(exception));
  }


  readFile = filePath => RNFetchBlob.fs.readFile(filePath, 'base64').then(data => new Buffer(data, 'base64'));


  render() {
    const {
      answer,
      image,
      instructions,
      question,
      // quizTime,
      // trickTime,
    } = this.state.question;

    const { showInput } = this.state;

    return (
      <View style={parentStyles.container}>

        {showInput &&
          <InputModal {...showInput} />}

        <View style={[parentStyles.headerContainer, elevation]}>
          <Touchable
            hitSlop={{ top: 25, right: 25, bottom: 25, left: 25 }}
            onPress={this.handleExitModal}
          >
            <View style={parentStyles.closeContainer}>
              <Aicon name={'close'} style={[parentStyles.closeIcon, parentStyles.closeIconShadow]} />
              <Aicon name={'close'} style={parentStyles.closeIcon} />
            </View>
          </Touchable>
          {/* <Text style={parentStyles.title}>Game Builder</Text> */}
          <Touchable
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={this.handleCloseModal}
            style={parentStyles.menuWrapper}
          >
            <Text style={parentStyles.createLabel}>Done</Text>
          </Touchable>
        </View>

        <ScrollView contentContainerStyle={parentStyles.scrollview}>
          <View
            onLayout={this.onQuestionLayout}
            ref={this.handleQuestionRef}
            style={parentStyles.inputContainer}
          >
            <Text style={parentStyles.inputLabel}>Question</Text>
            <Touchable
              onPress={() => this.handleInputModal('question', 'Enter question', 100, question, 'default')}
              style={[parentStyles.inputButton, elevation]}
            >
              <Text
                style={[
                  parentStyles.inputButtonText,
                  !question && parentStyles.placeholder
                ]}
              >
                {showInput && showInput.inputLabel === 'question' ? null : question || 'Enter question'}
              </Text>
            </Touchable>
          </View>

          <View style={parentStyles.inputContainer}>
            <Text style={parentStyles.inputLabel}>Image/Diagram (Optional)</Text>
            <Touchable
              onPress={this.handleImagePicker}
            >
              <View
                style={[
                  image && image !== 'null' ?
                    { ...parentStyles.bannerImageContainer, ...parentStyles.bannerImage } :
                    parentStyles.bannerAddContainer,
                  elevation,
                ]}
              >
                {image && image !== 'null' ?
                  <Image source={{ uri: image }} style={parentStyles.bannerImage} />
                  :
                  <View style={parentStyles.row}>
                    <Aicon name={'image'} style={parentStyles.bannerIcon} />
                    <Text style={parentStyles.bannerLabel}>
                      Add an image or diagram
                    </Text>
                  </View>}
                {image === 'loading' &&
                <ActivityIndicator
                  animating
                  color={colors.primary}
                  size={'large'}
                />}
              </View>
            </Touchable>
          </View>

          <View
            onLayout={this.onAnswerLayout}
            ref={this.handleAnswerRef}
            style={parentStyles.inputContainer}
          >
            <Text style={parentStyles.inputLabel}>Answer</Text>
            <Touchable
              onPress={() => this.handleInputModal('answer', 'Enter answer', 100, answer, 'default')}
              style={[parentStyles.inputButton, elevation]}
            >
              <Text
                style={[
                  parentStyles.inputButtonText,
                  !answer && parentStyles.placeholder
                ]}
              >
                {showInput && showInput.inputLabel === 'answer' ? null : answer || 'Enter answer'}
              </Text>
            </Touchable>
          </View>

          {Boolean(instructions) &&
            <Text style={[parentStyles.inputLabel, parentStyles.marginTop]}>Solution Steps</Text>}

          {Boolean(instructions) && instructions.map((instruction, idx) => (
            <Touchable
              activeOpacity={0.8}
              key={instruction}
              onPress={() => this.handleAddInstruction(idx)}
            >
              <View
                style={[
                  parentStyles.inputContainer,
                  parentStyles.row,
                  parentStyles.inputPadding,
                  parentStyles.justifyStart,
                ]}
              >
                <Text style={parentStyles.bannerLabel}>{`${idx + 1}.  `}</Text>
                <Text style={parentStyles.bannerLabel}>{ instruction }</Text>
              </View>
            </Touchable>
          ))}

          <ButtonWide
            buttonStyles={{ position: 'relative', marginVertical: verticalScale(25) }}
            label={'+ Solution Step'}
            onPress={this.handleAddInstruction}
          />
        </ScrollView>

      </View>
    );
  }
}
