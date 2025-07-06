//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { default as dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

export const formatDateWithColor = (
  inputDate: string | number | Date,
  time = true,
): {
  formattedDate: string;
  colorCode: string;
} => {
  const date = dayjs(inputDate);

  let formattedDate = '';
  let colorCode = 'gray';

  if (date.isToday()) {
    colorCode = 'green';
    formattedDate = `Today${time ? `, ${date.format('hh:mm A')}` : ''}`;
  } else if (date.isTomorrow()) {
    colorCode = 'blue';
    formattedDate = `Tomorrow${time ? `, ${date.format('hh:mm A')}` : ''}`;
  } else if (date.isYesterday()) {
    colorCode = 'orange';
    formattedDate = `Yesterday${time ? `, ${date.format('hh:mm A')}` : ''}`;
  } else {
    formattedDate = date.format(time ? 'DD/MM/YYYY, hh:mm A' : 'DD/MM/YYYY');
  }

  return {
    formattedDate,
    colorCode,
  };
};

export const formatDate = (date: number) =>
  dayjs(date).format('MMMM D, YYYY h:mm A');
