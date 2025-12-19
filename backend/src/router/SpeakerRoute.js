import express from 'express';
import { createSpeaker, updateSpeaker, getSpeakers, getSpeakerByEmail, bulkUpdateSpeakerStatus } from '../controller/SpeakerControl.js';
import { checkSessionCookie } from '../middleware/cookies.middleware.js';

const SpeakerRouter = express.Router();

SpeakerRouter.post('/', createSpeaker);
SpeakerRouter.get('/', checkSessionCookie, getSpeakers);
SpeakerRouter.get('/list', getSpeakers);
SpeakerRouter.get('/user/:email', getSpeakerByEmail);
SpeakerRouter.patch('/bulk-status', bulkUpdateSpeakerStatus);
SpeakerRouter.patch('/:id', checkSessionCookie, updateSpeaker);
SpeakerRouter.put('/:id', updateSpeaker);

export default SpeakerRouter;
