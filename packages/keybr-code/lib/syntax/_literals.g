numeric_literal ->
    integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_dec_literal
  | integer_hex_literal_2
  | integer_hex_literal_4
  | float_dec_literal
  | float_dec_literal
  | float_dec_literal
  | float_dec_literal
  | float_sci_literal
  ;

integer_bin_literal -> "0b" bin_digit [ bin_digit [ bin_digit [ bin_digit ] ] ] ;
integer_bin_literal_4 -> "0b" bin_digit bin_digit bin_digit bin_digit ;
integer_bin_literal_8 -> "0b" bin_digit bin_digit bin_digit bin_digit bin_digit bin_digit bin_digit bin_digit ;
integer_oct_literal -> "0o" oct_digit [ oct_digit [ oct_digit [ oct_digit [ oct_digit ] ] ] ] ;
integer_oct_literal_3 -> "0o" oct_digit oct_digit oct_digit ;
integer_hex_literal -> "0x" hex_digit [ hex_digit [ hex_digit [ hex_digit ] ] ] ;
integer_hex_literal_2 -> "0x" hex_digit hex_digit ;
integer_hex_literal_4 -> "0x" hex_digit hex_digit hex_digit hex_digit ;
integer_hex_literal_8 -> "0x" hex_digit hex_digit hex_digit hex_digit hex_digit hex_digit hex_digit hex_digit ;
integer_dec_literal ->
    "0"
  | dec_start [ dec_digit [ dec_digit ] ]
  | dec_start [ dec_digit [ dec_digit ] ]
  | dec_start [ dec_digit [ dec_digit ] ]
  | dec_start [ dec_digit [ dec_digit ] ]
  | dec_start [ dec_digit [ dec_digit ] ]
  ;
integer_dec_literal_3 -> dec_start dec_digit dec_digit ;
integer_dec_literal_6 -> dec_start dec_digit dec_digit dec_digit dec_digit dec_digit ;

float_dec_literal -> integer_dec_literal "." dec_digit [ dec_digit [ dec_digit ] ] ;
float_sci_literal -> float_dec_literal "e" [ "+" | "-" ] dec_digit [ dec_digit [ dec_digit ] ] ;

bin_digit -> "0" | "1" ;
oct_digit -> "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" ;
hex_digit -> "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" ;
dec_digit -> "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
dec_start -> "1" | "1" | "1" | "1" | "1" |"2" | "2" | "2" | "3" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;

generic_string_content ->
    ""
  | "\\n"
  | "\\t"
  | "a"
  | "b"
  | "c"
  | "x"
  | "y"
  | "z"
  | "error"
  | "success"
  | "pending"
  | "data"
  | "key"
  | "value"
  | "Debug"
  | "Error"
  | "Failure"
  | "Info"
  | "Input"
  | "Key"
  | "Message"
  | "Name"
  | "OK"
  | "Output"
  | "Result"
  | "Success"
  | "Test"
  | "Value"
  | "Warning"
  | "config.json"
  | "config.toml"
  | "session_id"
  | "user_token"
  | "api_key"
  ;

generic_char_content ->
    "_"
  | "\\n"
  | "\\t"
  | "a"
  | "b"
  | "c"
  | "x"
  | "y"
  | "z"
  ;
