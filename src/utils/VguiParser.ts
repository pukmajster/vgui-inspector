import { vguiResource } from "../stores/VguiStore";
import { TokenizedKeyValues, tokenizeKeyValueString } from "./KeyValues";
import type { VguiPanel } from "./VguiTypes";

export function parseVguiRes(tokenizedKeyValues: TokenizedKeyValues) {
  let parsingAt = 0;
  let parseList = tokenizedKeyValues;

  function parseVguiResRecursive(parentVguiPanel: VguiPanel = null): VguiPanel | null {

    // Prepare an empty VGUI Panel
    let vguiPanel: VguiPanel = {
      name: parseList[parsingAt++],
      properties: {},
      children: []
    }

    // Assume the next char is '{' which defines a new sub-panel
    parsingAt++;
    
    let token = '';
    while(true) {
      token = parseList[parsingAt];

      // This marks the end of the panel
      if (token == '}') {
        parsingAt++;
        break;
      }

      let tokenAdjacent = parseList[parsingAt + 1];
      
      // We have a new child panel
      if(tokenAdjacent == '{') {
        parseVguiResRecursive(vguiPanel);
        continue;
      }

      // We have a property! 
      vguiPanel.properties[token] = tokenAdjacent;
      parsingAt += 2;
    }
  
    // If this panel has no parent, return it as the root
    if(parentVguiPanel == null) 
      return vguiPanel;

    // On the other hand, if the panel does have a parent, add it as a child panel
    parentVguiPanel.children.push(vguiPanel);
  }

  let rootPanel: VguiPanel = parseVguiResRecursive();
  console.log(rootPanel);
  vguiResource.set(rootPanel);
}


export function tokenizeResFileAndParseToVgui(res: string) {
  parseVguiRes(tokenizeKeyValueString(res));
}
