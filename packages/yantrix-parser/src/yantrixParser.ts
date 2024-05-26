import { JisonParser, JisonParserApi, StateType, SymbolsType, TerminalsType, ProductionsType } from '@ts-jison/parser';
/**
 * parser generated by  @ts-jison/parser-generator 0.4.1-alpha.2
 * @returns Parser implementing JisonParserApi and a Lexer implementing JisonLexerApi.
 */

  import {ReservedList, ExpressionTypes} from './index.js'

export class YantrixParser extends JisonParser implements JisonParserApi {
    $?: any;
    symbols_: SymbolsType = {"error":2,"start":3,"document":4,"EOF":5,"line":6,"statements":7,"NewLine":8,"InitialState":9,"ContextDefinitions":10,"EventEmitStatement":11,"SubscribeStatement":12,"ContextStatement":13,"<=":14,"(":15,"KeyList":16,")":17,"{":18,"}":19,"#{":20,"emit/":21,"EventName":22,"subscribe/":23,"=>":24,"ActionStatement":25,"ActionName":26,"KeyItem":27,",":28,"TargetProperty":29,"=":30,"Expression":31,"Number":32,"integerLiteral":33,"decimalLiteral":34,"FunctionOperator":35,"Property":36,"StringDeclaration":37,"ConstantDeclaration":38,"Array":39,"FunctionName":40,"Arguments":41,"PropertyArgument":42,"$(":43,"Constant":44,"$accept":0,"$end":1};
    terminals_: TerminalsType = {2:"error",5:"EOF",8:"NewLine",9:"InitialState",14:"<=",15:"(",17:")",18:"{",19:"}",20:"#{",21:"emit/",22:"EventName",23:"subscribe/",24:"=>",26:"ActionName",28:",",29:"TargetProperty",30:"=",33:"integerLiteral",34:"decimalLiteral",36:"Property",37:"StringDeclaration",39:"Array",40:"FunctionName",42:"PropertyArgument",43:"$(",44:"Constant"};
    productions_: ProductionsType = [0,[3,2],[4,0],[4,2],[6,1],[6,1],[7,1],[7,1],[7,1],[7,1],[10,1],[10,5],[10,5],[13,3],[11,2],[11,6],[12,4],[25,1],[25,4],[16,1],[16,3],[27,3],[27,1],[32,0],[32,1],[32,1],[31,1],[31,1],[31,1],[31,1],[31,1],[31,1],[35,3],[35,4],[41,0],[41,1],[41,1],[41,3],[38,3]];
    table: Array<StateType>;
    defaultActions: {[key:number]: any} = {3:[2,1]};

    constructor (yy = {}, lexer = new YantrixLexer(yy)) {
      super(yy, lexer);

      // shorten static method to just `o` for terse STATE_TABLE
      const $V0=[5,8,9,20,21,23],$V1=[1,20],$V2=[1,26],$V3=[17,19,28],$V4=[1,43],$V5=[1,44],$V6=[1,36],$V7=[1,37],$V8=[1,39],$V9=[1,41],$Va=[1,42],$Vb=[2,34],$Vc=[1,56],$Vd=[1,60],$Ve=[17,28];
      const o = JisonParser.expandParseTable;
      this.table = [o($V0,[2,2],{3:1,4:2}),{1:[3]},{5:[1,3],6:4,7:5,8:[1,6],9:[1,7],10:8,11:9,12:10,13:11,20:[1,14],21:[1,12],23:[1,13]},{1:[2,1]},o($V0,[2,3]),o($V0,[2,4]),o($V0,[2,5]),o($V0,[2,6]),o($V0,[2,7]),o($V0,[2,8]),o($V0,[2,9]),o($V0,[2,10],{14:[1,15]}),{22:[1,16]},{22:[1,17]},{16:18,27:19,29:$V1},{15:[1,21],18:[1,22]},o($V0,[2,14],{14:[1,23]}),{24:[1,24]},{19:[1,25],28:$V2},o($V3,[2,19]),o($V3,[2,22],{30:[1,27]}),{16:28,27:19,29:$V1},{16:29,27:19,29:$V1},{15:[1,30]},{25:31,26:[1,32]},o([5,8,9,14,20,21,23],[2,13]),{27:33,29:$V1},o($V3,[2,23],{31:34,35:35,38:38,32:40,33:$V4,34:$V5,36:$V6,37:$V7,39:$V8,40:$V9,43:$Va}),{17:[1,45],28:$V2},{19:[1,46],28:$V2},{16:47,27:19,29:$V1},o($V0,[2,16]),o($V0,[2,17],{15:[1,48]}),o($V3,[2,20]),o($V3,[2,21]),o($V3,[2,26]),o($V3,[2,27]),o($V3,[2,28]),o($V3,[2,29]),o($V3,[2,30]),o($V3,[2,31]),{15:[1,49]},{44:[1,50]},o($V3,[2,24]),o($V3,[2,25]),o($V0,[2,11]),o($V0,[2,12]),{17:[1,51],28:$V2},{16:52,27:19,29:$V1},{17:[1,53],28:$Vb,31:55,32:40,33:$V4,34:$V5,35:35,36:$V6,37:$V7,38:38,39:$V8,40:$V9,41:54,42:$Vc,43:$Va},{17:[1,57]},o($V0,[2,15]),{17:[1,58],28:$V2},o($V3,[2,32]),{17:[1,59],28:$Vd},o($Ve,[2,35]),o($Ve,[2,36]),o($V3,[2,38]),o($V0,[2,18]),o($V3,[2,33]),o($Ve,$Vb,{35:35,38:38,32:40,31:55,41:61,33:$V4,34:$V5,36:$V6,37:$V7,39:$V8,40:$V9,42:$Vc,43:$Va}),{17:[2,37],28:$Vd}];
    }

