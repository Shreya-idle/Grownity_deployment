import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../src/config/db_config.js';
import authRoutes from '../src/router/AuthRoute.js';
import CommunityRouter from '../src/router/CommunityRouter.js';
import DataRouter from '../src/router/DataRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import UserRoute from '../src/router/UserRoute.js';
import { checkSessionCookie } from '../src/middleware/cookies.middleware.js';
import { checkSuperUser } from '../src/middleware/cookies.middleware.js'
import SuperUserRoute from '../src/router/SuperUser.js';
import VolunteerRouter from '../src/router/VolunteerRoute.js';
import SponsorRouter from '../src/router/SponsorRoute.js';
import SpeakerRouter from '../src/router/SpeakerRoute.js';
import ShowcaseRouter from '../src/router/ShowcaseRoute.js';
import CommunityPartnerRouter from '../src/router/CommunityPartnerRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "https://frontendcommunity-9ybx.vercel.app",
  "https://indian-community-beta.vercel.app/",
  "https://grownity-deployment-jamv-dcphaw6zx-shreya-idles-projects.vercel.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// app.use(checkSessionCookie);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/user", checkSessionCookie, UserRoute);
app.use('/api/auth', authRoutes);
app.use('/api/communities', CommunityRouter);
app.use('/api/data', DataRouter);
app.use("/api/super_user", checkSuperUser, SuperUserRoute);
app.use('/api/volunteer', VolunteerRouter);
app.use('/api/sponsors', SponsorRouter);
app.use('/api/speaker', SpeakerRouter);
app.use('/api/showcase', ShowcaseRouter);
app.use('/api/community-partner', CommunityPartnerRouter);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database. Server not started.', error);
    process.exit(1);
  }
};
startServer();

export default app