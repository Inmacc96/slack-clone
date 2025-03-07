import { format, isToday, isYesterday } from "date-fns";

export const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const formatTime = (date: Date) => {
  return format(date, "hh:mm");
};

export const formatTimeWithPeriod = (date: Date) => {
  return format(date, "hh:mm a");
};

export const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const isEmptyMessageText = (text: string) => {
  return text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
};
