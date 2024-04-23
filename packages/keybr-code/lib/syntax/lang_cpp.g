start -> c_func ;

start_fproto -> c_func_proto ";" ;

start_stmt -> c_stmt ;

c_func -> c_func_proto _ c_func_body ;

c_func_proto -> c_type _ c_func_id "(" c_param_list ")" ;

c_type -> ( "char" | "int" | "long" | "short" | "void" ) [ "*" [ "*" ] ] ;

c_param_list -> c_param [ "," _ c_param [ "," _ c_param ] ] ;

c_param -> c_type _ [ "&" ] c_var_id [ "[]" ] ;

c_arg_list -> c_arg [ "," _ c_arg [ "," _ c_arg ] ] ;

c_arg -> c_expr ;

c_func_body -> "{" _ c_stmt _ "}" ;

c_stmt -> ( c_var_stmt | c_call_stmt | c_if_stmt | c_return_stmt ) ;

c_var_stmt -> c_type _ c_var_id _ "=" _ c_expr ";" ;

c_call_stmt -> c_func_id "(" c_arg_list ")" ";" ;

c_if_stmt -> "if" _ "(" c_expr ")" _ "{" _ c_call_stmt _ "}" ;

c_return_stmt -> "return " c_expr ";" ;

c_expr -> c_unary_exp | c_binary_exp | c_ternary_exp ;

c_unary_exp -> ( "(*" c_var_id ")" | c_var_id ) ( "--" | "++" | "->" c_var_id ) ;

c_binary_exp -> "(" c_unary_exp ")"
  (
    _ "+" _ c_var_id
  | _ "-" _ c_var_id
  | _ "*" _ c_var_id
  | _ "/" _ c_var_id
  | _ "|" _ c_var_id
  | _ "&" _ c_var_id
  | _ "<<" _ c_var_id
  | _ ">>" _ c_var_id
  | _ "==" _ c_var_id
  | _ "!=" _ c_var_id
  | _ ">=" _ c_var_id
  | _ "<=" _ c_var_id
  )
  ;

c_ternary_exp -> c_unary_exp _ "?" _ c_unary_exp _ ":" _ c_unary_exp ;

c_func_id -> [ "std::" ] c_func_id_suffix ;

c_func_id_suffix ->
    "abort"
  | "bsearch"
  | "calloc"
  | "exit"
  | "fclose"
  | "fflush"
  | "fopen"
  | "free"
  | "malloc"
  | "memcmp"
  | "memcpy"
  | "memmove"
  | "memset"
  | "printf"
  | "qsort"
  | "realloc"
  | "strcat"
  | "strcmp"
  | "strcmp"
  | "strcpy"
  | "strlen"
  | "strlen"
  ;

c_var_id ->
    "a" [ "_" ( "b" | "c" | "d" ) ]
  | "b" [ "_" ( "a" | "c" | "d" ) ]
  | "c" [ "_" ( "a" | "b" | "d" ) ]
  | "d" [ "_" ( "a" | "b" | "c" ) ]
  ;
