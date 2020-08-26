import React from 'react';

import moment from 'moment';

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

import hackernewsDaily from '../assets/hackernews_github.json';

const DATE_KEY_FORMAT = 'YYYY-MM-DD';

const CalendarGrid = ({
  selectedDate,
  setSelectedDate,
  minYear,
  maxYear,
  datesByWeek,
}) => {
  const lastYear = () => {
    if (selectedDate.year() > minYear) {
      setSelectedDate(selectedDate.clone().add(-1, 'years'));
    }
  };

  const nextYear = () => {
    if (selectedDate.year() < maxYear) {
      setSelectedDate(selectedDate.clone().add(1, 'years'));
    }
  };

  // change date on cell click
  const gridClick = (event) => {
    const date = moment(parseInt(event.target.dataset.date));

    setSelectedDate(date.clone());
  };

  // year toggler styles
  const yearToggleAesthetics = 'rounded p-2';
  const yearTogglePosition = 'inline align-middle';
  const yearToggleTransition = 'transition ease-in duration-200';
  const yearToggleStyle = `${yearToggleAesthetics} ${yearTogglePosition} ${yearToggleTransition}`;
  const yearToggleHover =
    'cursor-pointer hover:bg-gray-300 dark-hover:bg-gray-600';

  // grid styles
  const gridSizing = 'w-4 h-4 rounded';
  const gridTransition = 'transition ease-in duration-200';
  const gridDisabled = 'bg-transparent cursor-default';

  return (
    <div
      className="rounded-lg shadow-xl bg-white dark:bg-gray-800 text-xl"
      style={{ width: 'max-content', margin: '0 auto' }}>
      <div
        className="flex justify-center items-center pt-4 pb-2 dark:text-gray-200"
        style={{ width: 'max-content', margin: '0 auto' }}>
        <div
          className={`${yearToggleStyle} ${
            selectedDate.year() > minYear ? yearToggleHover : 'text-transparent'
          }`}
          onClick={lastYear}>
          <HiOutlineChevronLeft />
        </div>
        <div className="align-middle select-none mx-1 text-center shadow-inner py-1 px-2 rounded bg-gray-200 dark:bg-gray-700">
          {selectedDate.year()}
        </div>
        <div
          className={`${yearToggleStyle} ${
            selectedDate.year() < maxYear ? yearToggleHover : 'text-transparent'
          }`}
          onClick={nextYear}>
          <HiOutlineChevronRight />
        </div>
      </div>
      <div
        className="flex p-1"
        style={{ width: 'max-content', margin: '0 auto' }}>
        {datesByWeek.map((week, weekIndex) => (
          <div className={`block`} key={weekIndex}>
            {week.map((date, dateIndex) => {
              const isSameDay = date.isSame(selectedDate, 'day');

              const weekOfMonth =
                date.week() - moment(date).startOf('month').week() + 1;

              return (
                <div
                  className={`outer_grid relative`}
                  style={{ padding: '2px' }}
                  key={dateIndex}>
                  <div
                    className={`${
                      date.year() === selectedDate.year()
                        ? 'cursor-pointer bg-gray-400 dark:bg-gray-600'
                        : gridDisabled
                    } ${gridSizing} ${gridTransition}`}
                    style={{
                      backgroundColor: isSameDay && '#f25d9c',
                      opacity:
                        date.format(DATE_KEY_FORMAT) in hackernewsDaily
                          ? 1
                          : 0.4,
                    }}
                    data-date={date}
                    data-tip={
                      date.year() === selectedDate.year()
                        ? date.format('MMMM Do, YYYY')
                        : ''
                    }
                    onClick={
                      date.year() === selectedDate.year()
                        ? gridClick
                        : undefined
                    }></div>
                  {date.date() <= 7 &&
                  (date.week() !== 1 || date.year() > selectedDate.year()) ? (
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
  );
};

export default CalendarGrid;
