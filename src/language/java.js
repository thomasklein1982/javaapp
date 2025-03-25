import {PrimitiveType} from "../classes/PrimitiveType";
import { Clazz } from "../classes/Clazz";
import { defineGenericClazz } from "./datatypes/GenericClazz";
import { appjsdata } from "../functions/snippets";
import { defineString } from "./datatypes/string";
import { defineUIClazzes } from "./datatypes/UI";
import { defineInteger, defineBoolean, defineChar, defineDouble } from "./datatypes/Wrapper.js";
import { defineMath } from "./datatypes/Math";
import {defineDatabaseClazzes} from "./datatypes/Database";
import {definePattern} from "./datatypes/pattern";
import { defineMatcher } from "./datatypes/matcher";
import { defineFile } from "./datatypes/file";
import { defineStorage } from "./datatypes/Storage.js";
import { defineObject } from "./datatypes/object";
import { defineMatrix, defineVector } from "./datatypes/Matrix";
import { defineSystem } from "./datatypes/system";
import { definePrintStream } from "./datatypes/printStream";
import { defineArrayList } from "./datatypes/ArrayList";
import { defineHTMLElement } from "./datatypes/HTMLElement.js";
import { defineSound } from "./datatypes/Sound.js";
import { defineException } from "./datatypes/Exception.js";
import { defineInterfaces } from "./datatypes/interfaces.js";
import { defineJavaApp } from "./datatypes/JavaApp.js";
import { defineInputStream } from "./datatypes/InputStream.js";
import { defineActionEvent } from "./datatypes/ActionEvent.js";
import { defineTimer } from "./datatypes/Timer.js";
import { defineJSON } from "./datatypes/JSON.js";
import { defineRandom } from "./datatypes/Random.js";
import { defineGamepad } from "./datatypes/Gamepad.js";
import { defineReflectionAPI } from "./datatypes/reflection.js";
import { defineVoice } from "./datatypes/Voice.js";
import { defineThread } from "./datatypes/Thread.js";
import { defineQueue } from "./datatypes/Queue.js";
import { defineStack } from "./datatypes/Stack.js";
import { defineHashMap } from "./datatypes/HashMap.js";
import { defineNetworkSession } from "./datatypes/NetworkSession.js";
import { defineMessageEvent } from "./datatypes/MessageEvent.js";

let nullType=new PrimitiveType("null", null, null, "null ist das nicht vorhandene Objekt.");
let boolean=new PrimitiveType("boolean",null,false,"Ein 'boolean' (dt: 'Wahrheitswert') kann nur true oder false sein.",true);
let double=new PrimitiveType("double",null,0.0,"Ein 'double' ist eine Kommazahl.");
let int=new PrimitiveType("int",double,0,"Ein 'Integer' ist eine ganze Zahl.");
let char=new PrimitiveType("char",int,32,"Ein 'Character' (dt: 'Zeichen') ist ein einzelnes Zeichen (z. B. Buchstabe, Ziffer, Leerzeichen usw.).");
let Object=new Clazz("Object",undefined,true);
Object.cannotBeInstantiated=true;
const String=new Clazz("String");
String.cannotBeInstantiated=true;
const Integer=new Clazz("Integer");
const Double=new Clazz("Double");
const Boolean=new Clazz("Boolean");
const Char=new Clazz("Char");
let ActionEvent=new Clazz("ActionEvent");
let MessageEvent=new Clazz("MessageEvent");
let ActionListener=new Clazz("ActionListener",undefined,true);
let Comparable=new Clazz("Comparable",undefined,true);
let Comparator=new Clazz("Comparator",undefined,true);
let Runnable=new Clazz("Runnable",undefined,true);
let RealFunction=new Clazz("RealFunction",undefined,true);
let MessageHandler=new Clazz("MessageHandler",undefined,true);

let JavaApp=new Clazz("JavaApp");
//JavaApp.implementedInterfaces=[ActionListener];

let Math=new Clazz("Math");
Math.cannotBeInstantiated=true;
let Gamepad=new Clazz("Gamepad");
// let UI=new Clazz("UI");
// UI.cannotBeInstantiated=true;
let Path=new Clazz("Path");
Path.cannotBeInstantiated=true;
let Console=new Clazz("Console");
Console.cannotBeInstantiated=true;
let Time=new Clazz("Time");
Time.cannotBeInstantiated=true;
let JComponent=new Clazz("JComponent");
JComponent.cannotBeInstantiated=true;
let JFrame=new Clazz("JFrame");
let JButton=new Clazz("JButton");
let JImage=new Clazz("JImage");
let JTextComponent=new Clazz("JTextComponent");
JTextComponent.cannotBeInstantiated=true;
let JTextField=new Clazz("JTextField");
let JLabel=new Clazz("JLabel");
let Circle=new Clazz("Circle");
let JTextArea=new Clazz("JTextArea");
let JCheckBox=new Clazz("JCheckBox");
let JComboBox=new Clazz("JComboBox");
let JPanel=new Clazz("JPanel");
let DataTable=new Clazz("DataTable");
let Canvas=new Clazz("Canvas");
let UIClass=new Clazz("UIClass");
let HtmlPage=new Clazz("HtmlPage");
let Database=new Clazz("Database");

