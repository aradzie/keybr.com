start -> java_statement ;

java_statement ->
    class_declaration
  | interface_declaration
  | enum_declaration
  | method_signature
  | variable_declaration
  | { :if(comments) comment }
  ;

class_declaration -> kw_class _ java_type_name _ "{" _ class_body _ "}" ;

class_body -> class_member [ _ ";" _ class_member ] ;

class_member ->
    ( [ access_modifier _ ] [ kw_static _ ] [ kw_final _ ] )
    ( method_signature | variable_declaration )
  ;

method_signature -> return_type _ java_method_name "(" parameter_list ")" ;

return_type -> kw_void | java_type ;

parameter_list -> [ parameter [ _ "," _ parameter ] ] ;

parameter -> java_type _ java_variable_name ;

variable_declaration -> java_type _ java_variable_name [ _ "=" _ java_expression ] ";" ;

java_type ->
    kw_boolean
  | kw_byte
  | kw_char
  | kw_double
  | kw_float
  | kw_int
  | kw_long
  | kw_short
  | kw_string
  | kw_void
  | java_reference_type
  ;

java_reference_type -> class_type | interface_type | array_type ;

class_type -> java_type_name ;

interface_type -> kw_interface _ java_type_name ;

array_type -> java_type "[]" ;

java_expression ->
    java_variable_name
  | java_literal
  | java_method_call
  ;

java_literal ->
    kw_null
  | ( kw_true | kw_false )
  | { :if(numbers) java_number_literal }
  | { :if(strings) java_string_literal }
  ;

java_number_literal -> { :class(number) numeric_literal } ;

java_string_literal -> { :class(string) "\"" generic_string_content "\"" } ;

java_method_call -> java_variable_name "(" argument_list ")" ;

argument_list -> [ java_expression [ _ "," _ java_expression ] ] ;

java_variable_name -> "x" | "y" | "z" | "result" | "data" | "input" ;

java_method_name -> "main" | "calculate" | "setValue" | "getResult" ;

interface_declaration -> kw_interface _ java_type_name _ "{" _ interface_body _ "}" ;

interface_body -> interface_method_signature [ _ ";" _ interface_method_signature ] ;

interface_method_signature -> [ kw_static _ ] return_type _ java_method_name "(" parameter_list ")" ;

enum_declaration -> kw_enum _ java_type_name _ "{" _ enum_member_list _ "}" ;

enum_member_list -> enum_member [ _ "," _ enum_member ] ;

enum_member -> java_variable_name [ _ "=" _ java_expression ] ;

access_modifier -> kw_public | kw_private | kw_protected ;

java_type_name -> generic_class_name ;

comment ->
  { :class(comment)
    ( "//" _ comment_text )
  | ( "/*" _ comment_text _ "*/" )
  }
  ;
