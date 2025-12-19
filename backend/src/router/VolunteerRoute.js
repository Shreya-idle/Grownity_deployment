import express from 'express';
import { createVolunteer, updateVolunteer, updateVolunteerStatus, getVolunteerByEmail, getAllVolunteers, bulkUpdateVolunteerStatus } from '../controller/VolunteerControl.js';
import { checkSessionCookie } from '../middleware/cookies.middleware.js';

const VolunteerRouter = express.Router();

VolunteerRouter.post('/', createVolunteer);
VolunteerRouter.get('/list', getAllVolunteers);
VolunteerRouter.get('/user/:email', getVolunteerByEmail);
VolunteerRouter.patch('/bulk-status', bulkUpdateVolunteerStatus);
VolunteerRouter.patch('/:id/status', updateVolunteerStatus);
VolunteerRouter.put('/:id', updateVolunteer);

export default VolunteerRouter;
