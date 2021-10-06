import React from 'react';
import { View, Modal, ModalProps, Text } from 'react-native';
import { Background } from '../Background';
import { Button } from '../Button';
import { ButtonOutlined } from '../ButtonOutlined';

import { styles } from './styles';

type Props = ModalProps & {
    close: () => void;
    signOut: () => void;
}

export function ModalSignOut({ close, signOut, ...rest }: Props) {
    return (
        <Modal
            transparent
            animationType='slide'
            statusBarTranslucent
            {...rest}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Background>
                        <View style={styles.content}>
                            <Text style={styles.label}>Deseja sair do Game<Text style={styles.play}>Play</Text>?</Text>

                            <View style={styles.actions}>
                                <ButtonOutlined title='Não' onPress={close} />
                                <Button title='Sim' onPress={signOut} />
                            </View>
                        </View>
                    </Background>
                </View>
            </View>
        </Modal>
    );
}