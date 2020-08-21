import React from 'react';
import moment from 'moment';

function CalendarGrid() {
  var enumerateDaysBetweenDates = function (startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(currDate.clone());
    }

    return dates;
  };

  const DATE_FORMAT = 'YYYYMMDD';

  var startDate = moment('20130101', DATE_FORMAT);
  var endDate = moment('20140101', DATE_FORMAT);

  var dates = enumerateDaysBetweenDates(startDate, endDate);

  var datesByWeek = [];

  var week_ = 1;
  var week_group = [];

  for (const date of dates) {
    if (week_ !== date.week()) {
      datesByWeek.push(week_group);
      week_group = [];
      week_ = date.week();
    }

    week_group.push(date);
  }

  if(week_group.length > 0){
    datesByWeek.push(week_group);
  }

  var firstWeek = datesByWeek[0]

  while(firstWeek.length < 7){
    firstWeek.unshift(firstWeek[0].clone().add(-1,'days'))
  }

  var lastWeek = datesByWeek.slice(-1)[0] 

  while(lastWeek.length < 7){
    lastWeek.push(lastWeek.slice(-1)[0].clone().add(1,'days'))
  }

  return (
    <div className="flex p-2 bg-gray-200 rounded-lg shadow-inner" style={{width:"max-content",margin:"0 auto"}}>
      {datesByWeek.map((week) => (
        <div className={`block`}>
          {week.map((date) => (
            <div
              className={`block bg-green-500 w-4 h-4 rounded text-xs`}
              style={{ margin: '2px' }}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CalendarGrid;
