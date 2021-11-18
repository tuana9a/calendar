var $miniCalendar = document.getElementById("miniCalendar");
var $mainCalendar = document.getElementById("mainCalendar");
var $thisMonth = document.getElementById("this-month");
var $backwardMonth = document.getElementById("backward-month");
var $forwardMonth = document.getElementById("forward-month");

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth();
var changeMonth = currentMonth;
var changeYear = currentYear;
var calendarize = new Calendarize();
calendarize.buildMonthCalendar($miniCalendar, currentMonth, currentYear);



$thisMonth.addEventListener("click", () => {
	while ($miniCalendar.firstChild) {
		$miniCalendar.removeChild($miniCalendar.lastChild);
	}
	changeMonth = currentMonth;
	changeYear = currentYear
	calendarize.buildMonthCalendar($miniCalendar, changeMonth, changeYear);
});

$backwardMonth.addEventListener("click", () => {
	while ($miniCalendar.firstChild) {
		$miniCalendar.removeChild($miniCalendar.lastChild);
	}
	changeMonth -= 1;
	if(changeMonth == -1) {
		changeMonth = 11;
		changeYear -= 1;
	}
	calendarize.buildMonthCalendar($miniCalendar, changeMonth, changeYear);
});

$forwardMonth.addEventListener("click", () => {
	while ($miniCalendar.firstChild) {
		$miniCalendar.removeChild($miniCalendar.lastChild);
	}
	changeMonth += 1;
	if(changeMonth == 12) {
		changeMonth = 0;
		changeYear += 1;
	}
	calendarize.buildMonthCalendar($miniCalendar, changeMonth, changeYear);
});

