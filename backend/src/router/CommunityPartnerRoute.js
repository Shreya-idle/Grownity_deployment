import express from 'express';
import { createCommunityPartner, updateCommunityPartner, getCommunityPartners, getCommunityPartnerByEmail, bulkUpdateCommunityPartnerStatus } from '../controller/CommunityPartnerControl.js';
import { checkSessionCookie } from '../middleware/cookies.middleware.js';

const CommunityPartnerRouter = express.Router();

CommunityPartnerRouter.post('/', createCommunityPartner);
CommunityPartnerRouter.get('/', checkSessionCookie, getCommunityPartners);
CommunityPartnerRouter.get('/list', getCommunityPartners);
CommunityPartnerRouter.get('/user/:email', getCommunityPartnerByEmail);
CommunityPartnerRouter.patch('/bulk-status', bulkUpdateCommunityPartnerStatus);
CommunityPartnerRouter.patch('/:id', checkSessionCookie, updateCommunityPartner);
CommunityPartnerRouter.put('/:id', updateCommunityPartner);

export default CommunityPartnerRouter;
