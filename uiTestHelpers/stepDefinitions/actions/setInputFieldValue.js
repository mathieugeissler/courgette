module.exports = function setInputFieldValue(locatorKey, value) {
  return this.getCurrentPage()
    .getElementWhenInDOM(locatorKey)
    .then((element) => element.clear()
      .then(() => {
        value = value.replace("\\'", "'");
        element.sendKeys(value)
      }));
};
