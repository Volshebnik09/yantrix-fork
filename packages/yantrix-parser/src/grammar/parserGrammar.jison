%lex

%options case-insensitive
// Special states for recognizing aliases
%token note of statement
%x ContextStatement
%x ContextInitialValue

%x PayloadStatement
%x PayloadValue
%x  ActionStatement
%x EmitStatement
%x SubcribeStatement
%x Payload
%x Note
%s Func
%s Prop
%s Constant
%s KeyList
%s rightSideOperation
%s leftArrow
%%





<<EOF>>                              return 'EOF';
[\r\n]+                              return 'NewLine';
[\s]+                                /* skip all whitespace */
','                    {return ','}
'+INITIAL'                           return 'InitialState';
'note'                               {return 'note'}
')'                                  {return ')'}
'('                                  {return '('}
'left'                               {return 'left'}
'right'                              {return 'right'}
'end'                                {return 'end'}
\'[^\n#{()=><"]+\'                   {return 'StringDeclaration'}
'of'\s                               {this.begin('Note'); return 'of'}
<Note>[^\n#{()=><]+                  {this.popState(); return 'StateID'}
'subscribe/'                         {this.begin('SubcribeStatement'); return 'subscribe/'}
<SubcribeStatement>[^/=>\s]+         {this.popState(); return 'EventName'}

'<='[\s]                             {this.begin('leftArrow');return '<=' }
<leftArrow>'('                       {this.begin('KeyList');return'('}

'emit/'                              {this.begin('EmitStatement'); return 'emit/'}
<EmitStatement>[^()=<\n]+            {this.popState(); return 'EventName'}

'=>'[\s]                             {this.begin('ActionStatement'); return '=>'}
'#{'                                 {this.begin('KeyList');return '#{'}
<rightSideOperation>[A-Za-z]{1,}[A-Za-z0-9\.]+(?=[(])                                                              {this.popState();this.begin('Func');return 'FunctionName';}
<Func>')'                                  {this.popState(); return ')'}

<KeyList>[^()=,][A-Za-z]+             {yytext = yytext.toLowerCase();return 'TargetProperty'}
<rightSideOperation>[^()=,][A-Za-z]+   {this.popState();return 'Property'}
<KeyList>'='                          {this.begin('rightSideOperation');return '='}
<KeyList>[A-Za-z]{1,}[A-Za-z0-9\.]+(?=[(])                                                              {yytext = yytext.toLowerCase();this.begin('Func');return 'FunctionName';}
<Func>')'                     {this.popState(); return ')'}
<Func>[A-Za-z_]+         {this.popState();return 'PropertyArgument'}
'}'                                  {this.popState();return '}'}
<ActionStatement>[^\}\()>\s\n<=]+    {this.popState(); this.begin('KeyList');return 'ActionName'}


[0-9]+'.'[0-9]+        {return 'decimalLiteral'}
[0-9]+                 {return 'integerLiteral'}
'$('                   {this.begin('Constant'); return '$('}
<Constant>[A-Za-z_]+   { return 'ConstantReference'}
<Constant>')'          {this.popState(); return ')'}
'[]'                   {return 'Array'}






/lex

%start start

%% /* language grammar */

/* $$ is the value of the symbol being evaluated (= what is to the left of the : in the rule */
start
	: document 'EOF' {return $1}
	;

document
	: /* empty */ {$$={contextDescription:[],emit:[],subscribe:[]}}
	| document line {
           if($2 !== '\n') {
              if($2.hasOwnProperty('context')) $1['contextDescription'].push($2)
              if($2.hasOwnProperty('eventName')) $1['emit'].push($2)
              if($2.hasOwnProperty('event')) $1['subscribe'].push($2)
           }
        }
	;
line
	: statements 
	| 'NewLine'
	;
statements 
        :  InitialState  {$$ = {initialState:true}}
        |  ContextDefinitions  
        |  EventEmitStatement 
        |  SubscribeStatement 
        ;
                
ContextDefinitions
        : ContextStatement {$$ = {...$1}}
        | ContextStatement '<=' '(' KeyList')' {$$ = {...$1,...$4}}
        ; 
ContextStatement
        : '#{' KeyList'}' {$$ = { context: $2} }
        | '#{' KeyList'=' KeyList'}' {
console.log($4)
$$ = {
 context:$2,
 initialValue:$4
}}
        ;
EventEmitStatement
        : 'emit/' EventName  {$$ =  { eventName:$2}}
        | 'emit/' EventName '<=' '(' KeyList  ')' {$$ = {
         eventName:$2,
         payload: $5
         }}
        ;
SubscribeStatement
       : 'subscribe/'  EventName  '=>' ActionStatement { $$ =  {
          event:$2,
          action: $4
       }
      }
       ;
ActionStatement
       : ActionName { $$ =  {actionName:$1}} }
       | ActionName '(' KeyList  ')' {$$ = {action: {
    actionName:$1,
    payload:$3
}}} ;

KeyList  : KeyList | KeyItem ',' KeyList | KeyItem ;
KeyItem  : TargetProperty '=' Expression {$$ = {KeyItemDeclaration: {
TargetProperty:$1, Expression:$3}}} | TargetProperty {$$={KeyItemDeclaration:{TargetProperty:$1.toLowerCase()}}};
Expression 
          : FunctionOperator
          | Property {$$ = {Property:$1}}
          | StringDeclaration {$$ = {StringDeclaration:$1}}
          | Array {$$ = {ArrayDeclaration:$1}}
          | Constant
          ;
FunctionOperator 
      : FunctionName '(' ')'  {$$ ={FunctionDeclaration:{FunctionName:$1,Arguments:[]}}}
      | FunctionName '(' Arguments ')' {$$={FunctionDeclaration:{FunctionName:$1.toLowerCase(), Arguemnts:[...$3]}}}
      ; 
Arguments 
        : /* empty */ {$$ = []} 
        | Ident {$$=[$1]}
        | FunctionOperator {$$=[$1]}
        | Arguments ',' Arguments {$$ = [...$1,...$3]}
        ;
Ident 
   : PropertyArgument {$$={FunctionProperty:$1}}
   | decimalLiteral {$$={decimalLiteral :$1}}
   | integerLiteral {$$={integerLiteral :$1}}
   | StringDeclaration  {$$={StringDeclaration:$1}}
   | Constant
   ;
Constant : '$(' ConstantReference ')'{ $$ = {ConstantReference: $2}};
