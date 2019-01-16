module.exports = function clickElementThatContainsText(nth, text) {
  const EC = protractor.ExpectedConditions;
  //* [contains(text(),'match')]
  text = text.replace("\\'", "'");
  let xpath = `//*[contains(text(),"${text}") or contains(@value,"${text}")]/ancestor-or-self::*[self::a or self::button or self::input]`;
  if (nth) {
    // remove nd from 2nd for example
    xpath = `(${xpath})[${nth.replace(/\D/g, '')}]`;
  }

  console.log('Getting element by xpath: ', xpath);
  const elToClick = element(by.xpath(xpath));
  return browser.wait(EC.presenceOf(elToClick))
    .then(() => elToClick.click());
};
