export type TokenizedKeyValues = string[];

// Credit to: https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
export function tokenizeKeyValueString(keyValuesString: string): TokenizedKeyValues {
  let list = [];

  let target = keyValuesString
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'')        // Get rid of comments
    // .replace(/ *\[[^\]]*]/g, '')                // Get rid of conditionals
    .split('{').join(' { ')                        // Assure spacing between some reserved keywords or symbols
    .split('}').join(' } ')

  // let regexp = /[^\s"]+|"([^"]*)"/g;
  // let conditionalRegex = /\[(.*?)\]/g;

  
  // RegExp that tokenizes with quotes or square brackets
  let reg2 = /(\[(.*?)\]|[^\s"]+|"([^"]*)")/g
  
  do {
    //Each call to exec returns the next regex match as an array
    var match = reg2.exec(target);
    if (match != null)
    {
      // match[3] holds the tokenized value not surrounded in quotes
      list.push(match[3] ? match[3] : match[0]);
    }
  } while (match != null);

  return list;
}