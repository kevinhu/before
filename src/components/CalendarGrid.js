import React, { useState } from 'react';
import moment from 'moment';

function CalendarGrid() {
  const [selectedDate, setSelectedDate] = useState();

  let enumerateDaysBetweenDates = function (startDate, endDate) {
    let dates = [];

    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(currDate.clone());
    }

    return dates;
  };

  const DATE_FORMAT = 'YYYYMMDD';

  let startDate = moment('20130101', DATE_FORMAT);
  let endDate = moment('20140101', DATE_FORMAT);

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

  const GridMouseEnter = (event) => {
    const date = moment(parseInt(event.target.dataset.date));

    setSelectedDate(date);
  };

  const GridMouseLeave = (event) => {
    // console.log(event.target.dataset)
  };

  return (
    <div>
      <div
        className="flex p-2 bg-gray-200 rounded-lg shadow-inner"
        style={{ width: 'max-content', margin: '0 auto' }}>
        {datesByWeek.map((week) => (
          <div className={`block`}>
            {week.map((date) => (
              <div
                className={`block bg-green-500 w-4 h-4 rounded text-xs cursor-pointer`}
                style={{ margin: '2px' }}
                data-date={date}
                onMouseEnter={GridMouseEnter}
                onMouseLeave={GridMouseLeave}></div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        Top pages on {selectedDate && selectedDate.format('L')}{' '}
      </div>
    </div>
  );
}

export default CalendarGrid;
