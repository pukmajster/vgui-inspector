import { vguiResource } from "../stores/VguiStore";
import { TokenizedKeyValues, tokenizeKeyValueString } from "./KeyValues";
import { booleanVguiPanelProperties, Conditionals } from "./VguiPanelHelpers";
import type { VguiPanel } from "./VguiTypes";

export function parseVguiRes(tokenizedKeyValues: TokenizedKeyValues, conditionals: Conditionals) {
  let parsingAt = 0;
  let parseList = tokenizedKeyValues;

  function parseVguiResRecursive(parentVguiPanel: VguiPanel = null, skipAllFromNowOn: boolean = false): VguiPanel | null {

    let thisObjectDoesntMeetConditional = false;

    // Prepare an empty VGUI Panel
    let vguiPanel: VguiPanel = {
      name: parseList[parsingAt++],
      properties: {
        enabled: false,
        visible: false,
      },
      children: []
    }

    // The object has an adjacent conditional
    if(parseList[parsingAt].startsWith('[')) {
      let conditional = parseList[parsingAt];
      
      parsingAt++;

      // We still have to parse all children so we get rid of them correctly
      if(!conditionals[conditional]) {
        thisObjectDoesntMeetConditional = true;
        console.log(conditional, false);
      }
      else {
        console.log(conditional, true);
        
      }
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

      // // The object has an adjacent conditional
      // if(tokenAdjacent.startsWith('[')) {
        
      //   let conditional = tokenAdjacent;
      //   parsingAt += 3; // Skip the next 3 tokens as they'll be ignored

      //   if(!conditionals[conditional]) {
      //     console.log(tokenAdjacent, false);
      //     continue;
      //   }
      //   console.log(tokenAdjacent, true);
        

      // } else {
      //   parsingAt += 2;
      // }
      
      // We have a new child panel
      if(tokenAdjacent == '{' || tokenAdjacent.startsWith('[')) {
          //, skipAllFromNowOn || tokenAdjacent.startsWith('[')
        parseVguiResRecursive(vguiPanel, skipAllFromNowOn || thisObjectDoesntMeetConditional);
        continue;
      }

      // We have a property! 
      // The property has an adjacent conditional
      if(parseList[parsingAt + 2].startsWith('[')) {
        let conditional = parseList[parsingAt + 2];
        console.log(conditional);
        
        parsingAt += 3;

        // Skip the next 3 tokens as they'll be ignored
        if(!conditionals[conditional]) {
          continue;
        }

      } else {
        parsingAt += 2;
      }

      if(skipAllFromNowOn || thisObjectDoesntMeetConditional) continue;

      if(booleanVguiPanelProperties.includes(token))
        vguiPanel.properties[token] = ( tokenAdjacent == '1');
      else
        vguiPanel.properties[token] = tokenAdjacent;
    }

    if(skipAllFromNowOn || thisObjectDoesntMeetConditional) return null;
  
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


export function tokenizeResFileAndParseToVgui(res: string, conditionals: Conditionals) {
  parseVguiRes(tokenizeKeyValueString(res), conditionals);
}
