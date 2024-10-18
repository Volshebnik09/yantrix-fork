/* eslint-disable */
// @ts-nocheck
import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType } from '@ts-jison/parser';
/**
 * parser generated by  @ts-jison/parser-generator 0.4.1-alpha.2
 * @returns Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */

  import {ReservedList, ExpressionTypes} from './index.js';
  import {calcDepthFunc, maxNestedFuncLevel} from './grammar/jsGrammar.js';

  let counter = 0;

export class YantrixParser extends JisonParser implements JisonParserApi {
    $?: any;
    symbols_: SymbolsType = {"error":2,"start":3,"document":4,"EOF":5,"line":6,"statements":7,"NewLine":8,"PLUS":9,"INITIAL_STATE":10,"BY_PASS":11,"CONTEXT_STATEMENT":12,"EMIT_STATEMENT":13,"SUBSCRIBE_STATEMENT":14,"DEFINE_STATEMENT":15,"EXPRESSION_STATEMENT":16,"CONTEXT_SYMBOL":17,"LEFT_BRACE":18,"RAW_KEYLIST":19,"RIGHT_BRACE":20,"LEFT_ARROW":21,"KEY_LIST":22,"EMIT_EVENT":23,"KEY_LIST_STATEMENT":24,"EMIT":25,"IDENT":26,"SUBSCRIBE_EVENT":27,"SUBSCRIBE":28,"DEFINE":29,"DEFINE_ARGUMENTS":30,"RIGHT_ARROW":31,"DEFINE_FUNCTION":32,"FUNCTION_NAME":33,"LEFT_BRACKET":34,"DEFINE_FUNCTION_ARGUMENTS":35,"RIGHT_BRACKET":36,"DEFINE_FUNCTION_VALUE":37,"IMMUTABLE":38,"CONSTANT":39,"EXPRESSION_DEFINE":40,"COMMA":41,"DEFINE_ARGUMENTS_TYPES":42,"ASSIGN":43,"EXPRESSION":44,"QUESTION_MARK":45,"KEY_ITEM":46,"DATA_OBJECT":47,"FUNCTION":48,"RAW_KEYITEM":49,"ARGUMENTS":50,"DATA_OBJECT_REFERENCE":51,"PAYLOAD_REFERENCE":52,"CONTEXT_REFERENCE":53,"CONSTANT_SYMBOL":54,"DOLLAR_SYMBOL":55,"ARRAY":56,"STRING":57,"NUMBER":58,"INTEGER":59,"DECIMAL":60,"$accept":0,"$end":1};
    terminals_: TerminalsType = {2:"error",5:"EOF",8:"NewLine",9:"PLUS",10:"INITIAL_STATE",11:"BY_PASS",17:"CONTEXT_SYMBOL",18:"LEFT_BRACE",20:"RIGHT_BRACE",21:"LEFT_ARROW",25:"EMIT",26:"IDENT",28:"SUBSCRIBE",29:"DEFINE",31:"RIGHT_ARROW",33:"FUNCTION_NAME",34:"LEFT_BRACKET",36:"RIGHT_BRACKET",41:"COMMA",43:"ASSIGN",45:"QUESTION_MARK",54:"CONSTANT_SYMBOL",55:"DOLLAR_SYMBOL",56:"ARRAY",57:"STRING",59:"INTEGER",60:"DECIMAL"};
    productions_: ProductionsType = [0,[3,2],[4,0],[4,2],[6,1],[6,1],[7,2],[7,2],[7,1],[7,1],[7,1],[7,1],[7,1],[12,4],[12,6],[13,1],[13,2],[13,7],[23,2],[14,1],[14,2],[14,4],[27,3],[15,5],[32,4],[32,3],[32,1],[37,1],[37,1],[35,1],[35,3],[40,1],[40,1],[40,1],[40,4],[40,3],[30,2],[30,3],[42,1],[42,3],[16,3],[24,3],[22,1],[22,3],[46,1],[46,1],[46,1],[19,1],[19,3],[49,1],[49,3],[48,4],[48,3],[50,1],[50,3],[47,3],[47,1],[44,1],[44,1],[44,1],[51,1],[51,1],[51,1],[39,2],[52,2],[53,2],[38,1],[38,1],[38,1],[58,1],[58,1]];
    table: Array<StateType>;
    defaultActions: {[key:number]: any} = {3:[2,1],73:[2,36],81:[2,48],90:[2,37]};

