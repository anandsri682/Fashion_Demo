import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 'ORDER' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'CUSTOMER';

export interface INotification extends Document {
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['ORDER', 'LOW_STOCK', 'OUT_OF_STOCK', 'CUSTOMER'], required: true },
    read: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
