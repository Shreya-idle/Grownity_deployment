import express from 'express';
import { createSponsor, updateSponsor, getSponsors, getSponsorByEmail, bulkUpdateSponsorStatus } from '../controller/SponsorControl.js';
import { checkSessionCookie } from '../middleware/cookies.middleware.js';

const SponsorRouter = express.Router();

SponsorRouter.post('/', createSponsor);
SponsorRouter.get('/', checkSessionCookie, getSponsors);
SponsorRouter.get('/list', getSponsors);
SponsorRouter.get('/user/:email', getSponsorByEmail);
SponsorRouter.patch('/bulk-status', bulkUpdateSponsorStatus);
SponsorRouter.patch('/:id', checkSessionCookie, updateSponsor);
SponsorRouter.put('/:id', updateSponsor);

export default SponsorRouter;