    constructor (yy = {}, lexer = new YantrixLexer(yy)) {
      super(yy, lexer);

      // shorten static method to just `o` for terse STATE_TABLE
      const $V0=[5,8,9,17,25,28,29,43],$V1=[1,24],$V2=[1,43],$V3=[1,35],$V4=[1,41],$V5=[1,42],$V6=[1,31],$V7=[1,32],$V8=[1,36],$V9=[1,37],$Va=[1,48],$Vb=[5,8,9,17,20,25,28,29,36,41,43,45],$Vc=[5,8,9,17,25,28,29,34,43],$Vd=[20,41],$Ve=[5,8,9,17,25,28,29,36,43],$Vf=[5,8,9,17,25,28,29,36,41,43],$Vg=[36,41],$Vh=[1,105],$Vi=[1,106],$Vj=[1,108];
      const o = JisonParser.expandParseTable;
      this.table = [o($V0,[2,2],{3:1,4:2}),{1:[3]},{5:[1,3],6:4,7:5,8:[1,6],9:[1,7],12:8,13:9,14:10,15:11,16:12,17:[1,13],23:14,25:[1,18],27:15,28:[1,19],29:[1,16],43:[1,17]},{1:[2,1]},o($V0,[2,3]),o($V0,[2,4]),o($V0,[2,5]),{10:[1,20],11:[1,21]},o($V0,[2,8]),o($V0,[2,9]),o($V0,[2,10]),o($V0,[2,11]),o($V0,[2,12]),{18:[1,22]},o($V0,[2,15],{24:23,34:$V1}),o($V0,[2,19],{24:25,34:$V1}),{26:[1,26]},{17:$V2,33:$V3,38:28,39:38,44:27,47:29,48:30,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},{26:[1,44]},{26:[1,45]},o($V0,[2,6]),o($V0,[2,7]),{19:46,26:$Va,49:47},o($V0,[2,16],{21:[1,49]}),{17:$V2,22:50,33:$V3,38:53,39:38,46:51,47:52,48:54,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},o($V0,[2,20],{21:[1,55]}),{30:56,34:[1,57]},{45:[1,58]},o($Vb,[2,57]),o($Vb,[2,58]),o($Vb,[2,59]),o($Vb,[2,66]),o($Vb,[2,67]),o($Vb,[2,68]),o([5,8,9,17,20,25,28,29,36,41,45],[2,56],{43:[1,59]}),{34:[1,60]},o($Vb,[2,69]),o($Vb,[2,70]),o($Vb,[2,60]),o($Vb,[2,61]),o($Vb,[2,62]),{26:[1,61]},{26:[1,62]},{26:[1,63]},o($Vc,[2,18]),{26:[1,64]},{20:[1,65]},{20:[2,47],41:[1,66]},o($Vd,[2,49],{43:[1,67]}),{17:[1,68]},{36:[1,69]},o($Ve,[2,42],{41:[1,70]}),o($Vf,[2,44]),o($Vf,[2,45]),o($Vf,[2,46]),{24:71,34:$V1},{31:[1,72]},{26:[1,75],36:[1,73],42:74},o($V0,[2,40]),{17:$V2,33:$V3,38:28,39:38,44:76,47:29,48:30,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},{17:$V2,33:$V3,36:[1,78],38:28,39:38,44:79,47:29,48:30,50:77,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},o($Vb,[2,63]),o($Vb,[2,64]),o($Vb,[2,65]),o($Vc,[2,22]),o($V0,[2,13],{21:[1,80]}),{19:81,26:$Va,49:47},{17:$V2,33:$V3,38:28,39:38,44:82,47:29,48:30,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},{18:[1,83]},o([5,8,9,17,21,25,28,29,43],[2,41]),{17:$V2,22:84,33:$V3,38:53,39:38,46:51,47:52,48:54,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},o($V0,[2,21]),{32:85,33:[1,86],37:87,38:88,39:89,54:$V4,56:$V6,57:$V7,58:33,59:$V8,60:$V9},{31:[2,36]},{36:[1,90],41:[1,91]},o($Vg,[2,38]),o($Vb,[2,55]),{36:[1,92],41:[1,93]},o($Vb,[2,52]),o($Vg,[2,53]),{17:$V2,22:94,33:$V3,38:53,39:38,46:51,47:52,48:54,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},{20:[2,48]},o($Vd,[2,50]),{19:95,26:$Va,49:47},o($Ve,[2,43]),o($V0,[2,23]),{34:[1,96]},o($V0,[2,26]),o($V0,[2,27]),o($V0,[2,28]),{31:[2,37]},{26:[1,97]},o($Vb,[2,51]),{17:$V2,33:$V3,38:28,39:38,44:98,47:29,48:30,51:34,52:39,53:40,54:$V4,55:$V5,56:$V6,57:$V7,58:33,59:$V8,60:$V9},o($V0,[2,14]),{20:[1,99]},{26:$Vh,33:$Vi,35:100,36:[1,101],38:103,39:104,40:102,54:$V4,56:$V6,57:$V7,58:33,59:$V8,60:$V9},o($Vg,[2,39]),o($Vg,[2,54]),o($V0,[2,17]),{36:[1,107],41:$Vj},o($V0,[2,25]),o($Vg,[2,29]),o($Vg,[2,31]),o($Vg,[2,32]),o($Vg,[2,33]),{34:[1,109]},o($V0,[2,24]),{26:$Vh,33:$Vi,38:103,39:104,40:110,54:$V4,56:$V6,57:$V7,58:33,59:$V8,60:$V9},{26:$Vh,33:$Vi,35:111,36:[1,112],38:103,39:104,40:102,54:$V4,56:$V6,57:$V7,58:33,59:$V8,60:$V9},o($Vg,[2,30]),{36:[1,113],41:$Vj},o($Vg,[2,35]),o($Vg,[2,34])];
    }

