module.exports.getDate = function () {
  let date = new Date();
  let option = {
    weekday: "long",
    month: "long",
    year: "numeric",
    day: "numeric",
  };
  let currentdate = date.toLocaleDateString("en-US", option);
  return currentdate;
};
module.exports.getDay = function () {
  let date = new Date();
  let option = {
    weekday: "long",
  };
  let currentdate = date.toLocaleDateString("en-US", option);
  return currentdate;
};
