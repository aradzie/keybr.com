start -> html ;

html -> html_tag " " html_tag " " html_tag ;

html_tag -> html_opening_tag | html_self_closing_tag | html_closing_tag ;

html_opening_tag -> "<" html_ident [ html_attr_list ] ">" ;

html_self_closing_tag -> "<" html_ident [ html_attr_list] "/>" ;

html_closing_tag -> "</" html_ident ">" ;

html_attr_list -> html_attr [ html_attr ] ;

html_attr -> " " html_attr_name [ "=" "\"" html_attr_value "\"" ] ;

html_attr_name -> "class" | "style" | "color" ;

html_attr_value -> "checked" | "bold" | "#fff" | "&amp;" ;

html_ident ->
    [ "ns:" | "my-" ]
    ( "html" | "body" | "p" | "div" | "span" | "em" | "strong" | "a" )
  ;
