start -> rust_statement ;

rust_statement ->
    rust_function_definition
  | rust_function_definition
  | rust_struct_definition
  | rust_struct_definition
  | rust_assign
  | rust_assign
  | rust_return
  | rust_return
  | { :if(comments) rust_comment }
  ;

rust_function_definition -> kw_fn _ rust_function_name "(" rust_arguments ")" [ _ "->" _ rust_type ] "{" ;

rust_struct_definition -> [ kw_pub _ ] kw_struct _ rust_struct_name _ "{" ;

rust_assign -> kw_let _ rust_variable_name [ ":" _ rust_type ] _ "=" _ rust_expression ";" ;

rust_return -> kw_return _ rust_expression ";" ;

rust_arguments -> rust_argument [ "," _ rust_argument ] ;

rust_argument -> rust_variable_name ":" _ rust_type ;

rust_expression ->
    rust_literal
  | rust_unary_operation
  | rust_binary_operation
  | "(" rust_expression ")"
  | rust_array_definition
  | rust_struct_instantiation
  | rust_function_call
  ;

rust_unary_operation ->
    "!" rust_expression
  | "-" rust_expression
  | "*" rust_expression
  | "&" rust_expression
  ;

rust_binary_operation -> rust_expression _ rust_binary_operator _ rust_expression ;

rust_function_call -> rust_function_name "(" [ rust_function_args ] ")" ;

rust_function_args -> rust_expression [ "," _ rust_expression ] ;

rust_type ->
    rust_primitive_type
  | "&" [ kw_mut _ ] rust_type
  | rust_type _ "<" rust_type [ "," _ rust_type ] ">"
  | { :if(numbers) "[" rust_type ";" _ rust_number_literal "]" }
  | "(" rust_type [ "," _ rust_type ] ")"
  ;

rust_primitive_type ->
    rust_struct_name
  | { :if(numbers) kw_u32 }
  | { :if(numbers) kw_u64 }
  | { :if(numbers) kw_i32 }
  | { :if(numbers) kw_i64 }
  | { :if(numbers) kw_f32 }
  | { :if(numbers) kw_f64 }
  | kw_usize
  | kw_isize
  | kw_bool
  | kw_char
  | kw_str
  | "String"
  ;

rust_binary_operator ->
    "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "&&"
  | "||"
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "<<"
  | ">>"
  | "&"
  | "|"
  | "^"
  ;

rust_array_definition ->
    "[" rust_expression [ "," _ rust_expression ] "]"
  | { :if(numbers) "[" rust_expression ";" _ rust_number_literal "]" }
  ;

rust_struct_instantiation ->
    rust_struct_name _ "{" _ rust_struct_fields _ "}" ;

rust_struct_fields ->
    rust_field_assignment [ "," _ rust_field_assignment ] ;

rust_field_assignment ->
    rust_variable_name ":" _ rust_expression ;

rust_literal ->
    ( kw_true | kw_false )
  | { :if(strings) rust_char_literal }
  | { :if(strings) rust_string_literal }
  | { :if(numbers) rust_number_literal }
  ;

rust_char_literal -> { :class(string) "'" generic_char_content "'" } ;

rust_string_literal -> { :class(string) "\"" generic_string_content "\"" } ;

rust_number_literal -> { :class(number) numeric_literal } ;

rust_variable_name -> generic_variable_name ;

rust_function_name -> generic_function_name ;

rust_struct_name -> generic_class_name ;

rust_comment ->
  { :class(comment)
    ( "//" _ comment_text )
  | ( "//!" _ comment_text )
  | ( "/*" _ comment_text _ "*/" )
  | ( "/*!" _ comment_text _ "*/" )
  }
  ;
