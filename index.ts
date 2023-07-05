import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
const app = express();
app.use(express.json());
app.use(cors());
config();

const serviceAccount = {
    privateKey: process.env.FIRESTORE_PRIVATE_KEY,
    clientEmail: process.env.FIRESTORE_EMAIL,
    projectId: 'githubwebhooksstorage',
} satisfies admin.ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://githubwebhooksstorage.firebaseio.com',
});

export const firestore = admin.firestore();

const limiter = rateLimit({
    windowMs: 10 * 60000,
    max: 100,
    message: "Hold up, you're making too many requests! Try again in 10 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

import github from './routes/github';
import netlify from './routes/netlify';
import rcon from './routes/rcon';
import root from './routes/root';
import status from './routes/status';
app.use('/', root);
app.use('/status', status);
app.use('/rcon', rcon);
app.use('/netlify', netlify);
app.use('/github', github);

app.listen(process.env.PORT || 5000);
console.log(`Listening on port ${process.env.PORT || 5000}`);
