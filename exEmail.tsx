import { useState } from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

export default function ExEmailScreen({ route, navigation }: { route: any, navigation: any }) {
    const { user, token } = route.params;
    const [exEmail, setExEmail] = useState('');

    const [fontsLoaded] = useFonts({
        'NoTears': require('./assets/fonts/No Tears.ttf'),
        'NoTears-Bold': require('./assets/fonts/No Tears Bold.ttf'),
      });

    const font = fontsLoaded ? 'NoTears-Bold' : 'Georgia';

    const handleContinue = () => {
        if (!exEmail) return;
        navigation.navigate('riskDashboard', { user, token, exEmail });
    };

    return (
        <View style={styles.page}>
            {/* Lined notebook paper background */}
            <View style={styles.linesContainer} pointerEvents="none">
                {Array.from({ length: 50 }).map((_, i) => (
                    <View key={i} style={styles.line} />
                ))}
            </View>

            <Text style={[styles.text, { fontFamily: font }]}>Hi! </Text>
            <Text style={[styles.text, { fontFamily: font }]}>Let's begin to secure your digital life.</Text>
            <Text style={[styles.text, { fontFamily: font }]}>Enter your partner's email address:</Text>
            <TextInput
                placeholder="ex@example.com"
                value={exEmail}
                onChangeText={setExEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={[styles.buttonText, { fontFamily: font }]}>Start Scanning</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#faf5f7',
        padding: 20,
        paddingTop: 60,
    },
    linesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 60,
    },
    line: {
        height: 1,
        backgroundColor: '#d8d0dc',
        marginVertical: 11,
        opacity: 0.5,
    },
    text: {
        color: '#1a1a2e',
        marginBottom: 6,
        fontSize: 18,
        marginTop: 12,
    },
    button: {
        backgroundColor: '#c0607a',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 4,
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        letterSpacing: 1,
    },
});
