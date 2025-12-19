import express from 'express';
import { createShowcase, updateShowcase, getShowcases, getShowcaseByEmail, bulkUpdateShowcaseStatus } from '../controller/ShowcaseControl.js';
import { checkSessionCookie } from '../middleware/cookies.middleware.js';

const ShowcaseRouter = express.Router();

ShowcaseRouter.post('/', createShowcase);
ShowcaseRouter.get('/', checkSessionCookie, getShowcases);
ShowcaseRouter.get('/list', getShowcases);
ShowcaseRouter.get('/user/:email', getShowcaseByEmail);
ShowcaseRouter.patch('/bulk-status', bulkUpdateShowcaseStatus);
ShowcaseRouter.patch('/:id', checkSessionCookie, updateShowcase);
ShowcaseRouter.put('/:id', updateShowcase);

export default ShowcaseRouter;
