import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  db_url: process.env.DATABASE_URL || process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 12,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || 'secret_cleanix_jwt_key',
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || 'refresh_cleanix_jwt_key',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '365d',
  google_client_id: process.env.GOOGLE_CLIENT_ID || '774257262358-2dc95avb68lnbd1ugumtapue4lstbp62.apps.googleusercontent.com',
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET || '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',
  google_redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/v1/auth/google/callback',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
};
