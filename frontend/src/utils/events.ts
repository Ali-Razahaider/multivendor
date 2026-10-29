export type EventData = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  totalSell?: number;
  startDate?: string;
  endDate: string;
  status?: string;
  images?: Array<string | { url: string }>;
};

export const isCurrentEvent = (event: EventData) => {
  const endTime = new Date(event.endDate || '').getTime();
  const startTime = event.startDate ? new Date(event.startDate).getTime() : 0;
  const now = Date.now();
  return Number.isFinite(endTime) && endTime > now && startTime <= now && event.status !== 'ended';
};
