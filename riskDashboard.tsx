import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Button } from 'react-native';

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
        <ScrollView>
            <Text>Scan Results for {exEmail}</Text>

            {/* Drive: shared with ex */}
            <TouchableOpacity onPress={() => setExpandDriveShared(!expandDriveShared)}>
                <Text>{driveSharedFiles.length} files shared with your partner {expandDriveShared ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandDriveShared && driveSharedFiles.map((file: any) => (
                <Text key={file.id}>• {file.name}</Text>
            ))}

            {/* Drive: accessible via link */}
            <TouchableOpacity onPress={() => setExpandDriveLink(!expandDriveLink)}>
                <Text>{driveLinkFiles.length} files accessible via link {expandDriveLink ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandDriveLink && driveLinkFiles.map((file: any) => (
                <Text key={file.id}>• {file.name}</Text>
            ))}

            {/* Calendars shared with ex
            <TouchableOpacity onPress={() => setExpandCalendars(!expandCalendars)}>
                <Text>{sharedCalendars.length} calendars shared with ex {expandCalendars ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandCalendars && sharedCalendars.map((cal: any) => (
                <Text key={cal.id}>• {cal.summary}</Text>
            ))} */}

            {/* Calendar events with ex */}
            <TouchableOpacity onPress={() => setExpandEvents(!expandEvents)}>
                <Text>{calendarEvents.length} upcoming events with your partner {expandEvents ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandEvents && calendarEvents.map((event: any) => (
                <Text key={event.id}>• {event.summary}</Text>
            ))}

            {/* Gmail subscriptions */}
            <TouchableOpacity onPress={() => setExpandGmail(!expandGmail)}>
                <Text>{gmailSubscriptions.length} subscription emails involving your partner {expandGmail ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {expandGmail && gmailSubscriptions.map((msg: any) => (
                <Text key={msg.id}>• {msg.payload?.headers?.find((h: any) => h.name === 'From')?.value}</Text>
            ))}

            <Button title="Continue to Questionnaire" onPress={() => navigation.navigate('Quiz')} />

        </ScrollView>
    );

}