    performAction (yytext:string, yyleng:number, yylineno:number, yy:any, yystate:number /* action[1] */, $$:any /* vstack */, _$:any /* lstack */): any {
/* this == yyval */
          var $0 = $$.length - 1;
        switch (yystate) {
case 1:
return $$[$0-1]
break;
case 2:
this.$={defines:[], contextDescription:[],emit:[],subscribe:[],initialState:false,byPass:false}
break;
case 3:

           if($$[$0] !== '\n') {
              if($$[$0].hasOwnProperty('initialState')){
                $$[$0-1]['initialState'] = true
              }
              if($$[$0].hasOwnProperty('byPass')){
                $$[$0-1]['byPass'] = true
              }
              if($$[$0].hasOwnProperty('context'))  $$[$0-1]['contextDescription'].push($$[$0])
              if($$[$0].hasOwnProperty('emit')) $$[$0-1]['emit'].push($$[$0]['emit'])
              if($$[$0].hasOwnProperty('subscribe')) $$[$0-1]['subscribe'].push($$[$0]['subscribe'])
              if($$[$0].hasOwnProperty('define')) $$[$0-1]['defines'].push($$[$0]['define'])
              if($$[$0].hasOwnProperty('expression')) { this.$ = $$[$0] }
           }
        
break;
case 6:
this.$ = {initialState:true}
break;
case 7:
this.$ = {byPass:true}
break;
case 11:
this.$ = {define:$$[$0]}
break;
case 12:
this.$ = {expression: $$[$0]}
break;
case 13:
this.$ = {context:$$[$0-1]} 
break;
case 14:

                  if($$[$0].length > $$[$0-3].length) {
                        throw new Error('The number of arguments must be equal to or less than the number of context arguments.')}; this.$ = {context: $$[$0-3], reducer:$$[$0]}
break;
case 15:
this.$ = {emit:{...$$[$0]}}
break;
case 16:
 this.$ = {emit:{...$$[$0-1], meta:[...$$[$0]]}} 
break;
case 17:
 this.$ = {emit:{ ...$$[$0-6], meta: $$[$0-5], context:[...$$[$0-1]] }}
break;
case 18:
 this.$ = {identifier:$$[$0]}
break;
case 19:
 this.$ = {subscribe:$$[$0]}
break;
case 20:
 this.$ = {subscribe:{payload:$$[$0],...$$[$0-1]}}
break;
case 21:
 this.$ = {subscribe:{...$$[$0-3],meta:$$[$0], payload:$$[$0-2]}}
break;
case 22:
 this.$ = {identifier:$$[$0-1], actionName:$$[$0]}
break;
case 23:
this.$ = {identifier:$$[$0-3], ...$$[$0-2], expression:$$[$0]}
break;
case 24: case 34: case 51:
this.$ = { expressionType:ExpressionTypes.Function,FunctionDeclaration: { FunctionName:$$[$0-3], Arguments:[...$$[$0-1]]} } 
break;
case 25: case 35: case 52:
this.$ = { expressionType:ExpressionTypes.Function, FunctionDeclaration: { FunctionName:$$[$0-2], Arguments:[] } } 
break;
case 29: case 42: case 47: case 53:
this.$ = [$$[$0]]
break;
case 30: case 54:
 this.$ = [...$$[$0-2], $$[$0]] 
break;
case 33:
this.$ = {expressionType:ExpressionTypes.Identifier, identifier:$$[$0]}
break;
case 36:
this.$ = {Arguments:[]}
break;
case 37:
this.$ = {Arguments:[...$$[$0-1]]}
break;
case 38:
this.$ = $$[$0]
break;
case 39: case 43:
this.$ = [$$[$0-2]].concat($$[$0])
break;
case 40:
this.$ = $$[$0-1]
break;
case 41:
 this.$ = $$[$0-1]
break;
case 44:
this.$ = {keyItem:{...$$[$0]}}
break;
case 45: case 46:
this.$ = {keyItem:{expression:$$[$0]}}
break;
case 48:
this.$ =[$$[$0-2]].concat($$[$0])
break;
case 49:
this.$ = {keyItem:{identifier:$$[$0]}}
break;
case 50:
this.$ = {keyItem:{identifier: $$[$0-2], expression: $$[$0]}}
break;
case 55:
 this.$ = {...$$[$0-2], expression:$$[$0]}
break;
case 59:
counter = Math.max(calcDepthFunc($$[$0]), counter);
                if(counter > maxNestedFuncLevel) {
                    counter = 0;
                    throw new Error('nested limit');
                }
break;
case 63:
this.$ = {expressionType:ExpressionTypes.Constant, identifier:$$[$0]}
break;
case 64:
 this.$ = {expressionType:ExpressionTypes.Payload, identifier: $$[$0] } 
break;
case 65:
this.$ = {expressionType:ExpressionTypes.Context, identifier:$$[$0] } 
break;
case 66:
this.$ = { ArrayDeclaration:[], expressionType:ExpressionTypes.ArrayDeclaration} 
break;
case 67:
this.$ = {StringDeclaration:$$[$0].toString(), expressionType:ExpressionTypes.StringDeclaration}
break;
case 69:
this.$ = { NumberDeclaration: Number($$[$0]), expressionType: ExpressionTypes.IntegerDeclaration} 
break;
case 70:
this.$ = { NumberDeclaration: Number($$[$0]), expressionType:ExpressionTypes.DecimalDeclaration} 
break;
        }
    }
}


