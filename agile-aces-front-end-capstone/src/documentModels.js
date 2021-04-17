export default classDoc => (title, description, dateFrom, dateTo, sun, mon, tues, wed, thurs, fri, sat, timeFrom, timeTo, location) => {
  const titleSearchArray = [''];
  const searchTitle = title.toLowerCase();
  for (let i = 0; i < searchTitle.length; i += 1) {
    for (let j = i + 1; j <= searchTitle.length; j += 1 ) {
      titleSearchArray.push(searchTitle.slice(i, j));
    }
  }
  
  return {
    description,
    dates: {
      dateFrom,
      dateTo,
    },
    days: {
      sun, mon, tues, wed, thurs, fri, sat,
    },
    times: {
      timeFrom,
      timeTo,
    },
    title,
    titleSearchArray,
    location,
  }
};
