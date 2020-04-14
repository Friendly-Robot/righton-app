import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { colors, fonts } from '../../utils/theme';
import { ScaledSheet } from 'react-native-size-matters';

RoundButton.propTypes = {
    title: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
}
export default function RoundButton(props) {
    const { backgroundColor } = props
    return (
        <TouchableOpacity
            style={[{ backgroundColor }, styles.roundButton]}
            onPress={() => { props.onPress() }}>
            <Text style={styles.buttonTitle}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = ScaledSheet.create({
    roundButton: {
        marginLeft: 33,
        marginRight: 33,
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 34
    },
    buttonTitle: {
        fontSize: fonts.large,
        fontWeight: 'bold',
        color: colors.white
    },
})
