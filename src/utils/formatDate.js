import { format, parseISO } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    return dateString ? format(parseISO(dateString), 'MMM dd, yyyy, hh:mm a') : 'N/A';
  } catch {
    return 'N/A';
  }
};