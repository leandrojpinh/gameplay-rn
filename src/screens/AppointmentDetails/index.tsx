import React, { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { View, ImageBackground, Text, FlatList, Alert, Share } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/core';
import * as Linking from 'expo-linking';

import { Background } from '../../components/Background';
import { Header } from '../../components/Header';
import { theme } from '../../global/styles/theme';

import bannerImg from '../../assets/banner.png';
import { styles } from './styles';
import { ListHeader } from '../../components/ListHeader';
import { Member, MemberProps } from '../../components/Member';
import { ListDivider } from '../../components/ListDivider';
import { ButtonIcon } from '../../components/ButtonIcon';
import { AppointmentProps } from '../../components/Appointment';
import { api } from '../../services/api';
import { Load } from '../../components/Load';

type Params = {
    guildSelected: AppointmentProps
}

type GuildWidget = {
    id: string;
    name: string;
    instant_invite: string;
    members: MemberProps[];
    presence_count: number;
}

export function AppointmentDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const { guildSelected } = route.params as Params;
    const [loading, setLoading] = useState(true);
    const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);

    async function fetchGuildWidget() {
        try {
            console.log('', {
                token: api.defaults.headers.authorization,
                base: api.defaults.baseURL,
                url: `/guilds/${guildSelected.guild.id}/widget.json`
            });
            const response = await api.get(`/guilds/${guildSelected.guild.id}/widget.json`);
            
            setWidget(response.data);
        } catch {
            Alert.alert('Verifique as configuraçoes do servidor. Será que o Widget está habilitado?', undefined, [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleShareInvitation() {
        const message = `Junte-se a ${guildSelected.guild.name}`;

        Share.share({
            message,
            url: widget.instant_invite,
            title: message
        })
    }

    function handleOpenGuild() {
        Linking.openURL(widget.instant_invite);
    }

    useEffect(() => {
        fetchGuildWidget();
    }, []);

    return (
        <Background>
            <Header
                title='Detalhes'
                action={
                    guildSelected.guild.owner && <BorderlessButton onPress={handleShareInvitation}>
                        <Fontisto name='share' size={24} color={theme.colors.primary} />
                    </BorderlessButton>
                }
            />

            <ImageBackground source={bannerImg} style={styles.banner}>
                <View style={styles.bannerContent}>
                    <Text style={styles.title}>{guildSelected.guild.name}</Text>
                    <Text style={styles.subtitle}>{guildSelected.description}</Text>
                </View>
            </ImageBackground>

            {
                loading ? <Load /> :
                    <>
                        <ListHeader title='Jogadores' subtitle={`Total: ${widget.members?.length}`} />
                        <FlatList
                            data={widget.members || []}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Member data={item} />
                            )}
                            ItemSeparatorComponent={() => <ListDivider isCentered />}
                            style={styles.members}
                        />
                    </>
            }

            {
                guildSelected.guild.owner && widget.instant_invite && <View style={styles.footer}>
                    <ButtonIcon title='Entrar na partida' onPress={handleOpenGuild} />
                </View>
            }

        </Background>
    )
}