export async function sendPushoverNotification(title, message) {
    const userKey = process.env.PUSHOVER_USER;
    const apiToken = process.env.PUSHOVER_TOKEN;

    if (!userKey || !apiToken) {
        console.error('Pushover credentials missing in .env.local');
        return false;
    }

    console.log(`Sending Pushover notification: ${title}`);
    try {
        const formData = new URLSearchParams();
        formData.append('token', apiToken);
        formData.append('user', userKey);
        formData.append('title', title);
        formData.append('message', message);

        const response = await fetch('https://api.pushover.net/1/messages.json', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Pushover API error:', response.status, errorText);
            return false;
        }

        const successBody = await response.text();
        console.log('Pushover successful:', successBody);

        return true;
    } catch (error) {
        console.error('Failed to send Pushover notification:', error);
        return false;
    }
}
