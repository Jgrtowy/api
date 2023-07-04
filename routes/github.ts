import * as crypto from 'crypto';
import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { config } from 'dotenv';
import express from 'express';
import { sendErrorWebhook } from '../lib/errorWebhook.ts';
import eventSwitch from '../lib/eventSwitch.ts';
import { sendPayload } from '../lib/sendPayload.ts';
const router = express.Router();

const secret: string = process.env.WEBHOOK_SECRET;
const webhook_url: string = process.env.GITHUB_WEBHOOK;
const hook = new Webhook(webhook_url);

const verify_signature = (req: any) => {
    const signature = crypto.createHmac('sha256', `${secret}`).update(JSON.stringify(req.body)).digest('hex');
    return `sha256=${signature}` === req.headers['x-hub-signature-256'];
};

const sendWebhook = async (payload: any, headers: any) => {
    try {
        const { repository, sender } = payload;
        const action = headers['x-github-event'];

        const { actionText, actionEmoji, description } = eventSwitch(action, payload);

        const embed = new MessageBuilder().setAuthor(sender.login, sender.avatar_url, sender.html_url).setTitle(`${actionEmoji} ${sender.login} ${actionText} ${repository.name}`).setUrl(`${repository.html_url}`).setDescription(description).setTimestamp();
        await hook.send(embed);
        await sendPayload(payload, headers);
    } catch (error) {
        throw new Error(error);
    }
};

router.post('/', async (req, res) => {
    if (!verify_signature(req)) {
        res.sendStatus(403);
        return;
    }
    try {
        await sendWebhook(req.body, req.headers);
    } catch (error) {
        sendErrorWebhook(error);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

export default router;
