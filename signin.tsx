import { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '852536999408-76dole4qkedns9s6qo6svsnkicf8mdgv.apps.googleusercontent.com'

export default function SignInScreen({ navigation }: { navigation: any }) {

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: WEB_CLIENT_ID,
        redirectUri: 'http://localhost:8081/',
        scopes: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/gmail.readonly',
        ]
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const token = response.authentication?.accessToken;
            if (token) {
                fetchUserInfo(token);
            }
        }
    }, [response]);


    const fetchUserInfo = async (token: string) => {
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const user = await res.json();
        console.log(user);

        navigation.navigate('exEmail', { user, token });
    };

    //this part is just basic styling for now

    console.log('REDIRECT URI:', AuthSession.makeRedirectUri());

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Breakup Security Kit</Text>
            <Button
                title="Sign in with Google"
                disabled={!request}
                onPress={() => promptAsync()}
            />
        </View>
    );
}