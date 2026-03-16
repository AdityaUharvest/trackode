import mongoose, { Document, Schema } from 'mongoose';

export interface IAppSettings extends Document {
  key: string;
  maintenanceMode: boolean;
  quizzesEnabled: boolean;
  mocksEnabled: boolean;
  resultsVisible: boolean;
  allowPublicQuizJoin: boolean;
  allowMockAttempts: boolean;
  autoSendResults: boolean;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppSettingsSchema = new Schema<IAppSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    maintenanceMode: { type: Boolean, default: false },
    quizzesEnabled: { type: Boolean, default: true },
    mocksEnabled: { type: Boolean, default: true },
    resultsVisible: { type: Boolean, default: true },
    allowPublicQuizJoin: { type: Boolean, default: true },
    allowMockAttempts: { type: Boolean, default: true },
    autoSendResults: { type: Boolean, default: true },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

const AppSettings =
  mongoose.models.AppSettings ||
  mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema);

export default AppSettings;
