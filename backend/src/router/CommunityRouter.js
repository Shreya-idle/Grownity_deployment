import express from 'express'
import { checkSessionCookie } from '../middleware/cookies.middleware.js';
import { joinCommuntiy, getUserCreatedCommunities, getUserCommunities, getModeratedCommunity, multiCommunitySearch, getDomainStats, getZoneStats, getCommunityZones, getCommunityType, getCommunityState, getRejectedCommunity, getPendingCommunity, createCommunity, searchCommunities, deleteCommunity, getCommunityById, getApprovedCommunity, updateCommunity } from '../controller/CommunityControl.js'
const CommunityRouter = express.Router()



CommunityRouter.post('/', createCommunity);
CommunityRouter.post('/join', checkSessionCookie, joinCommuntiy);
CommunityRouter.get('/search', searchCommunities);
CommunityRouter.get('/filter-search', multiCommunitySearch)
CommunityRouter.get('/approved', getApprovedCommunity);
CommunityRouter.get('/pending', checkSessionCookie, getPendingCommunity);
CommunityRouter.get('/rejected', checkSessionCookie, getRejectedCommunity)
CommunityRouter.get('/moderated', checkSessionCookie, getModeratedCommunity)
CommunityRouter.get('/user-communities', checkSessionCookie, getUserCommunities);
CommunityRouter.get('/user-created-communities', checkSessionCookie, getUserCreatedCommunities);
CommunityRouter.get('/domain-stats', getDomainStats)
CommunityRouter.get('/stats/zones', getZoneStats);
CommunityRouter.get('/state/:name', getCommunityState)
CommunityRouter.get('/domain/:domainType', getCommunityType)
CommunityRouter.get('/zone/:zoneInput', getCommunityZones)
CommunityRouter.get('/:id', getCommunityById);
CommunityRouter.delete('/:id', checkSessionCookie, deleteCommunity);
CommunityRouter.patch('/update/:id', checkSessionCookie, updateCommunity);


export default CommunityRouter