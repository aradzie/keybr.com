start -> "/" [ "^" ] item [ "$" ] "/" [ "i" ] [ "g" ] ;

item -> ( group | union ) quantifier ;

group -> "(" [ group_name | "?:" ] group_item ")" ;

group_name -> "?<" ( "name" | "item" | "email" | "url" | "param" | "id" ) ">" ;

group_item -> char_class | char ;

union -> union_item "|" union_item ;

union_item -> char_class | char ;

char_class -> "[" [ "^" ] [ "-" ] [ "." ] [ escaped_char ] ( "a-z" | "a-f" ) "]" ;

char ->
    "."
  | "\\d"
  | "\\s"
  | literal_char [ literal_char [ literal_char] ]
  | escaped_char
  | unicode_char
  ;

literal_char ->
    "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  ;

escaped_char ->
    "\\t"
  | "\\n"
  ;

unicode_char -> ( "\\p" | "\\P" ) "{" unicode_category "}" ;

unicode_category -> "L" | "Lu" | "Ll" | "Lt" | "N" | "Z" ;

quantifier -> ( "*" | "+" | "?" ) ;
