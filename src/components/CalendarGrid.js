import React, { useState } from 'react';
import moment from 'moment';
import { GlobalHotKeys } from 'react-hotkeys';
import ReactTooltip from 'react-tooltip';

import Styles from './CalendarGrid.module.css';

import {daysInYearByWeek} from '../utils'

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

import hackernews_daily from '../assets/hackernews_github.json';

function CalendarGrid() {


  const minYear = 2008;
  const maxYear = moment().year();
  
  const [selectedYear, setSelectedYear] = useState(maxYear);

  let datesByWeek = daysInYearByWeek(selectedYear);

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

  const keyAesthetics =
    'rounded py-1 px-2 text-xs shadow-sm bg-gray-400 dark:bg-gray-800';

  const yearToggleAesthetics =
    'rounded hover:bg-gray-300 dark-hover:bg-gray-600';
  const yearTogglePosition = 'inline cursor-pointer align-middle';
  const yearToggleTransition = 'transition ease-in duration-200';
  const yearToggleStyle = `${yearToggleAesthetics} ${yearTogglePosition} ${yearToggleTransition}`;

  const changeYear = (increment) => {
    let targetYear = selectedYear + increment;

    if (targetYear >= minYear && targetYear <= maxYear) {
      setSelectedYear(selectedYear + increment);
    }
  };

  let earliestDate = datesByWeek[0][0];
  let latestDate = datesByWeek.slice(-1)[0].slice(-1)[0];

  if (earliestDate.isAfter(selectedDate)) {
    setSelectedDate(earliestDate);
  }

  if (latestDate.isBefore(selectedDate)) {
    setSelectedDate(latestDate);
  }
  
  const dateKey = selectedDate.format("YYYY-MM-DD").toString()

  console.log(hackernews_daily[dateKey])

  return (
    <div className="bg-gray-200 dark:bg-gray-700 min-h-full">
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        style={{ outline: 'none' }}
      />
      <ReactTooltip
        effect="solid"
        className={`shadow ${Styles.tooltip}`}
        offset={{ top: -6 }}
      />

      <div
        className="rounded-lg shadow-xl bg-white dark:bg-gray-800"
        style={{ width: 'max-content', margin: '0 auto' }}>
        <div
          className="pt-1 text-xl leading-10 dark:text-gray-200"
          style={{ width: 'max-content', margin: '0 auto' }}>
          <HiOutlineChevronLeft
            className={`${selectedYear > minYear ? yearToggleStyle : 'inline text-transparent'}`}
            onClick={() => {
              if (selectedYear > minYear){
                changeYear(-1);
              }
            }}
          />
          <div className="inline align-middle mx-1 select-none">
            {selectedYear}
          </div>
          <HiOutlineChevronRight
            className={`${selectedYear < maxYear ? yearToggleStyle : 'inline text-transparent'}`}
            onClick={() => {
              if (selectedYear < maxYear){
                changeYear(1);
              }
            }}
          />
        </div>
        <div
          className="flex p-1"
          style={{ width: 'max-content', margin: '0 auto' }}>
          {datesByWeek.map((week, weekIndex) => (
            <div className={`block`}>
              {week.map((date, dateIndex) => {
                const isSameDay = date.isSame(selectedDate, 'day');

                const weekOfMonth =
                  date.week() - moment(date).startOf('month').week() + 1;

                return (
                  <div
                    className={`outer_grid relative`}
                    style={{ padding: '2px' }}>
                    <div
                      className={`cursor-pointer bg-gray-400 dark:bg-gray-600 ${gridSizing} ${gridTransition}`}
                      style={{
                        backgroundColor: isSameDay && '#f25d9c',
                      }}
                      data-date={date}
                      data-tip={date.format('MMMM Do, YYYY')}
                      onClick={gridClick}></div>
                    {date.date() <= 7 &&
                    (date.week() !== 1 || date.year() > selectedYear) ? (
                      <div
                        className={`bg-blue-400 dark:bg-orange-400 h-full inset-0`}
                        style={{
                          top: weekOfMonth === 1 ? '-1px' : '1px',
                          position: 'absolute',
                          width: '2px',
                          marginLeft: '-1px',
                        }}></div>
                    ) : (
                      ''
                    )}
                    {date.date() === 1 &&
                    date.day() !== 0 &&
                    !(weekIndex === 0 && dateIndex === 0) ? (
                      <div
                        className={`bg-blue-400 dark:bg-orange-400 w-full inset-0`}
                        style={{
                          position: 'absolute',
                          height: '2px',
                          marginTop: '-1px',
                        }}></div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center w-screen pt-12 pb-12">
        <div
          className={`text-center w-11/12 max-w-screen-md ${slideAesthetics} ${slidePositioning} ${slideDark} ${slideTransition}`}>
          <div>{hackernews_daily[selectedDate.format("YYYY-MM-DD")].toString()}</div>
        </div>
      </div>

      <div className="text-center text-gray-800 dark:text-gray-300 py-4">
        Pro tip: use <span className={`${keyAesthetics}`}>W</span> and{' '}
        <span className={`${keyAesthetics}`}>S</span> to shift by day, and{' '}
        <span className={`${keyAesthetics}`}>A</span> and{' '}
        <span className={`${keyAesthetics}`}>D</span> to shift by week.
      </div>
    </div>
  );
}

export default CalendarGrid;