let Pattern=new Clazz("Pattern");
Pattern.cannotBeInstantiated=true;
let Matcher=new Clazz("Matcher");
Matcher.cannotBeInstantiated=true;

let File=new Clazz("File");
let Storage=new Clazz("Storage");
Storage.staticConstructorMethod="create";

let NetworkSession=new Clazz("NetworkSession");

let Matrix =new Clazz("Matrix");
let Vector=new Clazz("Vector");

let System=new Clazz("System");
System.cannotBeInstantiated=true;
let PrintStream=new Clazz("PrintStream");
PrintStream.cannotBeInstantiated=true;
let InputStream=new Clazz("InputStream");
InputStream.cannotBeInstantiated=true;

let ArrayList=new Clazz("ArrayList");
let Queue=new Clazz("Queue");
let Stack=new Clazz("Stack");
let HashMap=new Clazz("HashMap");
let HTMLElement=new Clazz("HTMLElement");

let Sound=new Clazz("Sound");

let Exception=new Clazz("Exception");

let Timer=new Clazz("Timer");

let JSON=new Clazz("JSON");

let Random=new Clazz("Random");

//reflection api:
let Class= new Clazz("Class");
let Field=new Clazz("Field");
let Method=new Clazz("Method");

let Voice=new Clazz("Voice");

let Thread=new Clazz("Thread");

let datatypes={
  ActionEvent,ActionListener,ArrayList,Boolean,Canvas,Char,Circle,Class,Comparable,Comparator,Console,DataTable,Database,Double,Exception,Field,File, Gamepad,HashMap,HTMLElement,HtmlPage,InputStream,Integer,JButton,JCheckBox,JComboBox,JComponent,JFrame,JImage,JLabel,JPanel,JSON,JTextArea,JTextComponent,JTextField,JavaApp,Matcher,Math,Matrix,MessageEvent, MessageHandler, Method,NetworkSession,Object,Path,Pattern,PrintStream,Queue,Random, RealFunction,Runnable,Sound,Stack,Storage,String,System,Thread,Time,Timer,UIClass,Vector,Voice,boolean,char,double,int,nullType
};

//sortieren der Datentypen:
// let array=[];
// for(let a in datatypes){
//   array.push(a);
// }
// array.sort();
// console.log(array.toString());

let clazzes={
  nullType,Object, String, Math, Gamepad, Time, Console, Path, JComponent,JButton, JPanel, JLabel, JTextComponent,JTextArea, JTextField,JComboBox, JCheckBox, JImage, Canvas, DataTable, Database, Pattern, Matcher, File, Storage, NetworkSession, Matrix, Vector, System, PrintStream, ArrayList, HTMLElement, HtmlPage, Sound, Exception, Integer, Double, Char, Boolean, JFrame, JavaApp, InputStream, Comparable, Comparator, ActionEvent, Timer, JSON, Random, UIClass, Class, Field, Method, Voice, Thread, Queue, Stack, HashMap, Circle, Runnable, RealFunction, MessageEvent, MessageHandler
}

let interfaces={
  ActionListener, Comparable, Comparator, MessageHandler, RealFunction, Runnable
}

export const Java={
  datatypes,
  clazzes,
  interfaces
};

defineObject(Object);
defineException(Exception);
defineString(String,Java);
defineInteger(Integer,Java);
Integer.cannotBeInstantiated=true;
int.setWrapperClass(Integer);
defineDouble(Double,Java);
Double.cannotBeInstantiated=true;
double.setWrapperClass(Double);
defineChar(Char,Java);
Char.cannotBeInstantiated=true;
char.setWrapperClass(Char);
defineBoolean(Boolean,Java);
Boolean.cannotBeInstantiated=true;
boolean.setWrapperClass(Boolean);
defineMath(Math,Java);
defineActionEvent(ActionEvent);
defineMessageEvent(MessageEvent);
definePrintStream(PrintStream);
defineInputStream(InputStream);
defineSystem(System);
defineJavaApp(JavaApp);

defineGamepad(Gamepad);
defineGenericClazz(Console,appjsdata.objects.console,Java);
defineGenericClazz(Path,appjsdata.objects.path,Java);

defineGenericClazz(Time,appjsdata.objects.time,Java);
//defineGenericClazz(Session,appjsdata.objects.session,Java);
defineStorage(Storage);
defineUIClazzes(Java);
defineDatabaseClazzes(Java);
definePattern(Pattern,Java);
defineMatcher(Matcher,Java);
defineFile(File);
defineMatrix(Matrix);
defineVector(Vector);
defineArrayList(ArrayList);
defineQueue(Queue);
defineStack(Stack);
defineHashMap(HashMap);
defineHTMLElement(HTMLElement);
defineSound(Sound,Java);
defineTimer(Timer);
defineJSON(JSON);
defineRandom(Random);
defineInterfaces();
defineReflectionAPI();
defineVoice(Voice);
defineThread(Thread);
defineNetworkSession(NetworkSession);

for(let v in clazzes){
  let c=clazzes[v];
  if(c instanceof Clazz) c.sortMembers();
}