import React from 'react';
import { View, Image, Text } from 'react-native';

import { styles } from './styles';

import illustrationImg from '../../assets/illustration.png';
import { ButtonIcon } from '../../components/ButtonIcon';
import { useNavigation } from '@react-navigation/native';

export function SignIn() {
    const navigation = useNavigation();

    function handleSignIn() {
        navigation.navigate({
            name: 'Home'
        } as any);
    }

    return (
        <View style={styles.container}>
            <Image source={illustrationImg} resizeMode='stretch' />

            <View style={styles.content}>
                <Text style={styles.title}>
                    Conecte-se {'\n'}
                    e organize suas {'\n'}
                    jogatinas
                </Text>

                <Text style={styles.subtitle}>
                    Crie grupos para jogar seus games {`\n`}
                    favoritos com seus amigos
                </Text>

                <ButtonIcon title='Entrar com Discord' onPress={handleSignIn}/>
            </View>
        </View>
    );
}