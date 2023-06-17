import express from 'express';
import * as path from 'path';
const router = express.Router();

router.get('/', async (req, res) => res.sendFile(path.join(path.resolve(), 'index.html')));
export default router;
