import { Router } from "express";
import { getUser ,getAllUsers } from "../controller/UserControl.js";

const UserRoute = Router();

UserRoute.get("/", getUser);
UserRoute.get("/all-admin", getAllUsers);
export default UserRoute;
