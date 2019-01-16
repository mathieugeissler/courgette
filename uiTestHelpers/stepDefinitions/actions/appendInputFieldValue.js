module.exports = function appendInputFieldValue(value, locatorKey) {
  return this.getCurrentPage()
    .getElementWhenInDOM(locatorKey)
    .then((element) => {
      value = value.replace("\\'", "'");
      element.sendKeys(value)
    });
};
