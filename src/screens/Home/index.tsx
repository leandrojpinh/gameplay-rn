import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListDivider } from '../../components/ListDivider';
import { ListHeader } from '../../components/ListHeader';
import { Profile } from '../../components/Profile';
import { Background } from '../../components/Background';

import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTION_APPOINTMENTS } from '../../configs/storage';
import { Load } from '../../components/Load';

export function Home() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

    function handleCategorySelect(categoryId: string) {
        categoryId === category ? setCategory('') : setCategory(categoryId);
    }

    function handleAppointmentDetails(guildSelected: AppointmentProps) {
        navigation.navigate({
            name: 'AppointmentDetails',
            params: { guildSelected },
            merge: true
        });
    }

    function handleAppointmentCreate() {
        navigation.navigate('AppointmentCreate' as never);
    }

    async function loadAppointments() {
        const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
        const appointmentsData: AppointmentProps[] = storage ? JSON.parse(storage) : [];

        console.log('loadAppointments', appointmentsData);
        if (category) {
            setAppointments(appointmentsData.filter(item => item.category === category));
        } else {
            setAppointments(appointmentsData);
        }

        setLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadAppointments();
    }, [category]));

    return (
        <Background>
            <View style={styles.header}>
                <Profile />
                <ButtonAdd onPress={handleAppointmentCreate} />
            </View>

            <CategorySelect
                categorySelected={category}
                setCategory={handleCategorySelect}
            />

            {
                loading ? <Load /> :
                    <>
                        <ListHeader title='Partidas agendadas' subtitle={`Total ${appointments.length}`} />
                        <FlatList
                            data={appointments}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Appointment data={item} onPress={() => handleAppointmentDetails(item)} />
                            )}
                            ItemSeparatorComponent={() => <ListDivider />}
                            style={styles.matches}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 24
                            }}
                        />
                    </>
            }

        </Background>
    );
}