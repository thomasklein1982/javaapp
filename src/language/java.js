import {PrimitiveType} from "../classes/PrimitiveType";
import { Clazz } from "../classes/Clazz";
import { defineApp } from "./datatypes/App.js";
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
import { defineStorage } from "./datatypes/storage";
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
import { defineWorld } from "./datatypes/World.js";

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

let ActionListener=new Clazz("ActionListener",undefined,true);
let Comparable=new Clazz("Comparable",undefined,true);
let TileHandler=new Clazz("TileHandler",undefined,true);

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
let World=new Clazz("World");
World.cannotBeInstantiated=true;
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
let JHtml=new Clazz("JHtml");
let JTextArea=new Clazz("JTextArea");
let JCheckBox=new Clazz("JCheckBox");
let JComboBox=new Clazz("JCombobox");
let JPanel=new Clazz("JPanel");
let DataTable=new Clazz("DataTable");
let Canvas=new Clazz("Canvas");
let App=new Clazz("App");
App.cannotBeInstantiated=true;
let Database=new Clazz("Database");
let Record=new Clazz("Record");
Record.cannotBeInstantiated=true;

let Pattern=new Clazz("Pattern");
Pattern.cannotBeInstantiated=true;
let Matcher=new Clazz("Matcher");
Matcher.cannotBeInstantiated=true;

let File=new Clazz("File");
File.cannotBeInstantiated=true;
let Storage=new Clazz("Storage");
Storage.cannotBeInstantiated=true;

let Session=new Clazz("Session");
Session.cannotBeInstantiated=true;

let Matrix =new Clazz("Matrix");
let Vector=new Clazz("Vector");

let System=new Clazz("System");
System.cannotBeInstantiated=true;
let PrintStream=new Clazz("PrintStream");
PrintStream.cannotBeInstantiated=true;
let InputStream=new Clazz("InputStream");
InputStream.cannotBeInstantiated=true;

let ArrayList=new Clazz("ArrayList");
let HTMLElement=new Clazz("HTMLElement");

let Sound=new Clazz("Sound");

let Exception=new Clazz("Exception");

let Timer=new Clazz("Timer");

let JSON=new Clazz("JSON");

let Random=new Clazz("Random");

let datatypes={
  nullType,boolean, double, int, char, Object, String,Math, App, Gamepad, Time, Console, World, Path, JComponent,JButton, JPanel, JLabel, JTextComponent, JTextArea, JTextField,JComboBox, JCheckBox, JImage, Canvas, DataTable, Database, Record, Pattern, Matcher, File, Storage, Session, Matrix, Vector, System, PrintStream, ArrayList, HTMLElement, Sound, Exception, Integer, Double, Char, Boolean, JFrame, ActionListener, JavaApp, InputStream, Comparable, ActionEvent, Timer, JSON, Random, TileHandler
};

let clazzes={
  nullType,Object, String, Math,App, Gamepad, Time, Console, World, Path, JComponent,JButton, JPanel, JLabel, JTextComponent,JTextArea, JTextField,JComboBox, JCheckBox, JImage, Canvas, DataTable, Database, Record, Pattern, Matcher, File, Storage, Session, Matrix, Vector, System, PrintStream, ArrayList, HTMLElement, Sound, Exception, Integer, Double, Char, Boolean, JFrame, JavaApp, InputStream, Comparable, ActionEvent, Timer, JSON, Random, TileHandler
}

let interfaces={
  ActionListener, Comparable, TileHandler
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
definePrintStream(PrintStream);
defineInputStream(InputStream);
defineSystem(System);
defineJavaApp(JavaApp);

defineGamepad(Gamepad);
defineGenericClazz(Console,appjsdata.objects.console,Java);
defineGenericClazz(Path,appjsdata.objects.path,Java);
defineWorld(World);
//defineGenericClazz(World,appjsdata.objects.world,Java);
defineGenericClazz(Time,appjsdata.objects.time,Java);
defineGenericClazz(Storage,appjsdata.objects.storage,Java);
defineGenericClazz(Session,appjsdata.objects.session,Java);
defineStorage(Storage);
defineApp(App,Java);
defineUIClazzes(Java);
defineDatabaseClazzes(Java);
definePattern(Pattern,Java);
defineMatcher(Matcher,Java);
defineFile(File);
defineMatrix(Matrix);
defineVector(Vector);
defineArrayList(ArrayList);
defineHTMLElement(HTMLElement);
defineSound(Sound,Java);
defineTimer(Timer);
defineJSON(JSON);
defineRandom(Random);
defineInterfaces();

for(let v in clazzes){
  let c=clazzes[v];
  if(c instanceof Clazz) c.sortMembers();
}