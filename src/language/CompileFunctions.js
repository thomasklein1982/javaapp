import { Block } from "./compile/Block";
import { MethodInvocation } from "./compile/MethodInvocation";
import { ExpressionStatement } from "./compile/ExpressionStatement";
import { StringLiteral } from "./compile/StringLiteral";
import { IntegerLiteral } from "./compile/IntegerLiteral";
import { FloatingPointLiteral } from "./compile/FloatingPointLiteral.js";
import { BooleanLiteral } from "./compile/BooleanLiteral";
import { ArgumentList } from "./compile/ArgumentList";
import {Identifier} from "./compile/Identifier";
import { FieldAccess } from "./compile/FieldAccess";
import { ObjectCreationExpression } from "./compile/ObjectCreationExpression";
import { TypeName } from "./compile/TypeName";
import { ScopedTypeName } from "./compile/ScopedTypeName";
import { LocalVariableDeclaration } from "./compile/LocalVariableDeclaration";
import { PrimitiveType } from "./compile/PrimitiveType";
import { AssignmentExpression } from "./compile/AssignmentExpression";
import { VariableDeclarator } from "./compile/VariableDeclarator";
import { BinaryExpression } from "./compile/BinaryExpression";
import { ParenthesizedExpression } from "./compile/ParenthesizedExpression";
import { ArrayCreationExpression } from "./compile/ArrayCreationExpression";
import { Dimension } from "./compile/Dimension";
import { ArrayAccess } from "./compile/ArrayAccess";
import {IfStatement  } from "./compile/IfStatement";
import {ArrayType} from "./compile/ArrayType";
import { ForStatement } from "./compile/ForStatement";
import { LineComment } from "./compile/LineComment";
import { BlockComment } from "./compile/BlockComment";
import { ThisExpression } from "./compile/ThisExpression";
import { ReturnStatement } from "./compile/ReturnStatement";
import { UpdateExpression } from "./compile/UpdateExpression";
import {Null} from "./compile/Null";
import { WhileStatement } from "./compile/WhileStatement";
import { ArrayInitializer } from "./compile/ArrayInitializer";
import { UnaryExpression } from "./compile/UnaryExpression";
import {ExplicitConstructorInvocation} from "./compile/ExplicitConstructorInvocation";
import {CastExpression} from "./compile/CastExpression";
import { BreakStatement } from "./compile/BreakStatement";
import { ContinueStatement } from "./compile/ContinueStatement";
import { GenericType } from "./compile/GenericType";
import { LambdaExpression } from "./compile/LambdaExpression";
import { FormalParameters } from "./compile/FormalParameters";
import { InstanceofExpression } from "./compile/InstanceOfExpression";
import { MethodReference } from "./compile/MethodReference.js";
import { TryStatement } from "./compile/TryStatement.js";
import { Definition } from "./compile/Definition.js";
import { CatchType } from "./compile/CatchType.js";
import { ThrowStatement } from "./compile/ThrowStatement.js";
import { CharacterLiteral } from "./compile/CharacterLiteral.js";
import { InferredParameters } from "./compile/InferredParameters.js";
import { DoStatement } from "./compile/DoStatement.js";
import { SwitchStatement } from "./compile/SwitchStatement.js";
import { TextBlock } from "./compile/TextBlock.js";


function doNothing(){}

export const CompileFunctions={
  get(node,source){
    if(!source){
      console.log("keine source");
    }
    if(node.type.isError){
      throw source.createError("Syntax-Fehler", node);
    }
    let name=node.name==="null"? "Null" : (node.name==="this"? "ThisExpression" : node.name);
    let compile=this.functions[name];
    if(!compile){
      throw source.createError("Unbekanntes Sprachkonstrukt. Sorry, ich verstehe das (noch) nicht :( ["+node.name+"]", node);
    }
    return compile;
  },
  functions: {
    MethodInvocation,ExpressionStatement,StringLiteral,ArgumentList,Identifier,FieldAccess,IntegerLiteral,FloatingPointLiteral, BooleanLiteral, ObjectCreationExpression, TypeName, LocalVariableDeclaration, PrimitiveType, AssignmentExpression, IntegerLiteral, VariableDeclarator, BinaryExpression, ParenthesizedExpression, ArrayCreationExpression, Dimension, ArrayAccess, IfStatement, ArrayType, ForStatement, LineComment, ThisExpression, ReturnStatement, UpdateExpression, Null, WhileStatement, ArrayInitializer, UnaryExpression, Block, ScopedTypeName, ExplicitConstructorInvocation, CastExpression, BreakStatement, ContinueStatement, BlockComment, GenericType, LambdaExpression, FormalParameters, InstanceofExpression, MethodReference, TryStatement, Definition, CatchType, ThrowStatement, CharacterLiteral, InferredParameters, DoStatement, SwitchStatement, TextBlock
  }
}