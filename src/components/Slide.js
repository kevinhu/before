import React from 'react';

import moment from 'moment';

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { FaHackerNewsSquare } from 'react-icons/fa';

import NoRepos from '../assets/cat-in-space.svg';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Slide = ({
	selectedDate,
	setSelectedDate,
	absoluteEarliestDate,
	absoluteLatestDate,
	yesterday,
	tomorrow,
	selectedRepos,
}) => {
	// slide styles
	const slideAesthetics = 'shadow-2xl bg-white rounded-lg px-8 py-6';
	const slideDark = 'dark:bg-gray-800 dark:text-gray-200';
	const slideTransition = 'transition ease-in duration-150';
	const slideSizing = 'sm:w-3/4 md:w-3/4 lg:w-3/4';

	// day toggler styles
	const dayToggleAesthetics = 'rounded p-2';
	const dayTogglePosition = 'align-middle';
	const dayToggleTransition = 'transition ease-in duration-200';
	const dayToggleStyle = `${dayToggleAesthetics} ${dayTogglePosition} ${dayToggleTransition}`;
	const dayToggleHover =
		'cursor-pointer hover:bg-gray-300 dark-hover:bg-gray-600';

	// general link hover style
	const linkHover = `hover:text-blue-600 dark-hover:text-orange-500`;

	// date selector styles
	const dateSelectorTransition = 'transition ease-in duration-150';
	const dateSelectorAesthetics =
		'cursor-pointer select-none rounded text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700';
	const dateSelectorPosition = 'mx-1 py-1 px-2 text-center align-middle';
	const dateSelectorHover =
		'hover:shadow hover:bg-gray-300 dark-hover:bg-gray-600';

	const DateSelector = ({ value, onClick }) => (
		<div
			className={`${dateSelectorTransition} ${dateSelectorAesthetics} ${dateSelectorPosition} ${dateSelectorHover}`}
			style={{ width: 'max-content' }}
			onClick={onClick}>
			{moment(value).format('MMMM Do, YYYY')}
		</div>
	);

	return (
		<div className="flex items-center justify-center w-screen pt-12 pb-12">
			<div
				className={`max-w-screen-md ${slideAesthetics} ${slideDark} ${slideTransition} ${slideSizing}`}>
				<div className="flex justify-center items-center text-lg pb-3">
					<div
						className={`${dayToggleStyle} ${
							moment(selectedDate).add(-1, 'days').isAfter(absoluteEarliestDate)
								? dayToggleHover
								: 'text-transparent'
						}`}
						style={{ width: 'max-content', height: 'max-content' }}
						onClick={yesterday}>
						<HiOutlineChevronLeft />
					</div>
					<DatePicker
						selected={selectedDate.toDate()}
						onChange={(date) => setSelectedDate(moment(date))}
						peekNextMonth
						showMonthDropdown
						showYearDropdown
						dropdownMode="select"
						minDate={absoluteEarliestDate.clone().add(1, 'day').toDate()}
						maxDate={absoluteLatestDate.clone().add(-1, 'day').toDate()}
						customInput={<DateSelector />}
						popperPlacement="bottom-center"
					/>
					<div
						className={`${dayToggleStyle} ${
							moment(selectedDate).add(1, 'days').isBefore(absoluteLatestDate)
								? dayToggleHover
								: 'text-transparent'
						}`}
						style={{ width: 'max-content', height: 'max-content' }}
						onClick={tomorrow}>
						<HiOutlineChevronRight />
					</div>
				</div>
				<div>
					{selectedRepos ? (
						selectedRepos.map((repo, index) => {
							return (
								<div className="flex py-2" key={index}>
									<div className="w-1/12 select-none">{repo.daily_rank}</div>
									<div className="w-5/6 mr-3">
										<a
											className={`${linkHover}`}
											href={repo.url}
											target="_blank"
											rel="noopener noreferrer">
											{repo.title}
										</a>
									</div>
									<div className="w-1/12 mx-auto text-xl">
										<a
											className={`w-1/4 ${linkHover}`}
											href={`https://news.ycombinator.com/item?id=${repo.objectID}`}
											target="_blank"
											rel="noopener noreferrer">
											<div
												className="rounded border-solid border-2 border-gray-400 h-auto flex"
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
	);
};

export default Slide;
