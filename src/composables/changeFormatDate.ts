export const changeFormatDate = (date: string) => {
    // YYYYMMDD to 1 Jan 2025
    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10) - 1; // Months are 0-based in JS
    const day = parseInt(date.substring(6, 8), 10);

    const newDate = new Date(year, month, day);
    const formattedDate = `${day} ${newDate.toLocaleString('en-US', { month: 'short' })} ${year}`;

    return formattedDate;
}
