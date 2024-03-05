import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  google: {
    privateKey: process.env.SPREADSHEET_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.SPREADSHEET_CLIENT_EMAIL,
    scopes: process.env.SPREADSHEET_SCOPES_DRIVE,
    filePath: process.env.SPREADSHEET_FILE_PATH,
  },
}));
