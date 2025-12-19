import { Router } from "express";
import { adminInvitation, verifyAdminInvitation, getDashboardStats, getRecentActivities } from "../controller/SuperUserControl.js";

const SuperUserRoute = Router();
SuperUserRoute.post('/admin-invitation', adminInvitation)
SuperUserRoute.get('/verify-admin-invitation', verifyAdminInvitation);
SuperUserRoute.get('/stats', getDashboardStats);
SuperUserRoute.get('/recent-activity', getRecentActivities);

export default SuperUserRoute;