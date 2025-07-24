export interface Toast {
  id?: string;
  title: string;
  type: ToastType;
  description?: string[];
}

export enum ToastType {
  Success = 'success',
  Info = 'info',
  Error = 'error',
  Notification = 'notification',
}
