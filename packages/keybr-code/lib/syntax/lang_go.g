start -> go_statement ;

start_capitalization -> go_statement ;

start_numbers -> go_statement ;

start_capitalization_and_numbers -> go_statement ;

go_statement ->
    go_function_definition
  | go_struct_definition
  | go_assign
  | go_return
  | go_comment
  ;

go_function_definition -> "func" _ go_function_name "(" [ go_parameters ] ")" [ _ go_return_type ] "{" ;

go_struct_definition -> "type" _ go_struct_name _ "struct" _ "{" ;

go_assign ->
      "var" _ go_variable_name [ _ go_type ] _ "=" _ go_expression
    | go_variable_name _ ":=" _ go_expression
    ;

go_return -> "return" _ go_expression ;

go_parameters -> go_parameter [ "," _ go_parameter ] ;

go_parameter -> go_variable_name _ go_type ;

go_expression ->
    go_literal
  | go_unary_operation
  | go_binary_operation
  | "(" go_expression ")"
  | go_array_definition
  | go_map_definition
  | go_function_call
  ;

go_unary_operation ->
    "!" go_expression
  | "-" go_expression
  | "&" go_expression
  | "*" go_expression
  ;

go_binary_operation -> go_expression _ go_binary_operator _ go_expression ;

go_function_call -> go_function_name "(" [ go_arguments ] ")" ;

go_arguments -> go_expression [ "," _ go_expression ] ;

go_return_type -> go_type ;

go_type ->
    go_primitive_type
  | "*" go_type
  | "[]" go_type
  | "map[" go_type "]" go_type
  | "chan" _ go_type
  | "interface{}"
  ;

go_primitive_type ->
    go_struct_name
  | "int"
  | "int32"
  | "int64"
  | "uint"
  | "float32"
  | "float64"
  | "bool"
  | "string"
  | "byte"
  | "rune"
  | "error"
  ;

go_binary_operator ->
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
  | "&"
  | "|"
  | "^"
  | "<<"
  | ">>"
  ;

go_array_definition ->
    "[]" go_type "{" go_expression [ "," _ go_expression ] "}"
  ;

go_map_definition ->
    "map[" go_type "]" go_type "{" go_map_key_value_pairs "}"
  ;

go_map_key_value_pairs ->
    go_expression ":" _ go_expression [ "," _ go_expression ":" _ go_expression ]
  ;

go_literal ->
    go_string_literal
  | go_number_literal
  | go_boolean_literal
  | go_rune_literal
  ;

go_string_literal -> "\"" go_string_value "\"" ;

go_rune_literal -> "'" go_rune_value "'" ;

go_boolean_literal -> "true" | "false" ;

go_variable_name ->
    "x"
  | "y"
  | "z"
  | "i"
  | "j"
  | "k"
  | "value"
  | "result"
  | "data"
  | "index"
  | "count"
  | "name"
  | "size"
  | "buffer"
  | "ptr"
  | "slice"
  | "map"
  | "item"
  | "key"
  | "val"
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

go_function_name ->
    "main"
  | "New"
  | "Len"
  | "Append"
  | "Delete"
  | "Insert"
  | "Remove"
  | "Get"
  | "Set"
  | "Update"
  | "Compute"
  | "Process"
  | "Run"
  | "Execute"
  | "Handle"
  | "Read"
  | "Write"
  | "Calculate"
  | "Draw"
  | "Render"
  | "Add"
  | "Subtract"
  | "Multiply"
  | "Divide"
  | "Print"
  | "Printf"
  ;

go_struct_name ->
    "Point"
  | "Node"
  | "Tree"
  | "List"
  | "Map"
  | "Slice"
  | "Option"
  | "Result"
  | "Buffer"
  | "Config"
  | "Rectangle"
  | "Circle"
  | "Color"
  | "Person"
  | "User"
  | "Message"
  | "Command"
  | "Request"
  | "Response"
  ;

go_string_value ->
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
  | "Go"
  | "Sample"
  ;

go_rune_value ->
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

go_number_literal ->
    "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "10"
  | "100"
  | "1000"
  | "0.0"
  | "0.5"
  | "1.5"
  | "2.5"
  | "3.14"
  | "42"
  | "255"
  | "256"
  | "1024"
  | "1e6"
  ;

go_comment -> "//" go_comment_text ;

go_comment_text ->
  "TODO: Implement error handling"
| "FIXME: Possible data race"
| "Goroutine synchronization"
| "Defer resource cleanup"
| "Handle context cancellation"
| "Optimize for concurrent access"
| "Use sync.Pool for performance"
| "Implement io.Reader interface"
| "Docker container configuration"
| "gRPC service definition"
| "Kubernetes deployment spec"
| "Unmarshal JSON response"
| "Middleware chain setup"
;