    performAction (yytext:string, yyleng:number, yylineno:number, yy:any, yystate:number /* action[1] */, $$:any /* vstack */, _$:any /* lstack */): any {
/* this == yyval */
          var $0 = $$.length - 1;
        switch (yystate) {
case 1:
return $$[$0-1]
break;
case 2:
this.$={contextDescription:[],emit:[],subscribe:[]}
break;
case 3:

           if($$[$0] !== '\n') {
              $$[$0-1]['contextDescription'].push($$[$0])
              if($$[$0].hasOwnProperty('eventName')) $$[$0-1]['emit'].push($$[$0])
              if($$[$0].hasOwnProperty('event')) $$[$0-1]['subscribe'].push($$[$0])
           }
        
break;
case 6:
this.$ = {initialState:true}
break;
case 10:
this.$ = {context:$$[$0]}
break;
case 11:
if($$[$0-1].length > $$[$0-4].length){
throw new Error(`The number of payload arguments must be equal to or less than the context argument`);}this.$ = {context:$$[$0-4], payload:$$[$0-1]}
break;
case 12:
if($$[$0-1].length > $$[$0-4].length) {throw new Error('The number of arguments in the previous context must be equal to or less than the number of arguments specified in the current context.')}this.$ = {context:$$[$0-4], prevContext:$$[$0-1]}
break;
case 13:
this.$ = $$[$0-1]
break;
case 14:
this.$ =  { eventName:$$[$0]}
break;
case 15:
this.$ = {
         eventName:$$[$0-4],
         payload: $$[$0-1]
         }
break;
case 16:
 this.$ =  {
          event:$$[$0-2],
          action: $$[$0]
       }
      
break;
case 17:
 this.$ =  {actionName:$$[$0]}
break;
case 18:
this.$ = {
    actionName:$$[$0-3],
    payload:$$[$0-1]
}
break;
case 19:
this.$ = [$$[$0]]; 
break;
case 20:
$$[$0-2].push($$[$0])
break;
case 21:
if($$[$0].hasOwnProperty('Property')){if($$[$0]['Property'] === $$[$0-2]){throw new Error('The property cannot match the target property')}};this.$ = {KeyItemDeclaration: {
TargetProperty:$$[$0-2], Expression:$$[$0]}}
break;
case 22:
this.$={KeyItemDeclaration:{TargetProperty:$$[$0].toLowerCase()}}
break;
case 24:
this.$ = {NumberDeclaration: Number($$[$0]), expressionType:ExpressionTypes.IntegerDeclaration}
break;
case 25:
this.$ = {NumberDeclaration: Number($$[$0])}
break;
case 26:
this.$ = {...$$[$0], expressionType:ExpressionTypes.Function}
break;
case 27:
this.$ = {Property:$$[$0], expressionType:ExpressionTypes.Property}
break;
case 28:
this.$ = {StringDeclaration:$$[$0].toString(), expressionType:ExpressionTypes.StringDeclaration}
break;
case 29:
this.$ = {ConstantReference:$$[$0], expressionType:ExpressionTypes.Constant}
break;
case 30:
this.$ = {ArrayDeclaration:[], expressionType:ExpressionTypes.ArrayDeclaration}
break;
case 32:
this.$ ={FunctionDeclaration:{FunctionName:$$[$0-2],Arguments:[]}}
break;
case 33:
this.$={FunctionDeclaration:{FunctionName:$$[$0-3].toLowerCase(), Arguments:[...$$[$0-1]]}}
break;
case 34:
this.$ = []
break;
case 35:
this.$=[$$[$0]]
break;
case 36:
this.$=[{Expression:{FunctionProperty:$$[$0],expressionType:ExpressionTypes.FunctionProperty}}]
break;
case 37:
this.$ = [...$$[$0-2],...$$[$0]]
break;
case 38:
 this.$ = $$[$0-1]
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
        /^(?:[\s]+)/i,
        /^(?:,)/i,
        /^(?:\))/i,
        /^(?:\()/i,
        /^(?:'[^\n#{()=><""]+')/i,
        /^(?:"[^\n#{()=><'']+")/i,
        /^(?:subscribe\/)/i,
        /^(?:[^/=>\s]+)/i,
        /^(?:=>[\s])/i,
        /^(?:<=[\s])/i,
        /^(?:-?[0-9]+\.[0-9]+)/i,
        /^(?:-?[0-9]+)/i,
        /^(?:[A-Za-z]{1,}[A-Za-z0-9\.]+(?=[(]))/i,
        /^(?:[A-Za-z]{1,}[A-Za-z0-9\.]+(?=[(]))/i,
        /^(?:[^=#{}][A-Za-z0-9]+)/i,
        /^(?:emit\/)/i,
        /^(?:[^()=<\n]+)/i,
        /^(?:\()/i,
        /^(?:#\{)/i,
        /^(?:\{)/i,
        /^(?:[a-zA-Z]\w+)/i,
        /^(?:[^(',)][A-Za-z_]+)/i,
        /^(?:=)/i,
        /^(?:[A-Za-z]{1,}[A-Za-z0-9\.]+(?=[(]))/i,
        /^(?:\})/i,
        /^(?:[^\}\()>\s\n<=]+)/i,
        /^(?:\$\()/i,
        /^(?:[A-Za-z_]+)/i,
        /^(?:\))/i,
        /^(?:\[\])/i
    ];
    conditions: any = {"leftArrow":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,17,19,20,21,26,28,31],"inclusive":true},"rightSideOperation":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,15,16,17,19,20,21,26,28,31],"inclusive":true},"KeyList":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,17,19,20,21,22,24,25,26,28,31],"inclusive":true},"ConstantState":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,17,19,20,21,26,28,29,30,31],"inclusive":true},"Prop":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,17,19,20,21,26,28,31],"inclusive":true},"Func":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,14,17,19,20,21,23,26,28,31],"inclusive":true},"Note":{"rules":[],"inclusive":false},"Payload":{"rules":[],"inclusive":false},"SubscribeStatement":{"rules":[9],"inclusive":false},"EmitStatement":{"rules":[18],"inclusive":false},"ActionStatement":{"rules":[27],"inclusive":false},"PayloadValue":{"rules":[],"inclusive":false},"PayloadStatement":{"rules":[],"inclusive":false},"ContextInitialValue":{"rules":[],"inclusive":false},"ContextStatement":{"rules":[],"inclusive":false},"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,10,11,12,13,17,19,20,21,26,28,31],"inclusive":true}}
    performAction (yy:any,yy_:any,$avoiding_name_collisions:any,YY_START:any): any {
          var YYSTATE=YY_START;
        switch($avoiding_name_collisions) {
    case 0:return 5;
      break;
    case 1:return 8;
      break;
    case 2:/* skip all whitespace */
      break;
    case 3:return 28
      break;
    case 4:this.popState();return 17
      break;
    case 5:return 15
      break;
    case 6:this.popState();yy_.yytext=yy_.yytext.slice(1,-1);return 37;
      break;
    case 7:this.popState();yy_.yytext=yy_.yytext.slice(1,-1);return 37;
      break;
    case 8:this.begin('SubscribeStatement'); return 23
      break;
    case 9:this.popState(); return 22
      break;
    case 10:this.popState();this.begin('ActionStatement'); return 24
      break;
    case 11:this.begin('KeyList');return 14 
      break;
    case 12:this.popState();return 34
      break;
    case 13:this.popState();return 33
      break;
    case 14:this.begin('Func');return 40;
      break;
    case 15:this.popState();this.begin('Func');return 40;
      break;
    case 16:this.popState();return 36
      break;
    case 17:this.begin('EmitStatement'); return 21
      break;
    case 18:this.popState(); return 22
      break;
    case 19:this.begin('KeyList');return 15
      break;
    case 20:this.begin('KeyList');return 20
      break;
    case 21:this.begin('KeyList');return 18
      break;
    case 22:return 29
      break;
    case 23:return 42
      break;
    case 24:this.begin('rightSideOperation');return 30
      break;
    case 25:yy_.yytext = yy_.yytext.toLowerCase();this.begin('Func');return 40;
      break;
    case 26:this.popState();return 19
      break;
    case 27:this.popState(); this.begin('KeyList');return 26
      break;
    case 28:this.popState(); this.begin('ConstantState'); return 43
      break;
    case 29: return 44
      break;
    case 30:this.popState(); return 17
      break;
    case 31:this.popState();return 39
      break;
        }
    }
}


