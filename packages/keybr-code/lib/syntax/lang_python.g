start -> python_statement ;

python_statement ->
    python_function_definition
  | python_class_definition
  | python_assign
  | python_return
  | python_comment
  ;

python_function_definition -> "def" _ python_function_name "(" python_arguments ")" [ _ "->" _ python_type ] ":";

python_class_definition -> "class" _ python_class_name [ "(" python_class_name ")" ] ":" ;

python_assign -> python_variable_name [ "[" python_literal "]" ] _ "=" _ python_expression ;

python_return -> "return" _ python_expression ;

python_arguments -> python_argument [ "," _ python_argument ] ;

python_argument -> python_variable_name [ ":" _ python_type ] ;

python_expression ->
    python_literal
  | python_unary_operation
  | python_binary_operation
  | ( "(" python_expression ")" )
  | python_list_definition
  | python_dict_definition
  | python_function_call
  ;

python_unary_operation ->
    ( python_expression _ "is" _ [ "not" _ ] "None" )
  | ( "not" _ python_expression )
  | ( "~" python_expression )
  ;

python_binary_operation -> python_expression _ python_binary_operator _ python_expression ;

python_function_call -> python_function_name "(" python_function_arg [ "," _ python_function_arg ] ;

python_function_arg -> python_variable_name "=" python_expression ;

python_type ->
    python_primitive_type
  | ( "list[" python_primitive_type "]" )
  | ( "dict[" python_primitive_type "," _ python_primitive_type "]" )
  | ( "tuple[" python_primitive_type "," _ "...]" )
  | ( python_primitive_type _ "|" _ python_primitive_type )
  ;

python_primitive_type ->
    python_class_name
  | "int"
  | "str"
  | "bool"
  | "float"
  | "None"
  ;

python_binary_operator ->
    "+"
  | "-"
  | "*"
  | "/"
  | "//"
  | "%"
  | "**"
  | "@"
  | "&"
  | "|"
  | ">"
  | "<"
  | ">="
  | "<="
  | "=="
  | "in"
  | ("not" _ "in")
  | "^"
  ;

python_list_definition -> "[" python_expression [ "," _ python_expression ] "]" ;

python_dict_definition -> "{" python_dict_key_value_pair [ "," _ python_dict_key_value_pair ] "}" ;

python_dict_key_value_pair -> python_literal ":" _ python_expression ;

python_literal -> python_string_literal | python_number_literal ;

python_string_literal ->
    ("\"" python_string_value "\"")
  | ("'" python_string_value "'" )
  | ("\"\"\"" python_string_value "\"\"\"")
  | ("'''" python_string_value "'''" )
  ;

python_variable_name ->
    "i"
  | "x"
  | "_"
  | "y"
  | "v"
  | "result"
  | "out"
  | "config"
  | "inputs"
  | "k"
  | "output"
  | "batch_size"
  | "__all__"
  | "value"
  | "n"
  | "j"
  | "expected"
  | "data"
  | "outputs"
  | "dtype"
  | "s"
  | "b"
  | "a"
  | "key"
  | "res"
  | "name"
  | "op"
  | "width"
  | "img"
  | "mask"
  | "height"
  | "B"
  | "shape"
  | "f"
  | "c"
  | "df"
  | "h"
  | "m"
  | "w"
  | "t"
  | "index"
  | "values"
  | "d"
  | "H"
  | "input_shape"
  | "root"
  | "count"
  | "actual"
  | "W"
  | "C"
  ;

python_function_name ->
    "__init__"
  | "call"
  | "get_config"
  | "__repr__"
  | "main"
  | "build"
  | "__call__"
  | "from_config"
  | "__getitem__"
  | "__len__"
  | "get"
  | "__iter__"
  | "dfs"
  | "run"
  | "__str__"
  | "__eq__"
  | "add"
  | "test_correctness"
  | "update"
  | "create"
  | "append"
  | "__enter__"
  | "__exit__"
  | "load"
  | "__getattr__"
  | "pop"
  | "constants"
  | "wrapper"
  | "__setitem__"
  | "insert"
  | "reverse"
  | "preprocess_input"
  | "__ne__"
  | "__new__"
  | "shape"
  | "remove"
  | "find"
  | "identity"
  | "serialize"
  | "size"
  | "copy"
  | "floor"
  | "reset_state"
  | "func"
  | "inverse_transform"
  | "configure"
  | "save"
  | "update_state"
  | "dtype"
  | "inverse"
  ;

python_class_name ->
    "Node"
  | "Graph"
  | "TestSuite"
  | "MyModel"
  | "Create"
  | "Cols"
  | "Rows"
  | "MyDense"
  | "Attention"
  | "Load"
  | "Save"
  | "TreeNode"
  | "Dog"
  | "Cat"
  | "JDBC"
  | "Constants"
  | "Model"
  | "Variable"
  | "CustomModel"
  | "ActivityRegularizationLayer"
  ;

python_string_value ->
    ""
  | "."
  | "__main__"
  | "float32"
  | ")"
  | "channels_last"
  | "*"
  | "int32"
  | "tensorflow"
  | ", "
  | "1"
  | "name"
  | "B"
  | "int"
  | "torch"
  | "a"
  | "valid"
  | "zeros"
  | "dtype"
  | "channels_first"
  | "2"
  | "x"
  | "/"
  | "same"
  | "constant"
  | "int64"
  | "_"
  | "jax"
  | "shape"
  | "0"
  | "^[a-z][a-z0-9_]*$"
  | "^[0-9]+$"
  | "^[A-Z]+$"
  | "^([0-9a-f]+) (.*)$"
  | ";"
  | "\\n"
  | "\\t"
  | "\\r\\n"
  | "C:\\\\"
  ;

python_number_literal ->
    "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "10"
  | "6"
  | "8"
  | "0.5"
  | "7"
  | "9"
  | "100"
  | "32"
  | "16"
  | "20"
  | "0.1"
  | "12"
  | "0.001"
  | "0.2"
  | "15"
  | "11"
  | "64"
  | "0.0001"
  | "0.01"
  | "128"
  | "256"
  | "1000"
  | "0.3"
  | "24"
  | "30"
  | "13"
  | "0.9"
  | "50.0"
  | "0.8"
  | "255"
  | "14"
  | "0.25"
  | "1e-06"
  | "0.4"
  | "512"
  | "1024"
  | "40"
  | "1.5"
  | "17"
  | "25"
  | "0.7"
  | "200"
  | "10000"
  | "60"
  | "1e-05"
  ;

python_comment ->
    "# type: ignore"
  | "# TODO: fix!"
  | "# TODO: fix?"
  | "# ?"
  | "# !"
  | "#!/usr/bin/env python"
  | "# noqa"
  | "# -*- coding: utf-8 -*-"
  | "# TODO: implement"
  | "# ``H x W``"
  | "# `1 x 1`"
  | "# ;"
  ;

