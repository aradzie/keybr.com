start -> php_statement ;

start_laravel -> laravel_statement ;

php_statement ->
    php_variable_declaration
  | php_array_declaration
  | php_foreach_statement
  | php_if_statement
  | php_function_declaration
  | php_class_method_call
  | php_arrow_function
  | php_namespace_statement
  | php_use_statement
  ;

laravel_statement ->
    laravel_route
  | laravel_eloquent
  | laravel_blade
  | laravel_request
  | php_statement
  ;

/* PHP Variable Declarations */
php_variable_declaration -> php_variable _ "=" _ php_expression ";" ;

php_array_declaration -> php_variable _ "=" _ php_array_literal ";" ;

php_array_literal ->
    "[" php_array_elements "]"
  | "[" php_assoc_elements "]"
  ;

php_array_elements -> [ php_expression [ "," _ php_expression ] ] ;

php_assoc_elements -> php_assoc_pair [ "," _ php_assoc_pair ] ;

php_assoc_pair -> php_string_literal _ "=>" _ php_expression ;

/* PHP Expressions */
php_expression ->
    php_variable
  | php_literal
  | php_array_literal
  | php_class_method_call
  | php_arrow_function
  | php_null_coalesce
  | php_nullsafe_call
  ;

php_null_coalesce -> php_variable _ "??" _ php_expression ;

php_nullsafe_call -> php_variable "?->" php_method_name "()" ;

/* PHP Literals */
php_literal ->
    php_string_literal
  | php_number_literal
  | php_boolean_literal
  | kw_null
  ;

php_string_literal -> { :class(string) "\"" php_string_content "\"" } ;

php_string_content -> "value" | "key" | "name" | "id" | "email" | "status" | "active" ;

php_number_literal -> { :class(number) numeric_literal } ;

php_boolean_literal -> kw_true | kw_false ;

/* PHP Variables */
php_variable -> "$" php_var_name ;

php_var_name ->
    "arr"
  | "data"
  | "id"
  | "item"
  | "key"
  | "name"
  | "result"
  | "user"
  | "val"
  | "value"
  | "x"
  | "this"
  ;

/* PHP Control Structures */
php_foreach_statement -> kw_foreach _ "(" php_variable _ kw_as _ php_variable _ "=>" _ php_variable ")" _ "{" _ "}" ;

php_if_statement -> kw_if _ "(" php_condition ")" _ "{" _ php_statement _ "}" ;

php_condition -> php_variable _ php_comparison_op _ php_expression ;

php_comparison_op -> "===" | "!==" | "==" | "!=" | ">" | "<" | ">=" | "<=" ;

/* PHP Functions */
php_function_declaration -> kw_function _ php_func_name "(" php_param_list ")" _ "{" _ kw_return _ php_expression ";" _ "}" ;

php_arrow_function -> kw_fn "(" php_param_list ")" _ "=>" _ php_expression ;

php_param_list -> [ php_variable [ "," _ php_variable ] ] ;

php_func_name -> "getValue" | "process" | "handle" | "create" | "update" | "delete" ;

/* PHP OOP */
php_class_method_call ->
    php_this_call
  | php_static_call
  | php_object_call
  ;

php_this_call -> "$this->" php_property_name [ _ "=" _ php_expression ] ;

php_static_call -> php_class_name "::" php_method_name "()" ;

php_object_call -> php_variable "->" php_method_name "(" [ php_expression ] ")" ;

php_property_name -> "name" | "value" | "data" | "id" | "status" ;

php_method_name -> "get" | "set" | "find" | "create" | "update" | "delete" | "getName" | "getValue" ;

php_class_name -> "User" | "Post" | "Model" | "Controller" | "Request" ;

/* PHP Namespace & Use */
php_namespace_statement -> kw_namespace _ php_namespace_path ";" ;

php_use_statement -> kw_use _ php_namespace_path ";" ;

php_namespace_path -> php_namespace_segment [ "\\" php_namespace_segment ] ;

php_namespace_segment -> "App" | "Controller" | "Model" | "Http" | "Request" | "Service" ;

/* Laravel Routes */
laravel_route -> "Route::" laravel_http_method "(" php_string_literal "," _ laravel_route_action ")" ;

laravel_http_method -> "get" | "post" | "put" | "patch" | "delete" ;

laravel_route_action -> "[" php_class_name "::class," _ php_string_literal "]" ;

/* Laravel Eloquent */
laravel_eloquent ->
    laravel_eloquent_query
  | laravel_eloquent_create
  | laravel_eloquent_update
  ;

laravel_eloquent_query -> php_class_name "::" laravel_query_method "(" [ php_expression ] ")" [ "->" laravel_chain_method "(" [ php_expression ] ")" ] ;

laravel_query_method -> "where" | "find" | "findOrFail" | "first" | "firstOrFail" | "all" | "get" ;

laravel_chain_method -> "where" | "orderBy" | "with" | "paginate" | "get" | "first" | "count" ;

laravel_eloquent_create -> php_class_name "::create(" php_array_literal ")" ;

laravel_eloquent_update -> php_variable "->update(" php_array_literal ")" ;

/* Laravel Blade */
laravel_blade ->
    laravel_blade_echo
  | laravel_blade_directive
  ;

laravel_blade_echo -> "{{" _ php_variable "->" php_property_name _ "}}" ;

laravel_blade_directive ->
    "@if(" php_variable ")"
  | "@foreach(" php_variable _ kw_as _ php_variable ")"
  | "@extends('" laravel_view_name "')"
  | "@section('" laravel_section_name "')"
  | "@yield('" laravel_section_name "')"
  | "@include('" laravel_view_name "')"
  | "@csrf"
  | "@method('" laravel_http_method_upper "')"
  ;

laravel_view_name -> "layouts.app" | "partials.header" | "components.alert" ;

laravel_section_name -> "content" | "title" | "scripts" | "styles" ;

laravel_http_method_upper -> "PUT" | "PATCH" | "DELETE" ;

/* Laravel Request */
laravel_request -> php_variable "->" laravel_request_method "(" [ php_string_literal ] ")" ;

laravel_request_method -> "validate" | "validated" | "input" | "has" | "file" ;
