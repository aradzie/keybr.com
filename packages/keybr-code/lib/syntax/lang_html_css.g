start -> html | css ;

html ->
    html_tag " " html_entity " "
    html_tag " " html_entity " "
    html_tag
    ;

html_tag -> html_self_closing_tag ;

html_self_closing_tag -> "<" html_ident html_attr_list "/>" ;

html_attr_list ->
    " " html_id_attr
    " " html_class_attr
    " " html_style_attr
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

css -> css_rule " " css_rule " " css_rule ;

css_rule -> css_selector " { " css_property_list " }" ;

css_selector ->
  ( "#" css_class_id | "." css_class_id )
  [ ( " > " | " + " ) ( "#" css_class_id | "." css_class_id ) ]
  ;

css_property_list -> css_property "; " css_property "; " css_property ";" ;

css_property -> css_property_name ": " css_property_value ;

css_property_name ->
    "color"
  | "box-sizing"
  | "width"
  | "min-width"
  | "max-width"
  | "inline-size"
  | "min-inline-size"
  | "max-inline-size"
  | "height"
  | "min-height"
  | "max-height"
  | "block-size"
  | "min-block-size"
  | "max-block-size"
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

css_var_value -> "var(" css_var_id [ ", " css_color_value ] ")" ;

css_url_value -> "url(https://test/img.jpg)" ;

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
  ;

css_class_id ->
    "main"
  | "nav"
  | "header"
  | "footer"
  | "aside"
  | "article"
  ;
