export default function eventSwitch(action: string, payload: any) {
    if (action === 'star') {
        if (payload.action === 'deleted') {
            return { actionText: 'unstarred', actionEmoji: '🚫⭐' };
        }
        return { actionText: 'starred', actionEmoji: '⭐' };
    }

    const actionMap = {
        create: { actionText: 'created', actionEmoji: '📝' },
        delete: { actionText: 'deleted', actionEmoji: '🗑️' },
        fork: { actionText: 'forked', actionEmoji: '🍴' },
        push: { actionText: 'pushed to', actionEmoji: '📤' },
        pull_request: { actionText: 'opened a pull request on', actionEmoji: '📥', description: `#${payload?.pullRequestNumber} ${payload?.pullRequestTitle}` },
        issues: { actionText: 'opened an issue on', actionEmoji: '📥', description: `#${payload?.issueId} ${payload?.issueTitle}` },
        issue_comment: { actionText: 'commented on an issue on', actionEmoji: '💬', description: `#${payload?.issueId} ${payload?.issueTitle}` },
        pull_request_review: { actionText: 'reviewed a pull request on', actionEmoji: '📃', description: `#${payload?.pullRequestNumber} ${payload?.pullRequestTitle}` },
        pull_request_review_comment: { actionText: 'commented on a pull request on', actionEmoji: '💬', description: `#${payload?.pullRequestNumber} ${payload?.pullRequestTitle}` },
        watch: { actionText: 'is watching', actionEmoji: '👀' },
        release: { actionText: 'released', actionEmoji: '📦' },
        member: { actionText: 'added someone to', actionEmoji: '👤' },
        commit_comment: { actionText: 'commented on a commit on', actionEmoji: '💬', description: `${payload.comment?.body}` },
        status: { actionText: 'changed the status of a commit on', actionEmoji: '📝', description: `${commitStatus(payload?.state)}` },
        deployment: { actionText: 'deployed', actionEmoji: '🚀' },
        deployment_status: { actionText: 'changed the status of a deployment on', actionEmoji: '📝' },
        ping: { actionText: 'pinged', actionEmoji: '🏓' },
    };

    const { actionText, actionEmoji, description }: ActionDetails = actionMap[action] || { actionText: 'did something on', actionEmoji: '❓' };
    return { actionText, actionEmoji, description };
}

function commitStatus(status: string) {
    switch (status) {
        case 'success':
            return '✅ Success';
        case 'pending':
            return '⏳ Pending';
        case 'failure':
            return '❌ Failure';
        case 'error':
            return '🚨 Error';
        default:
            return '❓ Unknown';
    }
}

export interface ActionDetails {
    actionText: string;
    actionEmoji: string;
    description: string;
}
