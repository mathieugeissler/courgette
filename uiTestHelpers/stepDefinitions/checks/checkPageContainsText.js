module.exports = function checkPageContainsText(text) {
  const EC = protractor.ExpectedConditions;
  //* [contains(text(),'match')]
  text = text.replace("\\'", "'");
  const xpath = `//*[contains(text(),"${text}")]`;
  const el = element(by.xpath(xpath));
  return browser.wait(EC.visibilityOf(el));
};
