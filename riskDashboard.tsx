import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Button, StyleSheet } from 'react-native';

export default function DashboardScreen({ route, navigation }: { route: any, navigation: any }) {
    const { user, token, exEmail } = route.params;

    const [loading, setLoading] = useState(true);
    const [driveSharedFiles, setDriveSharedFiles] = useState<any[]>([])
    const [driveLinkFiles, setDriveLinkFiles] = useState<any[]>([]);
    const [sharedCalendars, setSharedCalendars] = useState<any[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
    const [gmailSubscriptions, setGmailSubscriptions] = useState<any[]>([]);

    //expand the lists if user clicks on it
    const [expandDriveShared, setExpandDriveShared] = useState(false);
    const [expandDriveLink, setExpandDriveLink] = useState(false);
    const [expandCalendars, setExpandCalendars] = useState(false);
    const [expandEvents, setExpandEvents] = useState(false);
    const [expandGmail, setExpandGmail] = useState(false);

    useEffect(() => {
        const scanAll = async () => {
            await Promise.all([
                scanDrive(),
                scanCalendars(),
                scanGmail(),
            ]);
            setLoading(false);
        };
        scanAll();
    }, []);

    //GOOGLE DRIVE STUFF
    const scanDrive = async () => {
        try {

            // Files shared w ex
            const sharedRes = await fetch(
                `https://www.googleapis.com/drive/v3/files?q='${exEmail}'+in+readers&fields=files(id,name,webViewLink,shared)`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const sharedData = await sharedRes.json();

            console.log('Drive shared response:', JSON.stringify(sharedData));

            setDriveSharedFiles(sharedData.files || []);

            // Files accessible via link
            const linkRes = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=visibility='anyoneWithLink'&fields=files(id,name,webViewLink)`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const linkData = await linkRes.json();
            setDriveLinkFiles(linkData.files || []);
        } catch (err) {
            console.log('Drive error', err);
        }
    };

    // GOOGLE CALENDAR STUFF
    const scanCalendars = async () => {
        try {
            const calRes = await fetch(
                `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const calData = await calRes.json();

            console.log('Calendar list:', JSON.stringify(calData));

            const calendars = calData.items || [];

            //calendars shared with ex
            // const shared = calendars.filter((cal: any) =>
            //     cal.description?.includes(exEmail) ||
            //     cal.summary?.includes(exEmail) ||
            //     cal.id?.includes(exEmail)
            // );
            // setSharedCalendars(shared);

            // Get upcoming events and filter by ex as attendee
            const eventsRes = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=50&singleEvents=true&orderBy=startTime`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const eventsData = await eventsRes.json();
            const events = eventsData.items || [];
            const exEvents = events.filter((event: any) =>
                event.attendees?.some((attendee: any) => attendee.email === exEmail)
            );
            setCalendarEvents(exEvents);
        } catch (err) {
            console.log('Calendar error:', err);
        }
    };
    //GMAIL STUFF
    const scanGmail = async () => {
        try {
            const subscriptionDomains = [
                'netflix.com', 'spotify.com', 'amazon.com', 'disneyplus.com',
                'hulu.com', 'appletv.com', 'youtube.com'
            ];

            const domainQuery = subscriptionDomains.map(d => `from:${d}`).join(' OR ');
            const query = `(${domainQuery}) AND (to:${exEmail} OR cc:${exEmail} OR from:${exEmail})`;

            console.log('Gmail query:', query);

            const res = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=20`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            const messages = data.messages || [];

            // Fetch subject/sender for each message
            const details = await Promise.all(
                messages.slice(0, 10).map(async (msg: any) => {
                    const msgRes = await fetch(
                        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return msgRes.json();
                })
            );
            setGmailSubscriptions(details);
        } catch (err) {
            console.log('Gmail error:', err);
        }
    };

    if (loading) {
        return (
            <View>
                <ActivityIndicator />
                <Text>Scanning...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.page}>
            {/* Lined notebook paper lines — decorative */}
            <View style={styles.linesContainer} pointerEvents="none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <View key={i} style={styles.line} />
                ))}
            </View>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.chapterLabel}>Scan Results</Text>
                <Text style={styles.diaryEntry}>Let's identify what information is shared.</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.glitterBlob} />
                <Text style={styles.cardTitle}>📁 Google Drive</Text>

                <TouchableOpacity onPress={() => setExpandDriveShared(!expandDriveShared)}>
                    <Text style={styles.cardSubtitle}>{driveSharedFiles.length} files shared with your partner {expandDriveShared ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {expandDriveShared && driveSharedFiles.map((file: any) => (
                    <Text key={file.id} style={styles.listItem}>• {file.name}</Text>
                ))}

                <TouchableOpacity onPress={() => setExpandDriveLink(!expandDriveLink)}>
                    <Text style={styles.cardSubtitle}>{driveLinkFiles.length} files accessible via link {expandDriveLink ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {expandDriveLink && driveLinkFiles.map((file: any) => (
                    <Text key={file.id} style={styles.listItem}>• {file.name}</Text>
                ))}
            </View>

            {/* Google Calendar Card */}
            <View style={styles.card}>
                <View style={styles.glitterBlob} />
                <Text style={styles.cardTitle}>📅 Google Calendar</Text>

                <TouchableOpacity onPress={() => setExpandEvents(!expandEvents)}>
                    <Text style={styles.cardSubtitle}>{calendarEvents.length} upcoming events with your partner {expandEvents ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {expandEvents && calendarEvents.map((event: any) => (
                    <Text key={event.id} style={styles.listItem}>• {event.summary}</Text>
                ))}
            </View>

            {/* Gmail Card */}
            <View style={styles.card}>
                <View style={styles.glitterBlob} />
                <Text style={styles.cardTitle}>📧 Gmail</Text>

                <TouchableOpacity onPress={() => setExpandGmail(!expandGmail)}>
                    <Text style={styles.cardSubtitle}>{gmailSubscriptions.length} subscription emails involving your partner {expandGmail ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {expandGmail && gmailSubscriptions.map((msg: any) => (
                    <Text key={msg.id} style={styles.listItem}>• {msg.payload?.headers?.find((h: any) => h.name === 'From')?.value}</Text>
                ))}
            </View>

            {/* Continue button */}
            <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Quiz')}>
                <Text style={styles.continueButtonText}>Continue to Questionnaire</Text>
            </TouchableOpacity>


        </ScrollView>
    );
}
const PINK = '#e8a0b0';
const SOFT_PINK = '#f9e4ea';
const CARD_BG = '#e8e0e8';
const LINE_COLOR = '#d8d0dc';
const TEXT_DARK = '#1a1a2e';
const TEXT_PINK = '#c0607a';

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        backgroundColor: '#faf5f7',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        position: 'relative',
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
        backgroundColor: LINE_COLOR,
        marginVertical: 11,
        opacity: 0.5,
    },
    header: {
        marginBottom: 24,
    },
    chapterLabel: {
        fontFamily: 'NoTears-Bold',
        fontSize: 36,
        fontWeight: '700',
        color: TEXT_DARK,
        marginBottom: 8,
    },
    diaryEntry: {
        fontFamily: 'NoTears-Bold',
        fontSize: 18,
        color: TEXT_PINK,
        fontStyle: 'italic',
        opacity: 0.8,
        marginTop: 12,
    },
    diaryBody: {
        fontFamily: 'NoTears-Bold',
        fontSize: 16,
        color: TEXT_PINK,
        fontStyle: 'italic',
        opacity: 0.7,
        marginTop: 4,
    },
    cardSubtitle: {
        fontFamily: 'NoTears-Bold',
        fontSize: 14,
        color: TEXT_PINK,
        fontStyle: 'italic',
        marginTop: 8,
        marginBottom: 4,
    },
    card: {
        backgroundColor: CARD_BG,
        borderRadius: 20,
        padding: 24,
        marginTop: 16,
        marginLeft: 16,
        shadowColor: '#c090a8',
        shadowOffset: { width: 2, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        position: 'relative',
        overflow: 'hidden',
    },
    glitterBlob: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 52,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#c8d4e8',
        opacity: 0.7,
    },
    cardTitle: {
        fontFamily: 'NoTears-Bold',
        fontSize: 16,
        color: TEXT_DARK,
        fontWeight: '600',
    },
    listItem: {
        fontFamily: 'NoTears-Bold',
        fontSize: 14,
        color: TEXT_DARK,
        paddingHorizontal: 32,
        paddingVertical: 4,
        fontStyle: 'italic',
    },
    continueButton: {
        marginTop: 32,
        marginLeft: 16,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: TEXT_PINK,
        alignItems: 'center',
        shadowColor: '#c090a8',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 40,
    },
    continueButtonText: {
        fontFamily: 'NoTears-Bold',
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
    },
});