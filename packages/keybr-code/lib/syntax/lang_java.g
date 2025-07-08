start -> java_statement ;

java_statement ->
    class_declaration
  | interface_declaration
  | enum_declaration
  | method_signature
  | variable_declaration
  | comment
  ;

class_declaration -> kw_class _ java_type_name _ "{" _ class_body _ "}" ;

class_body -> class_member [ _ ";" _ class_member ] ;

class_member ->
    [ access_modifier _ ]
    [ kw_static _ ]
    [ kw_final _ ]
    [ [ kw_private | kw_public | kw_protected ] _ ]
    method_signature
  | variable_declaration
  ;

method_signature ->
    [ access_modifier _ ]
    [ kw_static _ ]
    [ kw_final _ ]
    return_type _ java_method_name "(" _ parameter_list ")" ;

return_type -> kw_void | java_type ;

parameter_list -> [ parameter [ _ "," _ parameter ] ] ;

parameter -> java_type _ java_variable_name ;

variable_declaration ->
    [ kw_final _ ]
    java_type _ java_variable_name [ _ "=" _ java_expression ] ";" ;

java_type -> kw_int | kw_string | kw_boolean | kw_double | kw_float | kw_char | kw_long | kw_short | kw_byte | kw_void | java_reference_type ;

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
    java_number_literal
  | java_string_literal
  | java_boolean_literal
  ;

java_number_literal -> "0" | "1" | "2" | "42" | "100" | "200" | "404" ;

java_string_literal -> "\"" "\"" ;

java_boolean_literal -> "true" | "false" ;

java_method_call -> java_variable_name "(" _ argument_list ")" ;

argument_list -> [ java_expression [ _ "," _ java_expression ] ] ;

java_variable_name -> "x" | "y" | "z" | "result" | "data" | "input" ;

java_method_name -> "main" | "calculate" | "setValue" | "getResult" ;

java_type_name -> "String" | "Integer" | "Double" | "Float" | "Object" | "CustomType" ;

interface_declaration -> kw_interface _ java_type_name _ "{" _ interface_body _ "}" ;

interface_body -> interface_method_signature [ _ ";" _ interface_method_signature ] ;

interface_method_signature -> [ kw_static _ ] return_type _ java_method_name "(" _ parameter_list ")" ;

enum_declaration -> kw_enum _ java_type_name _ "{" _ enum_member_list _ "}" ;

enum_member_list -> enum_member [ _ "," _ enum_member ] ;

enum_member -> java_variable_name [ _ "=" _ java_expression ] ;

access_modifier -> kw_public | kw_private | kw_protected ;

comment ->
    single_line_comment
  | multi_line_comment
  | javadoc_comment
  ;

single_line_comment -> "//" _ comment_text ;

multi_line_comment -> "/*" _ comment_text _ "*/" ;

javadoc_comment -> "/**" _ comment_text _ "*/" ;

comment_text ->
    "Method to calculate the result"
  | "TODO: Improve performance"
  | "This is a constructor"
  | "@param description"
  | "@returns description"
  | "@throws exception"
  | "@deprecated Use alternative method"
  ;

kw_class -> "class" ;
kw_interface -> "interface" ;
kw_enum -> "enum" ;
kw_static -> "static" ;
kw_final -> "final" ;
kw_private -> "private" ;
kw_public -> "public" ;
kw_protected -> "protected" ;
kw_void -> "void" ;
kw_int -> "int" ;
kw_string -> "String" ;
kw_boolean -> "boolean" ;
kw_double -> "double" ;
kw_float -> "float" ;
kw_char -> "char" ;
kw_long -> "long" ;
kw_short -> "short" ;
kw_byte -> "byte" ;