function Calendarize() {
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	return {

		// Return the days in a month - given a year and the month number
		getDaysInMonth: function(month, year) {
			var date = new Date(year, month, 1);
			var days = [];
			while (date.getMonth() === month) {
				days.push(new Date(date));
				date.setDate(date.getDate() + 1);
			}
			return days;
		},

		// return an array of the first day of each month for a given year
		getMonthsInYear: function(year) {
			var date = new Date(year, 0, 1);
			var months = [];
			var monthCount = 0;
			while (monthCount < 12) {
				months.push(new Date(date));
				date.setMonth(date.getMonth() + 1);
				monthCount++;
			}
			return months;
		},

		// Create only 1 month calendar
		buildMonthCalendar: function(el, month, year) {
			var _this = this;
			var months = _this.getMonthsInYear(year);

			var opts = {
				showMonth: true,
				showDaysOfWeek: true,
				showYear: true,
				clickHandler: function(e) {
					var day = e.target.getAttribute("data-date");
					//alert(day);
				}
			};

			
			var $monthNode = _this.buildMonth(month, year, opts);
			el.appendChild($monthNode);
		},

		// Add days and place fillers for a given month
		// This function and the one above needs consolidated
		buildMonth: function(monthNum, year, opts) {
			//if (monthNum === undefined || year === undefined) return "something is missing";
			var _this = this;
			var dtm = new Date(year, monthNum, 1);
			var dtmMonth = dtm.getMonth();
			var prevM = new Date(dtm.setMonth(dtmMonth - 1));
			var nextM = new Date(dtm.setMonth(dtmMonth + 1));
			var daysInMonth = _this.getDaysInMonth(monthNum, year);
			var daysPrevMonth = _this.getDaysInMonth(prevM.getMonth(), prevM.getFullYear());
			var daysNextMonth = _this.getDaysInMonth(nextM.getMonth(), nextM.getFullYear());
			var $monthNode = document.createElement('div');
			var $titleNode = document.createElement('h4');
			var skipLength = daysInMonth[0].getDay();
			var preLength = daysInMonth.length + skipLength;
			var postLength = function() {
				if (preLength % 7 === 0) {
					return 0;
				} else {
					if (preLength < 35) {
						return 35 - preLength;
					} else {
						return 42 - preLength;
					}
				}
			}

			var $mainDay = document.getElementsByClassName("taskCell");
			let countMainDay = 0;

			$monthNode.classList.add('month');

			// Add a Title to the month
			if (opts.showMonth) {
				$titleNode.innerText = monthNames[monthNum] + (opts.showYear ? " " + year : '');
				$monthNode.appendChild($titleNode);
			}


			// Add Days of week to the top row
			if (opts.showDaysOfWeek) {
				dayNames.forEach(function(a, b) {
					var $dayNode = document.createElement('div');
					$dayNode.classList.add('dow');
					$dayNode.innerText = dayNames[b];
					$monthNode.appendChild($dayNode);
				});
			}


			// Add blank days to fill in before first day
			for (var i = 0; i < skipLength; i++) {
				var $dayNode = document.createElement('div');
				$dayNode.classList.add('dummy-day');
				$dayNode.innerText = daysPrevMonth.length - (skipLength - (i + 1));
				$monthNode.appendChild($dayNode);
				$mainDay[countMainDay].innerText = "";
				$mainDay[countMainDay].style.color = "";
				$mainDay[countMainDay].innerText = daysPrevMonth.length - (skipLength - (i + 1));
				countMainDay += 1;
			}


			// Place a day for each day of the month
			daysInMonth.forEach(function(c, d) {
				var today = new Date(new Date().setHours(0, 0, 0, 0));
				var $dayNode = document.createElement('div');
				$dayNode.classList.add('day');
				$dayNode.setAttribute("data-date", c);
				$dayNode.innerText = (d + 1);
				$mainDay[countMainDay].style.color = "";
				$mainDay[countMainDay].innerText = "";
				$mainDay[countMainDay].innerText = (d + 1);
				$mainDay[countMainDay].style.color = "blue";
				countMainDay += 1;
		
				var dow = new Date(c).getDay();
				var dateParsed = Date.parse(c);
				var todayParsed = Date.parse(today);

				if (dateParsed === todayParsed) $dayNode.classList.add('today');
				if (dateParsed > todayParsed) $dayNode.classList.add('future');
				if (dateParsed <todayParsed) $dayNode.classList.add('past');

				if (dow === 0 || dow === 6) $dayNode.classList.add('weekend');
				if (opts.onlyCurrent && c < today) $dayNode.classList.add('dummy-day');
				if (opts.limitDate) {
					if (c > opts.limitDate) {
						$dayNode.classList.add('dummy-day');
					}
				}

				if (opts.filterDayOfWeek) {
					var valid = false;
					for (var i = 0; i < opts.filterDayOfWeek.length; i++) {
						if (c.getDay() == opts.filterDayOfWeek[i]) {
							valid = true;
						}
					}
					if (!valid) {
						$dayNode.classList.add('dummy-day');
					}
				}
				if (opts.clickHandler && !$dayNode.classList.contains('dummy-day')) {
					function handleEvent(e) {
						e = e || window.event;
						e.preventDefault();
						e.stopPropagation();
						var touches = false;
						if (!touches) {
							touches = true;
							setTimeout(function() {
								touches = false;
							}, 300);
							opts.clickHandler(e);
						}
					}
					$dayNode.addEventListener("touchstart", handleEvent);
					$dayNode.addEventListener("mousedown", handleEvent);
				}
				$monthNode.appendChild($dayNode);
				
				
			});

			// Add in the dummy filler days to make an even block
			for (var j = 0; j < postLength(); j++) {
				var $dayNode = document.createElement('div');
				$dayNode.classList.add('dummy-day');
				$dayNode.innerText = j + 1;
				$monthNode.appendChild($dayNode);
				$mainDay[countMainDay].style.color = "";
				$mainDay[countMainDay].innerText = "";
				$mainDay[countMainDay].innerText = j + 1;
				countMainDay += 1;
			}

			if(countMainDay == 35) {
				for(let i = 0; i < 7; i++) {
					$mainDay[countMainDay + i].style.color = "";
					$mainDay[countMainDay + i].innerText = "";
				}
			}

			return $monthNode;
		}
	}
}