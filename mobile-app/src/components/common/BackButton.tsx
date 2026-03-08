import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface BackButtonProps {
    onPress?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.backBtn}
            onPress={onPress || (() => navigation.goBack())}
        >
            <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#16132B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    backIcon: {
        color: '#fff',
        fontSize: 22,
    },
});
