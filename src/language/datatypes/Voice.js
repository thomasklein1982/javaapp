import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineVoice(Clazz){
  Clazz.description=`Diese Klasse erlaubt es, die Text-To-Speech-API des Browsers zu verwenden. 
  <h3>Beispiel</h3>
<pre><code>Voice v = new Voice();
v.speak("Hallo Welt");</code></pre>`;
  createConstructor({
    args: [
      
    ]
  },Clazz);
  createMethod({
    name: 'setLanguage',
    args: [ 
      {name: 'lang', type: 'String', info: 'Sprache, z. B. "de" oder "en".'}, 
    ],
    info: "Legt die Sprache der Stimme fest."
  },Clazz,true,false);
  createMethod({
    name: 'setPitch',
    args: [
      {name: 'pitch', type: 'double', info: 'Legt die Höhe der Stimme fest. 1.0 ist Standard.'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setRate',
    args: [
      {name: 'rate', type: 'double', info: 'Legt die Sprechgeschwindigkeit fest. 1.0 ist Standard.'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setVolume',
    args: [
      {name: 'vol', type: 'double', info: 'Legt die Lautstärke fest auf 0.0 bis 1.0 (Standard).'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setName',
    args: [
      {name: 'names', type: {baseType: 'String', dimension: 1}, info: 'Ein Array mit Namen von Stimmen. Es wird die erste Stimme verwendet, die auf dem System verfügbar ist.'}
    ],
    info: "Legt die Art der Stimme fest."
  },Clazz,false,false);
  createMethod({
    name: 'speak',
    args: [
      {name: 'text', type: 'String', info: 'Der Text, der gesprochen werden soll.'}
    ],
    info: 'Spricht den angegebenen Text.'
  },Clazz,false,false);
}