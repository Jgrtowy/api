import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { config } from 'dotenv';
config();

const url: string = process.env.PAYLOAD_WEBHOOK;
const hook = new Webhook(url);

export const sendPayload = async (payload: any, headers: any) => {
    let msg = JSON.stringify(payload);
    if (msg.length > 1900) {
        msg = msg.slice(0, 1900);
        msg += `
        ...`;
    }
    const payloadEmbed = new MessageBuilder()
        .setAuthor(payload.sender.login, payload.sender.avatar_url, payload.sender.html_url)
        .setDescription(`\`\`\`${JSON.stringify(msg)}\`\`\``)
        .setColor('#00ff00')
        .setTimestamp();
    await hook.send(payloadEmbed);
    const headerEmbed = new MessageBuilder()
        .setAuthor(payload.sender.login, payload.sender.avatar_url, payload.sender.html_url)
        .setDescription(`\`\`\`${JSON.stringify(headers)}\`\`\``)
        .setColor('#0000ff')
        .setTimestamp();
    await hook.send(headerEmbed);
    return;
};
