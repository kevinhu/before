import React, { useState, useEffect } from 'react';
import moment from 'moment';
import chroma from 'chroma-js';
import { GlobalHotKeys } from 'react-hotkeys';
import ReactTooltip from 'react-tooltip';

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

  const [selectedDate, _setSelectedDate] = useState(datesByWeek[0][0]);

  const selectedDateRef = React.useRef(selectedDate);
  const setSelectedDate = (data) => {
    selectedDateRef.current = data;
    _setSelectedDate(data);
  };

  const gridClick = (event) => {
    const date = moment(parseInt(event.target.dataset.date));

    setSelectedDate(date.clone());
  };

  const gridSizing = 'w-4 h-4 rounded';
  const gridTransition = 'transition ease-in duration-200';

  const monthColors = new Array(12).fill(['bg-teal-300', 'bg-indigo-300']).flat();
  const darkMonthColors = new Array(12).fill(['bg-teal-600', 'bg-indigo-600']).flat();

  const tomorrow = () => {
    let currentDate = selectedDateRef.current.clone();

    currentDate.add(1, 'days');
    setSelectedDate(currentDate);
  };

  const nextWeek = () => {
    let currentDate = selectedDateRef.current.clone();

    currentDate.add(7, 'days');
    setSelectedDate(currentDate);
  };

  const yesterday = () => {
    let currentDate = selectedDateRef.current.clone();

    currentDate.add(-1, 'days');
    setSelectedDate(currentDate);
  };

  const prevWeek = () => {
    let currentDate = selectedDateRef.current.clone();

    currentDate.add(-7, 'days');
    setSelectedDate(currentDate);
  };

  const keyMap = {
    TOMORROW: ['s'],
    YESTERDAY: ['w'],
    NEXT_WEEK: ['d'],
    LAST_WEEK: ['a'],
  };

  const handlers = {
    TOMORROW: tomorrow,
    YESTERDAY: yesterday,
    NEXT_WEEK: nextWeek,
    LAST_WEEK: prevWeek,
  };

  const slidePositioning =
    'relative flex align-center justify-center origin-center';
  const slideAesthetics = 'shadow-2xl bg-white rounded-lg py-48';
  const slideDark = 'dark:bg-gray-800 dark:text-white';
  const slideTransition = 'transition ease-in duration-200';

  const keyAesthetics = 'rounded py-1 px-2 text-xs shadow-sm bg-gray-400 dark:bg-gray-800'

  return (
    <div className="bg-gray-200 dark:bg-gray-700 min-h-full">
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        style={{ outline: 'none' }}
      />
      <ReactTooltip effect="solid"/>

      <div
        className="flex p-2 rounded-lg shadow-xl bg-white dark:bg-gray-800"
        style={{ width: 'max-content', margin: '0 auto' }}>
        {datesByWeek.map((week) => (
          <div className={`block`}>
            {week.map((date) => {
              const isSameDay = date.isSame(selectedDate, 'day');

              return (
                <div
                  className={`cursor-pointer ${gridSizing} ${gridTransition} ${monthColors[date.month()]} dark:${darkMonthColors[date.month()]}`}
                  style={{
                    margin: '2px',
                    backgroundColor: isSameDay
                      && '#f25d9c'
                  }}
                  data-date={date}
                  data-tip={date.format("MMMM Do, YYYY")}
                  onClick={gridClick}></div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center w-screen pt-12 pb-12">
        <div
          className={`text-center w-11/12 max-w-screen-md ${slideAesthetics} ${slidePositioning} ${slideDark} ${slideTransition}`}>
          <div>Top pages on {selectedDate && selectedDate.format('L')} </div>
        </div>
      </div>

      <div className="text-center text-gray-800 dark:text-gray-300">
      Pro tip: use <span className={`${keyAesthetics}`}>W</span> and <span className={`${keyAesthetics}`}>S</span> to shift by day, and <span className={`${keyAesthetics}`}>A</span> and <span className={`${keyAesthetics}`}>D</span> to shift by week.
      </div>
    </div>
  );
}

export default CalendarGrid;
