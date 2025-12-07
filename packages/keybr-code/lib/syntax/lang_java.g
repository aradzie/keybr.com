start -> statement ;

statement ->
    class_declaration
  | interface_declaration
  | enum_declaration
  | { :if(comments) comment }
  ;

class_declaration -> [ annotations _ ] [ ( kw_final | kw_abstract ) _ ] kw_class _ class_name [ generic_signature ] _ "{" _ class_body _ "}" ;

class_body -> class_field_member [ _ class_field_member ] _ class_method_member [ _ class_method_member ] ;

class_field_member -> [ annotations _ ] [ access_modifier _ ] [ kw_static _ ] [ kw_final _ ] type _ variable_name [ _ "=" _ expression ] ";" ;

class_method_member -> [ annotations _ ] [ access_modifier _ ] [ kw_static _ ] [ kw_final _ ] method_signature ( ( _ method_body ) | ";" ) ;

interface_declaration -> kw_interface _ class_name [ generic_signature ] _ "{" _ interface_body _ "}" ;

interface_body -> interface_member [ _ interface_member [ _ interface_member ] ] ;

interface_member -> method_signature ";" ;

enum_declaration -> kw_enum _ class_name _ "{" _ enum_member_list _ "}" ;

enum_member_list -> enum_member [ "," _ enum_member [ "," _ enum_member ] ] ;

enum_member -> variable_name ;

method_signature -> return_type _ method_name  "(" [ parameter_list ] ")" ;

parameter_list -> parameter [ "," _ parameter  [ "," _ parameter ] ] ;

parameter -> type _ variable_name ;

method_body -> "{" [ _ kw_return _ expression ";" _ ] "}" ;

access_modifier -> kw_public | kw_private | kw_protected ;

class_name -> generic_class_name ;

return_type ->
    kw_void
  | type
  ;

type ->
    primitive_type
  | reference_type
  | "T"
  ;

primitive_type ->
    kw_boolean
  | kw_byte
  | kw_char
  | kw_double
  | kw_float
  | kw_int
  | kw_long
  | kw_short
  | "String"
  | "Object"
  ;

reference_type -> class_name [ "[]" ] ;

expression ->
    var_exp
  | call_exp
  | new_exp
  | literal
  ;

var_exp -> variable_name [ { :if(numbers) "[" number_literal "]" } ] ;

call_exp -> [ "System" "." ] method_name "(" [ argument_list ] ")" ;

new_exp -> "new" _ class_name "(" [ argument_list ] ")" ;

argument_list -> expression [ "," _ expression ] [ "," _ expression ] ;

literal ->
    kw_null
  | ( kw_true | kw_false )
  | { :if(numbers) number_literal }
  | { :if(strings) string_literal }
  ;

number_literal -> { :class(number) numeric_literal } ;

string_literal -> { :class(string) "\"" generic_string_content "\"" } ;

generic_signature -> "<" "T" [ _ kw_extends _ class_name [ "<T>" ] ] ">" ;

annotations -> annotation_name [ { :if(strings) "(" string_literal ")" } ] ;

annotation_name ->
    "@After"
  | "@Before"
  | "@Component"
  | "@Controller"
  | "@Entity"
  | "@Get"
  | "@Id"
  | "@Inject"
  | "@Named"
  | "@NotNull"
  | "@Param"
  | "@Path"
  | "@Post"
  | "@PostConstruct"
  | "@PreDestroy"
  | "@Query"
  | "@Scope"
  | "@Service"
  | "@Singleton"
  | "@Test"
  ;

variable_name ->
    "body"
  | "component"
  | "connection"
  | "container"
  | "data"
  | "db"
  | "headers"
  | "input"
  | "query"
  | "request"
  | "response"
  | "result"
  | "service"
  | "x"
  | "y"
  | "z"
  ;

method_name ->
    "main"
  | "process"
  | "handle"
  | "accept"
  | "update"
  | "serialize"
  | "send"
  | "setValue"
  | "getResult"
  ;

comment ->
  { :class(comment)
    ( "//" _ comment_text )
  | ( "/*" _ comment_text _ "*/" )
  }
  ;
