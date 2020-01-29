import memoize from "lodash/memoize";

const getWordsArray = memoize(inputString => {
  let arr = inputString.toLowerCase().split(",");
  return arr.length
    ? arr.reduce((acm, word) => {
        const w = word.trim();
        if (w.length) {
          acm.push(w);
        }
        return acm;
      }, [])
    : null;
});

const getSelectedOptions = (options, inputString) => {
  if (!options || !options.length) {
    return null;
  }

  const words = getWordsArray(inputString);

  if (!words) {
    return null;
  }

  const matchedOptions = [];
  let charsFromEnd = 0;

  words.forEach((word, index) => {
    const matchedOption = options.find(
      option =>
        option.text.toLowerCase().startsWith(word) &&
        !matchedOptions.includes(option)
    );
    if (matchedOption) {
      matchedOptions.push(matchedOption);
      if (index === words.length - 1) {
        charsFromEnd = matchedOption.text.length - word.length;
      }
    }
  });

  return {
    matchedOptions,
    charsFromEnd
  };
};

export default getSelectedOptions;