/* generated by @ts-jison/lexer-generator 0.4.1-alpha.2 */
import { JisonLexer, JisonLexerApi } from '@ts-jison/lexer';

export class YantrixLexer extends JisonLexer implements JisonLexerApi {
    options: any = {"case-insensitive":true,"moduleName":"Yantrix"};
    constructor (yy = {}) {
        super(yy);
    }

    rules: RegExp[] = [
        /^(?:$)/i,
        /^(?:[\r\n]+)/i,
        /^(?:%%)/i,
        /^(?:[\s]+)/i,
        /^(?:[A-Za-z]{1,}[A-Za-z0-9\.]*(?=[(]))/i,
        /^(?:subscribe\/)/i,
        /^(?:emit\/)/i,
        /^(?:define\/)/i,
        /^(?:Init\b)/i,
        /^(?:ByPass\b)/i,
        /^(?:[a-zA-Z]\w{0,254})/i,
        /^(?:\+)/i,
        /^(?:\{)/i,
        /^(?:\})/i,
        /^(?:#)/i,
        /^(?:\$)/i,
        /^(?:,)/i,
        /^(?:\()/i,
        /^(?:<=)/i,
        /^(?:=>)/i,
        /^(?:=)/i,
        /^(?:\))/i,
        /^(?:\/)/i,
        /^(?:\?)/i,
        /^(?:'[^']+')/i,
        /^(?:"[^"]+")/i,
        /^(?:-?[0-9]+\.[0-9]+)/i,
        /^(?:-?[0-9]+)/i,
        /^(?:\[\])/i
    ];
    conditions: any = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],"inclusive":true}}
    performAction (yy:any,yy_:any,$avoiding_name_collisions:any,YY_START:any): any {
          var YYSTATE=YY_START;
        switch($avoiding_name_collisions) {
    case 0:return 5;
      break;
    case 1:return 8;
      break;
    case 2:return 54;
      break;
    case 3:/* skip all whitespace */
      break;
    case 4:return 33;
      break;
    case 5:return 28
      break;
    case 6:return 25
      break;
    case 7:return 29
      break;
    case 8:return 10
      break;
    case 9:return 11
      break;
    case 10:return 26
      break;
    case 11:return 9
      break;
    case 12:return 18
      break;
    case 13:return 20
      break;
    case 14:return 17
      break;
    case 15:return 55
      break;
    case 16:return 41
      break;
    case 17:return 34
      break;
    case 18:return 21
      break;
    case 19:return 31
      break;
    case 20:return 43
      break;
    case 21:return 36
      break;
    case 22:return 'FORWARD_SLASH'
      break;
    case 23:return 45
      break;
    case 24:yy_.yytext = yy_.yytext.slice(1,-1); return 57
      break;
    case 25:yy_.yytext = yy_.yytext.slice(1,-1); return 57
      break;
    case 26:return 60
      break;
    case 27:return 59
      break;
    case 28:return 56
      break;
        }
    }
}


