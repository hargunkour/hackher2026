import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function ExEmailScreen({ route, navigation }: { route: any, navigation: any }) {
    const { user, token } = route.params;
    const [exEmail, setExEmail] = useState('');

    const handleContinue = () => {
        if (!exEmail) return;
        navigation.navigate('riskDashboard', { user, token, exEmail });
    };

    return (
        <View>
            <Text>Hi {user.displayName}!</Text>
            <Text>Let's begin to secure your digital life.</Text>
            <Text>Enter your ex's email address:</Text>
            <TextInput
                placeholder="ex@example.com"
                value={exEmail}
                onChangeText={setExEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button
                title="Start Scanning"
                onPress={handleContinue}
            />
        </View>
    );
}