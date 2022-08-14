"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatData = void 0;
function addZero(value) {
    if (value <= 9) {
        return "0" + value;
    }
    else {
        return value;
    }
}
const formatData = (date) => {
    const formattedDate = `${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()}`;
    return formattedDate;
};
exports.formatData = formatData;
