import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { GlobalHotKeys } from 'react-hotkeys';
import ReactTooltip from 'react-tooltip';

import Styles from './CalendarGrid.module.css';

import { daysInYearByWeek } from '../utils';

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

import hackernewsDaily from '../assets/hackernews_github.json';

import Slide from './Slide';

import { useHistory, useParams } from 'react-router-dom';

const CalendarGrid = () => {
  let history = useHistory();
  let params = useParams();

  // year bounds
  const minYear = 2008;
  const maxYear = moment().year();

  let date = params.date;

  if (date) {
    date = moment(date, 'YYYY-MM-DD');
    if (!date.isValid()) {
      date = moment();
      history.push(`/before/${date.format('YYYY-MM-DD')}`);
    }
  } else {
    date = moment();
    history.push(`/before/${date.format('YYYY-MM-DD')}`);
  }

  // current date to display
  const [selectedDate, _setSelectedDate] = useState(date);

  // year to display
  const [selectedYear, setSelectedYear] = useState(selectedDate.year());

  // year incrementers
  const changeYear = (increment) => {
    let targetYear = selectedYear + increment;

    if (targetYear >= minYear && targetYear <= maxYear) {
      setSelectedYear(selectedYear + increment);
    }
  };

  const lastYear = () => {
    if (selectedYear > minYear) {
      setSelectedDate(selectedDate.clone().add(-1, 'years'));
      changeYear(-1);
    }
  };

  const nextYear = () => {
    if (selectedYear < maxYear) {
      setSelectedDate(selectedDate.clone().add(1, 'years'));
      changeYear(1);
    }
  };

  // dates for grid
  let datesByWeek = daysInYearByWeek(selectedYear);

  // grid bounds
  let earliestDate = datesByWeek[0][0];
  let latestDate = datesByWeek.slice(-1)[0].slice(-1)[0];

  // absolute grid bounds
  let absoluteEarliestDate = moment({ year: minYear - 1, month: 11, date: 31 });
  let absoluteLatestDate = moment({ year: maxYear + 1, month: 0, date: 1 });

  // use ref to for handlers and URL
  const selectedDateRef = React.useRef(selectedDate);
  const setSelectedDate = (date) => {
    selectedDateRef.current = date;
    _setSelectedDate(date);
    history.push(`/before/${date.format('YYYY-MM-DD')}`);
  };

  // change date on cell click
  const gridClick = (event) => {
    const date = moment(parseInt(event.target.dataset.date));

    setSelectedDate(date.clone());
  };

  // general date incrementer
  const incrementDay = (increment) => {
    let targetDate = selectedDateRef.current.clone();

    targetDate.add(increment, 'days');

    if (
      targetDate.isAfter(absoluteEarliestDate) &&
      targetDate.isBefore(absoluteLatestDate)
    ) {
      setSelectedYear(targetDate.year());
      setSelectedDate(targetDate);
    }
  };

  // date increments for keys
  const tomorrow = () => {
    incrementDay(1);
  };

  const nextWeek = () => {
    incrementDay(7);
  };

  const yesterday = () => {
    incrementDay(-1);
  };

  const prevWeek = () => {
    incrementDay(-7);
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

  // grid styles
  const gridSizing = 'w-4 h-4 rounded';
  const gridTransition = 'transition ease-in duration-200';
  const gridDisabled = 'bg-transparent cursor-default';

  // key styles
  const keyAesthetics =
    'inline text-center font-mono rounded pt-1 pb-1 px-2 shadow-sm text-xs bg-gray-400 dark:bg-gray-800';
  const keyStyle = { width: 'max-content' };

  // year toggler styles
  const yearToggleAesthetics = 'rounded p-2';
  const yearTogglePosition = 'inline align-middle';
  const yearToggleTransition = 'transition ease-in duration-200';
  const yearToggleStyle = `${yearToggleAesthetics} ${yearTogglePosition} ${yearToggleTransition}`;
  const yearToggleHover =
    'cursor-pointer hover:bg-gray-300 dark-hover:bg-gray-600';

  // general link hover style
  const linkHover = `hover:text-blue-600 dark-hover:text-orange-500`;

  // fetch repos for selected date
  const dateKey = selectedDate.format('YYYY-MM-DD').toString();
  const selectedHackernews = hackernewsDaily[selectedDate.format('YYYY-MM-DD')];

  return (
    <div className="min-h-full">
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

      <div className="text-center text-gray-800 dark:text-gray-300 pb-4">
        Pro tip: use&nbsp;
        <div className={`${keyAesthetics}`} style={keyStyle}>
          W
        </div>
        , &nbsp;
        <div className={`${keyAesthetics}`} style={keyStyle}>
          A
        </div>
        , &nbsp;
        <div className={`${keyAesthetics}`} style={keyStyle}>
          S
        </div>
        , and{' '}
        <div className={`${keyAesthetics}`} style={keyStyle}>
          D
        </div>{' '}
        to navigate the grid.
      </div>

      <div
        className="rounded-lg shadow-xl bg-white dark:bg-gray-800 text-xl"
        style={{ width: 'max-content', margin: '0 auto' }}>
        <div
          className="flex justify-center items-center pt-4 pb-2 dark:text-gray-200"
          style={{ width: 'max-content', margin: '0 auto' }}>
          <div
            className={`${yearToggleStyle} ${
              selectedYear > minYear ? yearToggleHover : 'text-transparent'
            }`}
            onClick={lastYear}>
            <HiOutlineChevronLeft />
          </div>
          <div className="align-middle select-none mx-1 text-center shadow-inner py-1 px-2 rounded bg-gray-200 dark:bg-gray-700">
            {selectedYear}
          </div>
          <div
            className={`${yearToggleStyle} ${
              selectedYear < maxYear ? yearToggleHover : 'text-transparent'
            }`}
            onClick={nextYear}>
            <HiOutlineChevronRight />
          </div>
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
                      className={`${
                        date.year() === selectedYear
                          ? 'cursor-pointer bg-gray-400 dark:bg-gray-600'
                          : gridDisabled
                      } ${gridSizing} ${gridTransition}`}
                      style={{
                        backgroundColor: isSameDay && '#f25d9c',
                        opacity:
                          date.format('YYYY-MM-DD') in hackernewsDaily
                            ? 1
                            : 0.4,
                      }}
                      data-date={date}
                      data-tip={
                        date.year() === selectedYear
                          ? date.format('MMMM Do, YYYY')
                          : ''
                      }
                      onClick={date.year() === selectedYear && gridClick}></div>
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

      <Slide
        selectedDate={selectedDate}
        absoluteEarliestDate={absoluteEarliestDate}
        absoluteLatestDate={absoluteLatestDate}
        yesterday={yesterday}
        tomorrow={tomorrow}
        selectedRepos={selectedHackernews}
      />
    </div>
  );
};

export default CalendarGrid;
