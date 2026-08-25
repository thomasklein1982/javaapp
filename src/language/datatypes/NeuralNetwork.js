import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineNeuralNetwork(Clazz,Java){
  createConstructor({
    args: [//neuronCounts,activation,activationDerivative
      {name: 'neuronCounts', type: {dimension: 1, baseType: "int"}}
    ]
  },Clazz);
  createMethod({
    name: 'propagateForward',
    args: [ 
    ],
    returnType: {baseType: "double", dimension: 1},
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'addTrainingData',
    args: [ 
      {name: 'x', type: {baseType: 'double', dimension: 1}},
      {name: 'y', type: {baseType: 'double', dimension: 1}}
    ],
    info: "Fügt ein Paar Trainingsdaten hinzu."
  },Clazz,false,false);
  createMethod({
    name: 'addTrainingDataWithLearningRateFactor',
    args: [ 
      {name: 'x', type: {baseType: 'double', dimension: 1}},
      {name: 'y', type: {baseType: 'double', dimension: 1}},
      {name: 'r', type: 'double'}
    ],
    info: "Fügt ein Paar Trainingsdaten hinzu zusammen mit einem speziellen Lernraten-Faktor, der auf die Lernrate für dieses Trainingsdatum angewendet wird."
  },Clazz,false,false);
  createMethod({
    name: 'clearTrainingData',
    args: [ 
    ],
    info: "Entfernt alle Trainingsdaten."
  },Clazz,false,false);
  createMethod({
    name: 'randomizeWeightsAndBiasses',
    args: [ 
      {name: 'factor', type: "double"}
    ],
    returnType: "double",
    info: "Randomisiert alle Gewichte und Biasse des Netzes mit zufälligen Kommazahlen zwischen -factor und +factor. Liefert die Kosten des Netzes zurück."
  },Clazz,false,false);
  createMethod({
    name: 'setInputLayer',
    args: [ 
      {name: 'x', type: {baseType: 'double', dimension: 1}}
    ],
    info: "Legt die Neuronen der Eingabeschicht fest."
  },Clazz,false,false);
  createMethod({
    name: 'cost',
    args: [ 
      
    ],
    returnType: "double",
    info: "Berechnet die Kosten für die festgelegten Trainingsdaten."
  },Clazz,false,false);
  createMethod({
    name: 'train',
    args: [ 
      {name: "learningRate", type: "double"},
      {name: "maxSteps", type: "int"}
    ],
    returnType: "double",
    info: "Trainiert das Neuronale Netz mit den festgelegten Trainingsdaten."
  },Clazz,false,false);
  createMethod({
    name: 'serialize',
    args: [ 
      
    ],
    returnType: "String",
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'setActivationFunction',
    args: [ 
      {name: "functionIndex", type: "int", default: "NeuralNetwork.SIGMOID"}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'setOutputActivationFunction',
    args: [ 
      {name: "functionIndex", type: "int", default: "NeuralNetwork.SIGMOID"}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'deserialize',
    args: [ 
      {name: "serializedNet", type: "String"}
    ],
    returnType: "NeuralNetwork",
    info: ""
  },Clazz,true,false);
  createAttribute({
    name: "SIGMOID",
    type: "int",
    info: ""
  },Clazz,true);
  createAttribute({
    name: "RELU",
    type: "int",
    info: ""
  },Clazz,true);
  createAttribute({
    name: "NONE",
    type: "int",
    info: ""
  },Clazz,true);
  createAttribute({
    name: "TANH",
    type: "int",
    info: ""
  },Clazz,true);
}