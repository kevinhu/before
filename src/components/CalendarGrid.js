import React, { useState, useEffect } from 'react';
import moment from 'moment';

function CalendarGrid() {
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

  const gridClick = (event) => {
    const date = moment(parseInt(event.target.dataset.date));

    setSelectedDate(date);
  };

  const [selectedDate, setSelectedDate] = useState(datesByWeek[0][0]);

  const gridSizing = 'w-4 h-4 rounded';
  const gridTransition = 'transition ease-in duration-200';

  return (
    <div className="bg-gray-200">
      <div
        className="flex p-2 rounded-lg shadow-inner bg-white"
        style={{ width: 'max-content', margin: '0 auto' }}>
        {datesByWeek.map((week) => (
          <div className={`block`}>
            {week.map((date) => {
              const isSameDay = date.isSame(selectedDate, 'day');

              return (
                <div
                  className={`cursor-pointer shadow ${gridSizing} ${gridTransition}`}
                  style={{
                    margin: '2px',
                    backgroundColor: isSameDay ? '#dcd6f7' : '#f4eeff',
                    outline: 'none',
                  }}
                  data-date={date}
                  onClick={gridClick}></div>
              );
            })}
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
