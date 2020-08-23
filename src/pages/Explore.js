import React from 'react';

import CalendarGrid from '../components/CalendarGrid';
import { useDarkMode } from '../components/DarkMode';

function Explore() {
	const [theme, toggleTheme, componentMounted] = useDarkMode();
	return (
		<div className="pt-15 min-h-full">
			<CalendarGrid />
		</div>
	);
}

export default Explore;