import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { config } from 'dotenv';
import express from 'express';
import { sendErrorWebhook } from '../lib/errorWebhook.ts';
const router = express.Router();

router.post('/', async (req, res) => {
    if (req.query?.key !== process.env.NETLIFY_KEY) return res.status(401).json({ error: 'Invalid key' });

    try {
        const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

        const { eventType } = req.body;
        const { payload } = req.body.eventBody;
        const status = () => {
            switch (eventType) {
                case 'deploy-building':
                    return ':construction: Building... :construction:';
                case 'deploy-success':
                    return ':star: Success! :star:';
                case 'deploy-failed':
                    return ':x: Failed! :x:';
            }
        };
        const color = () => {
            switch (eventType) {
                case 'deploy-building':
                    return 0xff3482;
                case 'deploy-success':
                    return 0x00ff00;
                case 'deploy-failed':
                    return 0xff0000;
            }
        };
        console.log(payload);
        const commit: string = payload.commit_url;
        const embed = new MessageBuilder()
            .setAuthor(`${payload.committer} started new deployment on ${payload.name}`)
            .setTitle(`${status()}`)
            .addField('Branch', payload.branch)
            .addField('Repo', commit.replace(/\/commit\/[a-z0-9]+$/i, ''))
            .addField('Commit message', payload.title)
            .setUrl(payload.commit_url)
            .setColor(color())
            .setTimestamp();
        await hook.send(embed);
        res.status(200).send('OK');
    } catch (error) {
        console.log(error);
        sendErrorWebhook(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
