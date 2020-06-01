//jshint esversion:6
const today = new Date();

exports.getDate = () => {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return today.toLocaleDateString("en-US", options);
};
exports.getDay = () => {
    let options = { weekday: "long" };
    return today.toLocaleDateString("en-US", options);
};
