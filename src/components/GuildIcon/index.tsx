import React from 'react';
import { Image } from 'react-native';

import { styles } from './styles';

export function GuildIcon() {
    const uri = 'https://w7.pngwing.com/pngs/942/98/png-transparent-discord-computer-icons-teamspeak-computer-servers-others-miscellaneous-blue-smiley.png';
    return (
        <Image source={{ uri: uri }} style={styles.image} resizeMode='cover' />
    )
}
