start -> csharp_statement;

csharp_statement ->
    namespace_declaration
  | using_declaration
  | class_declaration
  | interface_declaration
  | method_declaration
  | field_declaration
  | property_declaration
  | variable_declaration
  | constant_declaration
  | comment
  ;

namespace_declaration -> kw_namespace _ csharp_namespace_name _ "{" _ csharp_statement_list _ "}";

using_declaration -> kw_using _ csharp_namespace_name ";";

class_declaration -> class_modifiers _ kw_class _ csharp_type_name _ [":" _ base_type_list] _ "{" _ class_member_list _ "}";
class_modifiers -> [kw_public | kw_private | kw_protected | kw_internal | kw_abstract | kw_sealed | kw_static];
base_type_list -> csharp_type_name [_ "," _ csharp_type_name];
class_member_list -> [class_member [_ class_member]];
class_member -> method_declaration | field_declaration | property_declaration | constructor_declaration | comment;

interface_declaration -> kw_interface _ csharp_type_name _ "{" _ interface_member_list _ "}";
interface_member_list -> [interface_member [_ interface_member]];
interface_member -> method_declaration | property_declaration | comment;

method_declaration -> method_modifiers _ csharp_type _ csharp_method_name _ "(" _ parameter_list _ ")" _ method_body;
method_modifiers -> [kw_public | kw_private | kw_protected | kw_internal | kw_static | kw_virtual | kw_override | kw_abstract];
method_body -> "{" _ csharp_statement_list _ "}";
csharp_statement_list -> [csharp_statement [_ csharp_statement]];

constructor_declaration -> method_modifiers _ csharp_type_name _ "(" _ parameter_list _ ")" _ method_body;

field_declaration -> field_modifiers _ csharp_type _ csharp_identifier ";";
field_modifiers -> [kw_public | kw_private | kw_protected | kw_internal | kw_static | kw_readonly];

property_declaration -> property_modifiers _ csharp_type _ csharp_identifier _ "{" _ accessor_list _ "}";
property_modifiers -> [kw_public | kw_private | kw_protected | kw_internal | kw_static];
accessor_list -> accessor [_ accessor];
accessor -> kw_get _ method_body | kw_set _ method_body;

variable_declaration -> csharp_type _ csharp_identifier [_ "=" _ csharp_expression] ";";
constant_declaration -> kw_const _ csharp_type _ csharp_identifier _ "=" _ csharp_expression ";";

parameter_list -> [parameter [_ "," _ parameter]];
parameter -> csharp_type _ csharp_identifier;

csharp_type ->
    csharp_basic_type
  | csharp_type_name
  | csharp_array_type
  | csharp_generic_type
  ;

csharp_basic_type -> kw_int | kw_string | kw_bool | kw_double | kw_float | kw_char | kw_object | kw_void;
csharp_array_type -> csharp_type "[" "]";
csharp_generic_type -> csharp_type_name "<" _ csharp_type _ ">";

csharp_expression -> csharp_identifier | csharp_literal | csharp_method_call;
csharp_method_call -> csharp_identifier _ "(" _ argument_list _ ")";
argument_list -> [csharp_expression [_ "," _ csharp_expression]];

csharp_literal -> csharp_number_literal | csharp_string_literal | csharp_boolean_literal | csharp_null_literal;
csharp_number_literal -> { :class(number) numeric_literal } ;
csharp_string_literal -> { :class(string) "" | "hello" };
csharp_boolean_literal -> kw_true | kw_false;
csharp_null_literal -> kw_null;

csharp_identifier -> "x" | "y" | "z" | "result" | "data" | "input" | "err" | "val";
csharp_method_name -> "Main" | "Calculate" | "SetValue" | "GetResult" | "ToString" | "Equals" | "Dispose";
csharp_type_name -> csharp_primitive_type_name | generic_class_name ;
csharp_primitive_type_name -> "string" | "int" | "bool" | "double" | "float" ;
csharp_namespace_name -> "System" | "System.Collections.Generic" | "MyApp" | "MyApp.Models";

comment ->
  { :class(comment)
    ( "//" _ comment_text )
  | ( "/*" _ comment_text _ "*/" )
  }
  ;
