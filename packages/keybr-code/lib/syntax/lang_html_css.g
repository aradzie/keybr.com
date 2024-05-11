start -> html | css ;

html -> html_tag _ html_entity ;

html_tag -> html_self_closing_tag ;

html_self_closing_tag -> "<" html_ident html_attr_list "/>" ;

html_attr_list ->
    _ html_id_attr
    _ html_class_attr
    _ html_style_attr
    ;

html_id_attr -> "id" "=" "\"" css_class_id "\"" ;

html_class_attr -> "class" "=" "\"" css_class_id "\"" ;

html_style_attr -> "style" "=" "\"" css_property "\"" ;

html_ident ->
  [ "ns:" | "my-" ]
  ( "p" | "div" | "span" | "em" | "strong" )
  ;

html_entity ->
    "&nbsp;"
  | "&lt;"
  | "&gt;"
  | "&amp;"
  | "&apos;"
  ;

css -> css_rule ;

css_rule -> css_selector " { " css_property_list " }" ;

css_selector ->
  ( css_id_selector | css_class_selector )
  [ css_pseudo_selector ]
  [ ( " > " | " + " ) ( css_id_selector | css_class_selector ) [ css_pseudo_selector ] ]
  ;

css_id_selector -> "#" css_class_id ;

css_class_selector -> "." css_class_id ;

css_pseudo_selector -> css_pseudo_class | css_pseudo_element ;

css_pseudo_class -> ":" css_pseudo_class_name ;

css_pseudo_class_name ->
    "dir" "(" ( "ltr" | "rtl" ) ")"
  | "hover"
  | "active"
  | "focus"
  | "valid"
  | "invalid"
  | "required"
  | "optional"
  ;

css_pseudo_element -> "::" css_pseudo_element_name ;

css_pseudo_element_name ->
    "before"
  | "after"
  | "backdrop"
  ;

css_property_list -> css_property "; " css_property "; " css_property ";" ;

css_property -> css_property_name ": " css_property_value ;

css_property_name ->
    "color"
  | "box-sizing"
  | [ ( "min" | "max" ) "-" ] ( "width" | "height" )
  | [ ( "min" | "max" ) "-" ] ( "inline" | "block" ) "-" "size"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "inset" [ "-" ( "inline" | "block" ) [ "-" ( "start" | "end" ) ] ]
  | "flex" [ "-" ( "direction" | "grow" | "shrink" | "basis" | "flow" | "wrap" ) ]
  ;

css_property_value ->
    css_std_value
  | css_var_value
  | css_url_value
  | css_color_value
  ;

css_std_value ->
    "initial"
  | "inherit"
  | "revert"
  | "unset"
  ;

css_var_value -> "var(" css_var_id [ "," _ css_color_value ] ")" ;

css_url_value -> "url" "(" ( css_image_url | css_font_url ) ")" ;

css_image_url -> ( "logo" | "bg" | "img" | "hero" | "footer" ) ( ".jpg" | ".png" | ".svg" ) ;

css_font_url -> ( "mono" | "serif" | "sans-serif" ) ( ".woff" | ".ttf" ) ;

css_var_id ->
    "--"
  ( "color"
  | "x"
  | "y"
  )
  ;

css_color_value ->
    "#aaa"
  | "#bbb"
  | "#ccc"
  | "#ddd"
  | "#eee"
  | "#fff"
  | css_named_color
  ;

css_class_id ->
    "main"
  | "nav"
  | "header"
  | "footer"
  | "aside"
  | "article"
  | ( "row" | "col" ) "-" ( "sm" | "md" | "lg" )
  | ( "bg" | "color" ) "-" css_named_color
  ;

css_named_color ->
    "black"
  | "silver"
  | "gray"
  | "white"
  | "red"
  | "green"
  | "blue"
  ;
