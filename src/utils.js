import moment from 'moment';


export const enumerateDaysBetweenDates = (startDate, endDate) => {
  let dates = [];

  let currDate = moment(startDate).startOf('day');
  let lastDate = moment(endDate).startOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.clone());
  }

  return dates;
};


export const daysInYearByWeek = (year) => {
  const DATE_FORMAT = 'YYYYMMDD';

  let startDate = moment((year - 1).toString() + '1231', DATE_FORMAT);
  let endDate = moment((year + 1).toString() + '0101', DATE_FORMAT);

  let dates = enumerateDaysBetweenDates(startDate, endDate);

  let datesByWeek = [];

  let week_ = 1;
  let week_group = [];

  for (const date of dates) {
    if (week_ !== date.week()) {
      datesByWeek.push(week_group);
      week_group = [];
      week_ = date.week();
    }
    week_group.push(date);
  }

  if (week_group.length > 0) {
    datesByWeek.push(week_group);
  }

  const firstWeek = datesByWeek[0];

  while (firstWeek.length < 7) {
    firstWeek.unshift(firstWeek[0].clone().add(-1, 'days'));
  }

  const lastWeek = datesByWeek.slice(-1)[0];

  while (lastWeek.length < 7) {
    lastWeek.push(lastWeek.slice(-1)[0].clone().add(1, 'days'));
  }

  return datesByWeek;
};
