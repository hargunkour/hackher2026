import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '852536999408-76dole4qkedns9s6qo6svsnkicf8mdgv.apps.googleusercontent.com';

const { width, height } = Dimensions.get('window');

// Soft pastel dot grid — simple, cute, no images needed
function DotBackground() {
    const cols = Math.ceil(width / 28);
    const rows = Math.ceil(height / 28);
    const dots = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dots.push(
                <View
                    key={`${r}-${c}`}
                    style={{
                        position: 'absolute',
                        left: c * 28 + 8,
                        top: r * 28 + 8,
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#c9b8d8',
                        opacity: 0.45,
                    }}
                />
            );
        }
    }

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {dots}
        </View>
    );
}

export default function SignInScreen({ navigation }: { navigation: any }) {
    const [fontsLoaded] = useFonts({
        'NoTears': require('./assets/fonts/No Tears.ttf'),
        'NoTears-Bold': require('./assets/fonts/No Tears Bold.ttf'),
      });
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: WEB_CLIENT_ID,
        redirectUri: 'http://localhost:8081/',
        scopes: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/gmail.readonly',
        ],
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const token = response.authentication?.accessToken;
            if (token) fetchUserInfo(token);
        }
    }, [response]);

    const fetchUserInfo = async (token: string) => {
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        navigation.navigate('exEmail', { user, token });
    };

    console.log('REDIRECT URI:', AuthSession.makeRedirectUri());

    return (
        <View style={styles.container}>
                  

            {/* Center label sticker */}
            <View style={styles.centered}>
                <View style={styles.labelOuter}>
                    <View style={styles.labelInner}>
                        <Text style={styles.heartSticker}>🩷</Text>
                        <Text style={styles.starSticker}>⭐</Text>

                        <Text style={styles.brandText}>UnLink</Text>
                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={[styles.washiButton, !request && styles.washiButtonDisabled]}
                            disabled={!request}
                            onPress={() => promptAsync()}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.washiButtonText}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cfc4d3', // soft lavender-white
    },

    
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Label sticker — creamy white with double border
    labelOuter: {
        width: width * 0.72,
        borderRadius: 14,
        borderWidth: 3,
        borderColor: '#2a2a2a',
        backgroundColor: '#e8e8e2',
        padding: 5,
        shadowColor: '#9b7bb5',
        shadowOffset: { width: 3, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
        transform: [{ rotate: '-0.8deg' }],
    },
    labelInner: {
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#888',
        backgroundColor: '#faf9f5',
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 22,
        alignItems: 'center',
        position: 'relative',
    },

    heartSticker: {
        position: 'absolute',
        top: 12,
        left: 12,
        fontSize: 22,
        transform: [{ rotate: '-10deg' }],
    },
    starSticker: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: 26,
        transform: [{ rotate: '14deg' }],
    },

    brandText: {
        fontFamily: 'NoTears-Bold',
        fontSize: 56,
        fontWeight: '900',
        color: '#1a1a1a',
        letterSpacing: -0.5,
        marginBottom: 10,
        marginTop: 4,
    },
    divider: {
        width: '100%',
        height: 1.5,
        backgroundColor: '#aaa',
        opacity: 0.4,
        marginBottom: 20,
    },

    // Washi tape button in soft sage green
    washiButton: {
        backgroundColor: '#a8c8b8',
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 3,
        transform: [{ rotate: '-1.2deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    washiButtonDisabled: {
        opacity: 0.5,
    },
    washiButtonText: {
        fontFamily: 'NoTears-Bold',
        fontSize: 20,
        color: '#1a1a1a',
        fontWeight: '900',
        letterSpacing: 0.2,
    },
});