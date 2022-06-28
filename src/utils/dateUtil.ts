/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import locale_zh from 'dayjs/locale/zh-cn';
dayjs.locale(locale_zh);
// RelativeTime 插件
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date: dayjs.Dayjs | Date | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | string | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatToNow(date: dayjs.Dayjs | Date | undefined = undefined): string {
  if (isLongAgo(date)) {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  }
  return dayjs(date).fromNow();
}

function isLongAgo(date: dayjs.Dayjs | Date | undefined = undefined) {
  return dayjs(new Date()).diff(date) > 1000 * 60 * 60 * 24 * 30;
}

export const dateUtil = dayjs;
