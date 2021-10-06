import { StyleSheet } from 'react-native';
import { theme } from '../../global/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 500,
    },
    content: {
        paddingHorizontal: 24
    },
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay
    },
    label: {
        fontFamily: theme.fonts.title700,
        color: theme.colors.heading,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 24
    },
    play: {
        color: theme.colors.primary
    },
    actions: {
        maxWidth: '100%',
        flexDirection: 'row',
        marginVertical: 24
    },
    gap: {
        marginLeft: 10
    }
});