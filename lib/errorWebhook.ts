import { MessageBuilder, Webhook } from 'discord-webhook-node';
import { config } from 'dotenv';
config();
const url: string = process.env.ERROR_WEBHOOK;
const hook = new Webhook(url);

export const sendErrorWebhook = async (error: any) => {
    const embed = new MessageBuilder().setTitle('Error on API occured!').setDescription(`\`\`\`${error}\`\`\``).setColor('#ff0000').setTimestamp();
    await hook.send(embed);
    return;
};
