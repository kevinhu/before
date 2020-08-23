import React, { useState } from 'react';
import moment from 'moment';
import { GlobalHotKeys } from 'react-hotkeys';
import ReactTooltip from 'react-tooltip';

import Styles from './CalendarGrid.module.css';

import { daysInYearByWeek } from '../utils';

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { FaHackerNewsSquare, FaRedditSquare } from 'react-icons/fa';

import hackernewsDaily from '../assets/hackernews_github.json';

import NoRepos from '../assets/cat-in-space.svg';
import HackernewsIcon from '../assets/hackernews_icon.svg';

function CalendarGrid() {
  const minYear = 2008;
  const maxYear = moment().year();

  const [selectedYear, setSelectedYear] = useState(maxYear);

  let datesByWeek = daysInYearByWeek(selectedYear);

  let earliestDate = datesByWeek[0][0];
  let latestDate = datesByWeek.slice(-1)[0].slice(-1)[0];

  let absoluteEarliestDate = moment({ year: minYear, month: 0, date: 1 })
    .startOf('week')
    .add(-1, 'days');
  let absoluteLatestDate = moment({ year: maxYear, month: 11, date: 31 }).endOf(
    'week',
  );

  console.log(absoluteLatestDate);

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

  const incrementDay = (increment) => {
    let targetDate = selectedDateRef.current.clone();

    targetDate.add(increment, 'days');

    if (
      targetDate.isAfter(absoluteEarliestDate) &&
      targetDate.isBefore(absoluteLatestDate)
    ) {
      setSelectedDate(targetDate);
    }
  };

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

  const slideAesthetics = 'shadow-2xl bg-white rounded-lg px-8 py-8';
  const slideDark = 'dark:bg-gray-800 dark:text-white';
  const slideTransition = 'transition ease-in duration-200';
  const slideSizing = 'sm:w-3/4 md:w-3/4 lg:w-3/4';

  const keyAesthetics =
    'rounded py-1 px-2 text-xs shadow-sm bg-gray-400 dark:bg-gray-800';

  const yearToggleAesthetics =
    'rounded hover:bg-gray-300 dark-hover:bg-gray-600';
  const yearTogglePosition = 'inline cursor-pointer align-middle';
  const yearToggleTransition = 'transition ease-in duration-200';
  const yearToggleStyle = `${yearToggleAesthetics} ${yearTogglePosition} ${yearToggleTransition}`;

  const dayToggleAesthetics =
    'rounded hover:bg-gray-300 dark-hover:bg-gray-600';
  const dayTogglePosition = 'inline cursor-pointer align-middle';
  const dayToggleTransition = 'transition ease-in duration-200';
  const dayToggleStyle = `${dayToggleAesthetics} ${dayTogglePosition} ${dayToggleTransition}`;

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

  const changeYear = (increment) => {
    let targetYear = selectedYear + increment;

    if (targetYear >= minYear && targetYear <= maxYear) {
      setSelectedYear(selectedYear + increment);
    }
  };

  if (earliestDate.isAfter(selectedDate)) {
    changeYear(-1);
  }

  if (latestDate.isBefore(selectedDate)) {
    changeYear(1);
  }

  const dateKey = selectedDate.format('YYYY-MM-DD').toString();

  const selectedHackernews = hackernewsDaily[selectedDate.format('YYYY-MM-DD')];

  const linkHover = `hover:text-blue-600 dark-hover:text-orange-500`;

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

      <div className="text-center text-gray-800 dark:text-gray-300 pb-4">
        Pro tip: use&nbsp;<span className={`${keyAesthetics}`}>W</span>, &nbsp;
        <span className={`${keyAesthetics}`}>A</span>, &nbsp;
        <span className={`${keyAesthetics}`}>S</span>, and{' '}
        <span className={`${keyAesthetics}`}>D</span> to navigate the grid.
      </div>

      <div
        className="rounded-lg shadow-xl bg-white dark:bg-gray-800"
        style={{ width: 'max-content', margin: '0 auto' }}>
        <div
          className="pt-1 text-xl leading-10 dark:text-gray-200"
          style={{ width: 'max-content', margin: '0 auto' }}>
          <HiOutlineChevronLeft
            className={`${
              selectedYear > minYear
                ? yearToggleStyle
                : 'inline text-transparent'
            }`}
            onClick={lastYear}
          />
          <div className="inline align-middle mx-1 select-none">
            {selectedYear}
          </div>
          <HiOutlineChevronRight
            className={`${
              selectedYear < maxYear
                ? yearToggleStyle
                : 'inline text-transparent'
            }`}
            onClick={nextYear}
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
                        opacity:
                          date.format('YYYY-MM-DD') in hackernewsDaily
                            ? 1
                            : 0.4,
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
          className={`max-w-screen-md ${slideAesthetics} ${slideDark} ${slideTransition} ${slideSizing}`}>
          <div className="inline mx-auto text-center text-lg ">
            <div>
              <HiOutlineChevronLeft
                className={`${
                  selectedYear > minYear
                    ? dayToggleStyle
                    : 'inline text-transparent'
                }`}
                onClick={yesterday}
              />
              <div
                className="align-middle select-none inline mx-1 mb-4 text-center shadow-inner py-1 px-2 rounded bg-gray-100 dark:bg-gray-700"
                style={{ width: 'max-content' }}>
                {selectedDate.format('MMMM Do, YYYY')}
              </div>
              <HiOutlineChevronRight
                className={`${
                  selectedYear > minYear
                    ? dayToggleStyle
                    : 'inline text-transparent'
                }`}
                onClick={tomorrow}
              />
            </div>
          </div>
          <div>
            {selectedHackernews ? (
              selectedHackernews.map((repo, index) => {
                return (
                  <div className="flex py-2">
                    <div className="w-1/12 select-none">{repo.daily_rank}</div>
                    <div className="w-5/6 mr-3">
                      <a
                        className={`${linkHover}`}
                        href={repo.url}
                        target="_blank">
                        {repo.title}
                      </a>
                    </div>
                    <div className="w-1/12 mx-auto text-xl">
                      <a
                        className={`w-1/4 ${linkHover}`}
                        href={`https://news.ycombinator.com/item?id=${repo.objectID}`}
                        target="_blank">
                        <div
                          className="rounded border-solid border-2 border-gray-500 h-auto flex"
                          style={{ width: 'fit-content' }}>
                          <FaHackerNewsSquare />
                          <div className="text-sm px-1">{repo.points}</div>
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center w-full">
                <img
                  alt="No repos found."
                  className="py-2 w-1/2 m-auto select-none"
                  src={NoRepos}></img>
                <div className="select-none">No repos found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarGrid;
