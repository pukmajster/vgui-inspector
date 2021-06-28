export type TokenizedKeyValues = string[];

// Credit to:
// https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
export function tokenizeKeyValueString(keyValuesString: string): TokenizedKeyValues {
  let list = [];

  let target = keyValuesString
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'')        // Get rid of comments
    .replace(/ *\[[^\]]*]/g, '')                           // Get rid of conditionals
    .split('{').join(' { ')                               // Assure spacing between some reserved keywords or symbols
    .split('}').join(' } ')

  let regexp = /[^\s"]+|"([^"]*)"/gi;

  console.log(target);
  
  
  do {
    //Each call to exec returns the next regex match as an array
    var match = regexp.exec(target);
    if (match != null)
    {
      //Index 1 in the array is the captured group if it exists
      //Index 0 is the matched text, which we use if no captured group exists
      list.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);

  console.log(list);
  
  return list;
}