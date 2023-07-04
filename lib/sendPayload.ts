import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { config } from 'dotenv';
import { firestore } from '../index.js';
import { sendErrorWebhook } from './errorWebhook.js';
config();

export const sendPayload = async (payload: any, headers: any) => {
    const url: string = process.env.PAYLOAD_WEBHOOK;
    const hook = new Webhook(url);
    try {
        // Create a new document in Firestore
        const data = { payload, headers };
        const docRef = firestore.collection(payload.sender.login).doc();
        await docRef.set(data);

        // Send a webhook to Discord
        const payloadEmbed = new MessageBuilder().setAuthor(payload.sender.login, payload.sender.avatar_url, payload.sender.html_url).setDescription(`Payload from ${payload.sender.login} with id: ${docRef.id}`).setColor('#00ff00').setTimestamp();
        await hook.send(payloadEmbed);
    } catch (error) {
        console.error('Error:', error);
        sendErrorWebhook(error);
    }
};
