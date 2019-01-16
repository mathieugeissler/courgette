module.exports = function setElementInsideElement(locatorKey2, locatorKey, value) {
  return this.getCurrentPage()
    .getElementWhenInDOM(locatorKey, locatorKey2)
    .then((element) => element.clear()
      .then(() => {
        value = value.replace("\\'", "'");
        element.sendKeys(value)
      }));
};
