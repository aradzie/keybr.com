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
csharp_number_literal -> "0" | "1" | "2" | "42" | "100" | "200" | "404";
xcsharp_string_literal -> "" | "hello";
csharp_boolean_literal -> "true" | "false";
csharp_null_literal -> "null";

csharp_identifier -> "x" | "y" | "z" | "result" | "data" | "input" | "err" | "val";
csharp_method_name -> "Main" | "Calculate" | "SetValue" | "GetResult" | "ToString" | "Equals" | "Dispose";
csharp_type_name -> "string" | "int" | "bool" | "double" | "float" | "CustomType" | "Exception" | "Stream" | "List";
csharp_namespace_name -> "System" | "System.Collections.Generic" | "MyApp" | "MyApp.Models";

comment -> single_line_comment | multi_line_comment;
single_line_comment -> "//" _ comment_text;
multi_line_comment -> "/*" _ comment_text _ "*/";
comment_text -> "Method to calculate the result" | "TODO: Refactor" | "This is a constructor" | "Class documentation" | "Returns value with error" | "Implements interface" | "Deprecated: Use alternative method";

kw_namespace -> "namespace";
kw_using -> "using";
kw_class -> "class";
kw_interface -> "interface";
kw_public -> "public";
kw_private -> "private";
kw_protected -> "protected";
kw_internal -> "internal";
kw_abstract -> "abstract";
kw_sealed -> "sealed";
kw_static -> "static";
kw_virtual -> "virtual";
kw_override -> "override";
kw_readonly -> "readonly";
kw_const -> "const";
kw_get -> "get";
kw_set -> "set";
kw_int -> "int";
kw_string -> "string";
kw_bool -> "bool";
kw_double -> "double";
kw_float -> "float";
kw_char -> "char";
kw_object -> "object";
kw_void -> "void";
