start -> rust_statement ;

rust_statement ->
    rust_function_definition
  | rust_struct_definition
  | rust_assign
  | rust_return
  | { :if(comments) rust_comment }
  ;

rust_function_definition -> "fn" _ rust_function_name "(" rust_arguments ")" [ _ "->" _ rust_type ] "{" ;

rust_struct_definition -> [ "pub" _ ] "struct" _ rust_struct_name _ "{" ;

rust_assign -> "let" _ rust_variable_name [ ":" _ rust_type ] _ "=" _ rust_expression ";" ;

rust_return -> "return" _ rust_expression ";" ;

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
  | "&" [ "mut" _ ] rust_type
  | rust_type _ "<" rust_type [ "," _ rust_type ] ">"
  | "[" rust_type ";" _ rust_number_literal "]"
  | "(" rust_type [ "," _ rust_type ] ")"
  ;

rust_primitive_type ->
    rust_struct_name
  | "u32"
  | "u64"
  | "i32"
  | "i64"
  | "f32"
  | "f64"
  | "usize"
  | "isize"
  | "bool"
  | "char"
  | "str"
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
  | "[" rust_expression ";" _ rust_number_literal "]"
  ;

rust_struct_instantiation ->
    rust_struct_name _ "{" _ rust_struct_fields _ "}" ;

rust_struct_fields ->
    rust_field_assignment [ "," _ rust_field_assignment ] ;

rust_field_assignment ->
    rust_variable_name ":" _ rust_expression ;

rust_literal ->
    rust_string_literal
  | rust_number_literal
  | rust_boolean_literal
  | rust_char_literal
  ;

rust_string_literal -> "\"" rust_string_value "\"" ;

rust_char_literal -> "'" rust_char_value "'" ;

rust_boolean_literal -> "true" | "false" ;

rust_variable_name ->
    "x"
  | "y"
  | "z"
  | "i"
  | "j"
  | "k"
  | "val"
  | "res"
  | "data"
  | "idx"
  | "count"
  | "logger"
  | "size"
  | "buffer"
  | "ptr"
  | "vec"
  | "map"
  | "item"
  | "key"
  | "ctx"
  | "left"
  | "right"
  | "flag"
  | "temp"
  | "num"
  | "sum"
  | "acc"
  | "iter"
  | "len"
  ;

rust_function_name ->
    "main"
  | "new"
  | "len"
  | "push"
  | "pop"
  | "insert"
  | "remove"
  | "get"
  | "set"
  | "update"
  | "compute"
  | "process"
  | "run"
  | "execute"
  | "handle"
  | "read"
  | "write"
  | "calculate"
  | "draw"
  | "render"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "print"
  | "println"
  ;

rust_struct_name ->
    "Config"
  | "Client"
  | "Server"
  | "Connection"
  | "Request"
  | "Response"
  | "Error"
  | "State"
  | "Builder"
  | "Handler"
  | "Worker"
  | "Parser"
  | "Encoder"
  | "Decoder"
  | "Person"
  | "Pool"
  | "Cache"
  | "Queue"
  | "Context"
  | "Manager"
  ;

rust_string_value ->
    ""
  | "Hello, world!"
  | "Error"
  | "OK"
  | "Test"
  | "Name"
  | "Value"
  | "Message"
  | "Key"
  | "Input"
  | "Output"
  | "Data"
  | "Result"
  | "Success"
  | "Failure"
  | "Warning"
  | "Info"
  | "Debug"
  | "Rust"
  | "Sample"
  ;

rust_char_value ->
    "a"
  | "b"
  | "c"
  | "x"
  | "y"
  | "z"
  | "0"
  | "1"
  | "2"
  | "\\n"
  | "\\t"
  | "\\r"
  ;

rust_number_literal ->
    "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "10"
  | "100"
  | "123i32"
  | "0.0"
  | "0.5"
  | "1.5"
  | "2.5_f64"
  | "3.14f32"
  | "42"
  | "255"
  | "256"
  | "1024"
  | "1_000_000"
  ;

rust_comment ->
  { :class(comment)
    ( "//" _ rust_comment_text )
  | ( "//!" _ rust_comment_text )
  | ( "/*" _ rust_comment_text _ "*/" )
  | ( "/*!" _ rust_comment_text _ "*/" )
  }
;

rust_comment_text ->
  "TODO: Implement error handling"
| "FIXME: Potential race condition"
| "Unsafe: Raw pointer manipulation"
| "Optimize memory allocation"
| "Ensure thread safety"
| "Zero-copy deserialization"
| "Handle lifetime issues"
| "Implement Drop trait"
| "Lock-free data structure"
| "FFI: C interop"
| "Benchmark performance"
| "Async/await transformation"
| "Check for integer overflow"
;
