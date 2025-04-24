start -> ts_statement ;

ts_statement ->
    ts_interface_declaration
  | ts_type_declaration
  | ts_enum_declaration
  | ts_namespace_declaration
  | ts_function_signature
  | ts_variable_declaration
  | { :if(comments) ts_comment }
  ;

ts_interface_declaration -> kw_interface _ ts_type_name _ ts_type_parameters _ "{" _ ts_interface_body _ "}" ;

ts_interface_body -> ts_property_signature [ ";" _ ts_property_signature ] ";" ;

ts_property_signature ->
    [ ts_access_modifier _ ]
    [ kw_readonly _ ]
    ts_property_name
    [ "?" ] ":" _ ts_type ;

ts_type_declaration -> kw_type _ ts_type_name _ ts_type_parameters _ "=" _ ts_type ";" ;

ts_type ->
    ts_primitive_type
  | ts_union_type
  | ts_intersection_type
  | ts_array_type
  | ts_tuple_type
  | ts_function_type
  | ts_object_type
  | ts_mapped_type
  | ts_conditional_type
  | ts_type_reference
  | "(" ts_type ")"
  ;

ts_primitive_type ->
    kw_string
  | kw_number
  | kw_boolean
  | kw_null
  | kw_undefined
  | kw_void
  | kw_any
  | kw_never
  | kw_unknown
  | kw_object
  | kw_symbol
  | kw_bigint
  ;

ts_union_type -> ts_type _ "|" _ ts_type [ _ "|" _ ts_type ] ;

ts_intersection_type -> ts_type _ "&" _ ts_type [ _ "&" _ ts_type ] ;

ts_array_type -> ts_type "[]" ;

ts_tuple_type -> "[" ts_type [ "," _ ts_type ] "]" ;

ts_function_type -> "(" ts_parameter_list ")" _ "=>" _ ts_type ;

ts_object_type -> "{" _ ts_object_member_list _ "}" ;

ts_object_member_list -> ts_object_member [ ";" _ ts_object_member ] ;

ts_object_member ->
    [ kw_readonly _ ]
    ts_property_name
    [ "?" ] ":" _ ts_type ;

ts_mapped_type ->
    "{" _
    [ "+" | "-" ] [ kw_readonly ] _
    "[" ts_type_parameter _ kw_in _ ts_type "]"
    [ "+" | "-" ] [ "?" ] ":" _ ts_type _
    "}" ;

ts_conditional_type ->
    ts_type _ kw_extends _ ts_type _
    "?" _ ts_type _
    ":" _ ts_type ;

ts_type_reference -> ts_type_name [ "<" ts_type_argument_list ">" ] ;

ts_type_argument_list -> ts_type [ "," _ ts_type ] ;

ts_enum_declaration ->
    [ kw_const _ ]
    kw_enum _ ts_enum_name _
    "{" _ ts_enum_member_list _ "}" ;

ts_enum_member_list -> ts_enum_member [ "," _ ts_enum_member ] ;

ts_enum_member ->
    ts_identifier
    [ "=" _ ( ts_number_literal | ts_string_literal ) ] ;

ts_namespace_declaration ->
    kw_namespace _ ts_namespace_name _
    "{" _ ts_namespace_body _ "}" ;

ts_namespace_body -> [ ts_statement ] ;

ts_function_signature ->
    kw_function _ ts_function_name _
    ts_type_parameters _
    "(" ts_parameter_list ")" _
    [ ":" _ ts_type ] ";" ;

ts_variable_declaration ->
    [ kw_declare _ ]
    [ kw_const | kw_let ] _
    ts_identifier ":" _ ts_type ";" ;

ts_parameter_list ->
    [ ts_parameter [ "," _ ts_parameter ] ] ;

ts_parameter ->
    [ ts_rest_parameter | ts_optional_parameter | ts_required_parameter ] ;

ts_required_parameter ->
    ts_identifier ":" _ ts_type ;

ts_optional_parameter ->
    ts_identifier "?" ":" _ ts_type ;

ts_rest_parameter ->
    "..." ts_identifier ":" _ ts_array_type ;

ts_type_parameters ->
    [ "<" ts_type_parameter_list ">" ] ;

ts_type_parameter_list ->
    ts_type_parameter [ "," _ ts_type_parameter ] ;

ts_type_parameter ->
    ts_identifier
    [ _ kw_extends _ ts_type ]
    [ _ "=" _ ts_type ] ;

ts_property_name ->
    ts_identifier
  | ts_string_literal ;

ts_access_modifier ->
    kw_public
  | kw_private
  | kw_protected ;

ts_type_name -> ts_identifier ;
ts_enum_name -> ts_identifier ;
ts_namespace_name -> ts_identifier ;
ts_function_name -> ts_identifier ;

ts_identifier ->
    "T"
  | "U"
  | "V"
  | "K"
  | "P"
  | "R"
  | "Props"
  | "State"
  | "Config"
  | "Options"
  | "Result"
  | "UserData"
  | "ApiResponse"
  | "Callback"
  | "Handler"
  | "EventData"
  | "Partial"
  | "Readonly"
  | "Record"
  | "Pick"
  | "Omit"
  | "Exclude"
  | "Extract"
  | "NonNullable"
  | "Required"
  | "ReturnType"
  | "InstanceType"
  | "Parameters"
  | "ConstructorParameters"
  | "ThisType"
  ;

ts_number_literal -> { :class(number) "0" | "1" | "2" | "42" | "100" | "200" | "404" | "500" } ;

ts_string_literal -> { :class(string) "\"error\"" | "\"success\"" | "\"pending\"" | "\"data\"" | "\"key\"" | "\"value\"" } ;

ts_comment ->
  { :class(comment)
    ( "//" _ ts_comment_text )
  | ( "/*" _ ts_comment_text _ "*/" )
  | ( "/**" _ ts_comment_text _ "*/" )
  }
;

ts_comment_text ->
  "Type definition"
| "Interface for API response"
| "Generic type parameter"
| "Utility type"
| "TODO: Add validation"
| "FIXME: Handle edge case"
| "@param description"
| "@returns description"
| "@template T The type parameter"
| "@deprecated Use alternative instead"
;
