/**
 * @providesModule theme
 */
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('screen');
const deviceHeight = height;
const deviceWidth = width;

const fonts = {
  small: 14,
  medium: 18,
  large: 24,
};

const colors = {
  primary: '#007dc0',
  secondary: '#8cd5df',
  black: '#000',
  white: '#fff',
  grey: '#d3d3d3',
  dark: '#23282d',
  darkGray: '#4a4a4a',
  lightGray: '#e3e3e3',
  mediumGray: '#c9c9c9',
  grayIcon: '#828f9b',
  mask: 'rgba(52, 52, 52, 0.8)',
  red: '#c0001d',
};

export {
  colors,
  deviceHeight,
  deviceWidth,
  fonts,
};
