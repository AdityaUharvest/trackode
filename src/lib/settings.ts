import connectDB from './util';
import AppSettings from '@/app/model/AppSettings';

export const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  quizzesEnabled: true,
  mocksEnabled: true,
  resultsVisible: true,
  allowPublicQuizJoin: true,
  allowMockAttempts: true,
  autoSendResults: true,
};

export async function getAppSettings() {
  try {
    await connectDB();
    const settings = await AppSettings.findOne({ key: 'global' }).lean();
    
    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...settings,
    };
  } catch (error) {
    console.error('Error fetching app settings:', error);
    return DEFAULT_SETTINGS;
  }
}
