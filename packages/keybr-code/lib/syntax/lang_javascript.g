start -> js_variable_statement ;

js_variable_statement -> ( "let" | "const" ) _ js_var_id _ "=" _ js_primary_exp ";" ;

js_primary_exp ->
    js_literal
  | js_array_literal
  | js_object_literal
  | js_function_exp
  | js_call_exp
  ;

js_array_literal -> "[" js_primary_exp [ "," _ js_primary_exp ] "]" ;

js_object_literal -> "{" _ js_property_name ":" _ js_property_value _ "}" ;

js_property_name -> js_id | "[" js_id "]" ;

js_property_value -> js_primary_exp ;

js_function_exp -> js_function_args _ "=>" _ js_primary_exp ;

js_function_args -> js_single_arg | js_multi_args ;

js_single_arg -> js_arg ;

js_multi_args -> ( "(" js_arg "," _ js_arg [ "," _ js_tail_arg ] ")" ) ;

js_arg -> js_var_id [ _ "=" _ js_primary_exp ] ;

js_tail_arg -> "..." js_var_id ;

js_call_exp -> js_func_id "(" js_primary_exp [ "," _ js_primary_exp ] ")" ;

js_var_id -> js_id ;

js_func_id ->
    "all"
  | "entries"
  | "every"
  | "filter"
  | "find"
  | "has"
  | "includes"
  | "keys"
  | "length"
  | "map"
  | "size"
  | "values"
  ;

js_id ->
    "a"
  | "b"
  | "c"
  | "x"
  | "y"
  | "i"
  | "j"
  | "char"
  | "end"
  | "err"
  | "event"
  | "id"
  | "item"
  | "key"
  | "length"
  | "line"
  | "list"
  | "map"
  | "name"
  | "path"
  | "pos"
  | "start"
  | "str"
  | "text"
  | "value"
  ;

js_literal -> "null" | "true" | "false" | js_string_literal | js_template_literal ;

js_string_literal -> "\"a\"" | "\"b\"" | "\"c\"" ;

js_template_literal -> "`abc=${" js_id "}`" ;
