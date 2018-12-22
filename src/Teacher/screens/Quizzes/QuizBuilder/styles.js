import { StyleSheet } from 'react-native';
import { colors, deviceWidth, fonts } from '../../../../utils/theme';


export default StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 1,
    height: 200,
    justifyContent: 'center',
    width: deviceWidth - 30,
  },
  avatarIcon: {
    alignSelf: 'center',
    color: colors.primary,
    fontSize: fonts.large,
    marginBottom: 10,
  },
  avatarImage: {
    height: 200,
    width: deviceWidth - 30,
  },
  avatarLabel: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  closeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.white,
    fontSize: 25,
    position: 'absolute',
  },
  closeIconShadow: {
    color: colors.primary,
    fontSize: 33,
  },
  container: {
    backgroundColor: colors.lightGray,
    flex: 1,
  },
  createContainer: {
    position: 'absolute',
    right: 15,
  },
  createLabel: {
    color: colors.primary,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  headerContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    elevation: 2,
    flexDirection: 'row',
    height: 65,
    justifyContent: 'flex-start',
    borderBottomWidth: 0.5,
    borderColor: colors.dark,
    paddingLeft: 20,
  },
  inputButton: {
    backgroundColor: colors.white,
    borderColor: colors.dark,
    borderWidth: 1,
    height: 45,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: deviceWidth - 30,
  },
  inputButtonText: {
    color: colors.dark,
    fontSize: fonts.medium,
    fontWeight: 'bold',
  },
  inputContainer: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginTop: 15,
  },
  inputLabel: {
    color: colors.dark,
    fontSize: fonts.small,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placeholder: {
    color: colors.lightGray,
  },
  questionContainer: {
    height: 100,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: deviceWidth - 30,
  },
  questionAnswer: {
    color: colors.dark,
    fontSize: fonts.small,
  },
  questionImage: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  questionImageText: {
    color: colors.white,
    fontSize: fonts.small,
    fontStyle: 'italic',
  },
  questionQuestion: {
    color: colors.dark,
    fontSize: fonts.medium,
  },
  questionTextContainer: {
    backgroundColor: colors.white,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  scrollview: {
    flexGrow: 1,
    paddingBottom: 95,
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  title: {
    color: colors.dark,
    fontSize: fonts.large,
    fontWeight: 'bold',
    marginLeft: 25,
  },
  warning: {
    color: colors.red,
    fontSize: fonts.medium,
    bottom: 5,
    position: 'absolute',
    right: 5,
  },
});
