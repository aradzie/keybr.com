start -> python_statement ;

python_statement ->
    python_function_definition
  | python_class_definition
  | python_assign
  | python_return
  | { :if(comments) python_comment }
  ;

python_function_definition -> kw_def _ python_function_name "(" python_arguments ")" { :if(types) _ "->" _ python_type } ":";

python_class_definition -> kw_class _ python_class_name [ "(" python_class_name ")" ] ":" ;

python_assign -> python_variable_name [ "[" python_literal "]" ] _ "=" _ python_expression ;

python_return -> kw_return _ python_expression ;

python_arguments -> python_argument [ "," _ python_argument ] ;

python_argument -> python_variable_name { :if(types) ":" _ python_type } ;

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
    ( python_expression _ kw_is _ [ kw_not _ ] kw_None )
  | ( kw_not _ python_expression )
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
  | kw_int
  | kw_str
  | kw_bool
  | kw_float
  | kw_None
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
  | [ kw_not _ ] kw_in
  | "^"
  ;

python_list_definition -> "[" python_expression [ "," _ python_expression ] "]" ;

python_dict_definition -> "{" python_dict_key_value_pair [ "," _ python_dict_key_value_pair ] "}" ;

python_dict_key_value_pair -> python_literal ":" _ python_expression ;

python_literal ->
    { :if(numbers) python_string_literal | python_number_literal }
    { :if(!numbers) python_string_literal }
  ;

python_string_literal ->
    { :class(string) ("\"" python_string_value "\"") }
  | { :class(string) ("'" python_string_value "'" ) }
  | { :class(string) ("\"\"\"" python_string_value "\"\"\"") }
  | { :class(string) ("'''" python_string_value "'''" ) }
  ;

python_variable_name -> generic_variable_name ;

python_function_name ->
    "__call__"
  | "__enter__"
  | "__eq__"
  | "__exit__"
  | "__getattr__"
  | "__getitem__"
  | "__init__"
  | "__iter__"
  | "__len__"
  | "__ne__"
  | "__new__"
  | "__repr__"
  | "__setattr__"
  | "__setitem__"
  | "__str__"
  | generic_function_name
  ;

python_class_name -> generic_class_name ;

python_string_value ->
    "."
  | "abc"
  | "channels_first"
  | "channels_last"
  | "constant"
  | "dtype"
  | "int"
  | "jax"
  | "name"
  | "same"
  | "shape"
  | "tensorflow"
  | "torch"
  | "uvw"
  | "valid"
  | "x"
  | "xyz"
  | "zeros"
  ;

python_number_literal ->
  { :class(number)
    "1"
  | "0.001"
  | "0.01"
  | "0.1"
  | "0.2"
  | "0.25"
  | "0.3"
  | "0.4"
  | "0.5"
  | "0.6"
  | "0.7"
  | "0.8"
  | "0.9"
  | "1.5"
  | "10"
  | "100"
  | "1000"
  | "1024"
  | "11"
  | "12"
  | "128"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "1e-05"
  | "1e-06"
  | "2"
  | "20"
  | "200"
  | "24"
  | "25"
  | "255"
  | "256"
  | "3"
  | "30"
  | "32"
  | "4"
  | "40"
  | "5"
  | "50.0"
  | "512"
  | "6"
  | "60"
  | "64"
  | "7"
  | "8"
  | "9"
  }
  ;

python_comment ->
  { :class(comment)
    "# type: ignore"
  | "# TODO: fix"
  | "# TODO: implement"
  | "#!/usr/bin/env python"
  }
  ;
