start -> golang_statement;

golang_statement ->
    package_declaration
  | import_declaration
  | function_declaration
  | struct_declaration
  | interface_declaration
  | variable_declaration
  | constant_declaration
  | type_declaration
  | { :if(comments) comment }
  ;

package_declaration -> kw_package _ golang_package_name;

import_declaration ->
    kw_import _ "(" _ import_list _ ")"
  | kw_import _ import_spec
  ;

import_list -> import_spec [_ import_spec];

import_spec ->
    golang_string_literal
  | golang_import_alias _ golang_string_literal
  ;

golang_import_alias -> golang_identifier;

function_declaration -> kw_func _ [receiver _] golang_function_name _ "(" _ parameter_list _ ")" _ [return_spec _] function_body;

receiver -> "(" _ [golang_identifier _] golang_type _ ")";

return_spec ->
    golang_type
  | "(" _ return_params _ ")"
  ;

return_params -> golang_type [_ "," _ golang_type];

function_body -> "{" _ golang_statement_list _ "}";

golang_statement_list -> [golang_statement [_ golang_statement]];

struct_declaration -> kw_type _ golang_type_name _ kw_struct _ "{" _ struct_field_list _ "}";

struct_field_list -> [struct_field [_ struct_field]];

struct_field -> golang_identifier_list _ golang_type [_ struct_tag];

struct_tag -> golang_string_literal;

golang_identifier_list -> golang_identifier [_ "," _ golang_identifier];

interface_declaration -> kw_type _ golang_type_name _ kw_interface _ "{" _ interface_method_list _ "}";

interface_method_list -> [interface_method_spec [_ interface_method_spec]];

interface_method_spec -> golang_method_name _ "(" _ parameter_list _ ")" _ [return_spec];

variable_declaration ->
    kw_var _ variable_spec
  | short_variable_declaration
  ;

variable_spec -> golang_identifier_list [_ golang_type] [_ "=" _ expression_list];

short_variable_declaration -> golang_identifier_list _ ":=" _ expression_list;

expression_list -> golang_expression [_ "," _ golang_expression];

constant_declaration -> kw_const _ constant_spec;

constant_spec -> golang_identifier_list [_ golang_type] _ "=" _ expression_list;

type_declaration -> kw_type _ type_spec;

type_spec -> golang_type_name _ golang_type;

parameter_list -> [parameter [_ "," _ parameter]];

parameter -> [golang_identifier_list _] golang_type;

golang_type ->
    golang_basic_type
  | golang_reference_type
  | golang_struct_type
  | golang_interface_type
  | golang_array_type
  | golang_slice_type
  | golang_map_type
  | golang_channel_type
  | golang_function_type
  ;

golang_basic_type ->
    kw_bool
  | kw_byte
  | kw_int
  | kw_uint
  | kw_rune
  | kw_string
  | { :if(numbers) kw_int8 }
  | { :if(numbers) kw_int16 }
  | { :if(numbers) kw_int32 }
  | { :if(numbers) kw_int64 }
  | { :if(numbers) kw_uint8 }
  | { :if(numbers) kw_uint16 }
  | { :if(numbers) kw_uint32 }
  | { :if(numbers) kw_uint64 }
  | { :if(numbers) kw_float32 }
  | { :if(numbers) kw_float64 }
  | { :if(numbers) kw_complex64 }
  | { :if(numbers) kw_complex128 }
  ;

golang_reference_type -> "*" _ golang_type;
golang_struct_type -> kw_struct _ "{" _ struct_field_list _ "}";
golang_interface_type -> kw_interface _ "{" _ interface_method_list _ "}";
golang_array_type -> "[" _ golang_expression _ "]" _ golang_type;
golang_slice_type -> "[]" _ golang_type;
golang_map_type -> kw_map _ "[" _ golang_type _ "]" _ golang_type;
golang_channel_type ->
    kw_chan _ golang_type
  | "<-" _ kw_chan _ golang_type
  | kw_chan _ "<-" _ golang_type
  ;
golang_function_type -> kw_func _ "(" _ parameter_list _ ")" _ [return_spec];

golang_expression ->
    golang_identifier
  | golang_literal
  | golang_function_call
  | unary_expression
  | binary_expression
  ;

unary_expression -> unary_operator _ golang_expression;
unary_operator -> "&" | "*" | "+" | "-" | "!" | "^" | "<-";

binary_expression -> golang_expression _ binary_operator _ golang_expression;
binary_operator -> "+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "<<" | ">>" | "&&" | "||" | "==" | "!=" | "<" | "<=" | ">" | ">=";

golang_literal ->
    { :class(keyword) "nil" }
  | ( kw_true | kw_false )
  | { :if(numbers) golang_number_literal }
  | { :if(strings) golang_string_literal }
  ;

golang_number_literal -> { :class(number) numeric_literal } ;
golang_string_literal -> { :class(string) "\"" generic_string_content "\"" } ;

golang_function_call -> golang_identifier _ "(" _ argument_list _ ")";
argument_list -> [golang_expression [_ "," _ golang_expression]];

golang_identifier -> "x" | "y" | "z" | "result" | "data" | "input" | "err" | "val";
golang_function_name -> "main" | "calculate" | "setValue" | "getResult" | "init" | "String" | "Error";
golang_type_name -> golang_primitive_type_name | generic_class_name ;
golang_primitive_type_name -> "string" | "int" | "bool" | "float64" ;
golang_package_name -> "main" | "fmt" | "strings" | "math" | "os" | "io" | "net/http" | "encoding/json";
golang_method_name -> "Read" | "Write" | "String" | "Error" | "Close" | "Parse";

comment ->
  { :class(comment)
    ( "//" _ comment_text )
  | ( "/*" _ comment_text _ "*/" )
  }
  ;
