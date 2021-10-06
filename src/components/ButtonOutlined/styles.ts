import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 56,
        backgroundColor: 'transparent',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.colors.secondary30,
        borderWidth: 1,
        marginRight: 10
    },
    title: {
        flex: 1,
        color: theme.colors.heading,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: theme.fonts.text500
    },
    iconWrapper: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: theme.colors.line
    },
    icon: {
        width: 24, 
        height: 18
    }
});