import dotenv from 'dotenv';

dotenv.config();

const config = {
  serverPort: process.env.SERVER_PORT || 8000,
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret',
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret',
  },
};

export default config;
