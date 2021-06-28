import { vguiResource } from "../stores/VguiStore";
import { TokenizedKeyValues, tokenizeKeyValueString } from "./KeyValues";
import { booleanVguiPanelProperties, Conditionals } from "./VguiPanelHelpers";
import type { VguiPanel } from "./VguiTypes";

// Recursively parses a tokenized list
export function parseVguiRes(tokenizedKeyValues: TokenizedKeyValues, conditionals: Conditionals) {
  let parsingAt = 0;
  let parseList = tokenizedKeyValues;

  function parseVguiResRecursive(parentVguiPanel: VguiPanel = null, skipAllFromNowOn: boolean = false): VguiPanel | null {

    // Used later for determening wether or not the currently parsed object's conditional is faulty.
    // A faulty conditional means the object won't be addded as a child to the parent
    let thisObjectDoesntMeetConditional = false;

    // Prepare an empty VGUI Panel
    let vguiPanel: VguiPanel = {
      name: parseList[parsingAt++], // Assume we have at least one entry in the list because i'm lazy.
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
        parsingAt += 3;  // Skip the next 3 tokens as they'll be ignored
       
        if(!conditionals[conditional]) {
          continue;
        }

      } else {
        parsingAt += 2;
      }

      // If a conditional has been flagged as faulty, don't add the property to the object
      if(skipAllFromNowOn || thisObjectDoesntMeetConditional) continue;

      if(booleanVguiPanelProperties.includes(token))
        vguiPanel.properties[token] = ( tokenAdjacent == '1');
      else
        vguiPanel.properties[token] = tokenAdjacent;
    }

    // If a conditional has been flagged as faulty, don't add the object as a child. 
    // This implementation is a bit wack, because it still parses all child objects while knowing
    // they'll all be skipped. Hopefully they're atleast properly deleted from memory with the GC.
    if(skipAllFromNowOn || thisObjectDoesntMeetConditional) return null;
  
    // If this panel has no parent, return it as the root
    if(parentVguiPanel == null) 
      return vguiPanel;

    // On the other hand, if the panel does have a parent, add it as a child panel
    parentVguiPanel.children.push(vguiPanel);
  }

  // Assing the first parsed panel as the Root panel.
  // The root panel is hidden from the resource tree!
  let rootPanel: VguiPanel = parseVguiResRecursive();
  vguiResource.set(rootPanel);
}

// Tokenizes a .res string and then parses it
export function tokenizeResFileAndParseToVgui(res: string, conditionals: Conditionals) {
  parseVguiRes(tokenizeKeyValueString(res), conditionals);
}
