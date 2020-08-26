import React, { useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import ReactTooltip from 'react-tooltip';

import { daysInYearByWeek } from '../utils';

import moment from 'moment';

import Slide from '../components/Slide';
import CalendarGrid from '../components/CalendarGrid';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';

import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import hackernewsDaily from '../assets/hackernews_github.json';

const DATE_KEY_FORMAT = 'YYYY-MM-DD';

function Explore() {
	// get screen dimensions
	const { width } = useWindowDimensions();

	// if the calendar grid is too wide for the screen
	var tooNarrow = width < 1080;

	// initialize url params
	let history = useHistory();
	let location = useLocation();
	let params = queryString.parse(location.search);

	// year bounds
	const minYear = 2008;
	const maxYear = moment().year();

	let date = params.date;

	if (date) {
		date = moment(date, DATE_KEY_FORMAT);
		if (!date.isValid()) {
			date = moment();
			history.push(`?date=${date.format(DATE_KEY_FORMAT)}`);
		}
	} else {
		date = moment();
		history.push(`?date=${date.format(DATE_KEY_FORMAT)}`);
	}

	// current date to display
	const [selectedDate, _setSelectedDate] = useState(date);

	// year to display
	const [selectedYear, setSelectedYear] = useState(selectedDate.year());

	// dates for grid
	let datesByWeek = daysInYearByWeek(selectedYear);

	// absolute grid bounds
	let absoluteEarliestDate = moment({ year: minYear - 1, month: 11, date: 31 });
	let absoluteLatestDate = moment({ year: maxYear + 1, month: 0, date: 1 });

	// use ref to for handlers and URL
	const selectedDateRef = React.useRef(selectedDate);
	const setSelectedDate = (date) => {
		selectedDateRef.current = date;
		_setSelectedDate(date);
		history.push(`?date=${date.format(DATE_KEY_FORMAT)}`);
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

	// key styles
	const keyAesthetics =
		'inline text-center font-mono rounded pt-1 pb-1 px-2 shadow-sm text-xs bg-gray-400 dark:bg-gray-800';
	const keyStyle = { width: 'max-content' };

	// fetch repos for selected date
	const dateKey = selectedDate.format(DATE_KEY_FORMAT);
	const selectedHackernews = hackernewsDaily[dateKey];

	return (
		<div className="min-h-full">
			<div className="min-h-full">
				<div
					className="p-2 text-center text-gray-800 dark:text-gray-300 mx-auto max-w-full"
					style={{ width: 'max-content' }}>
					Daily trending GitHub repositories from Hacker News on every
					day since 2008. Updated monthly.
				</div>
				<GlobalHotKeys
					keyMap={keyMap}
					handlers={handlers}
					style={{ outline: 'none' }}
				/>
				<ReactTooltip
					effect="solid"
					className={`shadow`}
					style={{ padding: '0.15rem 0.25rem' }}
					offset={{ top: -6 }}
				/>

				{!tooNarrow && (
					<React.Fragment>
						<div className="text-center text-gray-700 dark:text-gray-400 pb-6 pt-2">
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
						<CalendarGrid
							selectedYear={selectedYear}
							setSelectedYear={setSelectedYear}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
							minYear={minYear}
							maxYear={maxYear}
							datesByWeek={datesByWeek}
						/>
					</React.Fragment>
				)}

				<Slide
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					absoluteEarliestDate={absoluteEarliestDate}
					absoluteLatestDate={absoluteLatestDate}
					yesterday={yesterday}
					tomorrow={tomorrow}
					selectedRepos={selectedHackernews}
				/>
			</div>
		</div>
	);
}

export default Explore;
