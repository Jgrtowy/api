import * as crypto from 'crypto';
import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { config } from 'dotenv';
import express from 'express';
import { sendErrorWebhook } from '../lib/errorWebhook.js';
const router = express.Router();
config();

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

        let actionText = '';
        let actionEmoji = '';
        switch (action) {
            case 'star':
                if (payload.action === 'deleted') {
                    actionText = 'unstarred';
                    actionEmoji = '🚫⭐';
                    break;
                }
                actionText = 'starred';
                actionEmoji = '⭐';
                break;
            case 'create':
                actionText = 'created';
                actionEmoji = '📝';
                break;
            case 'delete':
                actionText = 'deleted';
                actionEmoji = '🗑️';
                break;
            case 'fork':
                actionText = 'forked';
                actionEmoji = '🍴';
                break;
            case 'push':
                actionText = 'pushed to';
                actionEmoji = '📤';
                break;
            case 'pull_request':
                actionText = 'opened a pull request on';
                actionEmoji = '📥';
                break;
            case 'issues':
                actionText = 'opened an issue on';
                actionEmoji = '📥';
                break;
            case 'issue_comment':
                actionText = 'commented on an issue on';
                actionEmoji = '💬';
                break;
            case 'pull_request_review':
                actionText = 'reviewed a pull request on';
                actionEmoji = '📝';
                break;
            case 'pull_request_review_comment':
                actionText = 'commented on a pull request on';
                actionEmoji = '💬';
                break;
            case 'watch':
                actionText = 'watched';
                actionEmoji = '👀';
                break;
            case 'release':
                actionText = 'released';
                actionEmoji = '📦';
                break;
            case 'repository':
                actionText = 'updated';
                actionEmoji = '📝';
                break;
            case 'commit_comment':
                actionText = 'commented on a commit on';
                actionEmoji = '💬';
                break;
            case 'member':
                actionText = 'added a member to';
                actionEmoji = '👥';
                break;
            default:
                actionText = 'did something on';
                actionEmoji = '🤷';
                break;
        }
        const embed = new MessageBuilder().setAuthor(sender.login, sender.avatar_url, sender.html_url).setTitle(`${actionEmoji} ${sender.login} ${actionText} ${repository.name}`).setTimestamp();
        await hook.send(embed);
    } catch (err) {
        throw new Error(err);
    }
};

router.post('/', async (req, res) => {
    if (!verify_signature(req)) {
        res.sendStatus(403);
        return;
    }
    try {
        await sendWebhook(req.body, req.headers);
    } catch (err) {
        sendErrorWebhook(err);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

export default router;
