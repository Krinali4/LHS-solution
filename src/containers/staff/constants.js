export const changeDateFormat = (value) => {
    let newDate = new Date(value);
    return `${('0' + newDate.getDate()).slice(-2)}/${('0' + (newDate.getMonth() + 1)).slice(-2)}/${newDate.getFullYear()}`;
}