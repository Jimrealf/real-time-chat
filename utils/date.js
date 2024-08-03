// Function to format the current date and time in 'YYYY-MM-DD HH:mm:ss'
const formatDate = (date) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    };
    return new Intl.DateTimeFormat('en-GB', options)
        .format(date)
        .replace(',', '');
};

module.exports = {
    formatDate,
};
