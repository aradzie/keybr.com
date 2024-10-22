// npx peggy -m -o lib/parser.js --format es lib/parser.peggy

Start
  = rules:Rule* _ { return rules; }

Rule
  = _ name:Name _ "->" _ p:Alt _ ";" { return { name, p }; }

Name
  = [a-zA-Z0-9][-._a-zA-Z0-9]* { return text(); }

Alt
  = head:Seq tail:( _ "|" _ t:Seq { return t; } )*
  {
    if (tail.length > 0) {
      return { alt: [ head, ...tail ] };
    } else {
      return head;
    }
  }

Seq
  = head:Factor tail:( _ t:Factor { return t; } )*
  {
    if (tail.length > 0) {
      return { seq: [ head, ...tail ] };
    } else {
      return head;
    }
  }

Factor
  = "(" _ p:Alt _ ")" { return p; }
  / cond:Cond { return cond; }
  / span:Span { return span; }
  / opt:Opt { return opt; }
  / ref:Ref { return ref; }
  / lit:Lit { return lit; }
  / sep:Sep { return sep; }

Cond
  = "{" _ ":if" _ "(" inv:( _ @"!" )? _ flag:Name _ ")" _ cond:Alt _ "}"
  { return { flag, inv: (inv === "!"), cond }; }

Span
  = "{" _ ":class" _ "(" _ cls:Name _ ")" _ span:Alt _ "}"
  { return { cls, span }; }

Opt
  = "[" _ p:Alt _ "]"
  { return { f: 0.5, opt: p }; }

Ref "ref"
  = ref:Name { return { ref }; }

Lit "literal"
  = string:string { return string; }

Sep "separator"
  = "_" { return " "; }

string "string"
  = '"' chars:char* '"' { return chars.join(""); }

char
  = [^\0-\x1F\x22\x5C]
  / "\\"
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$([0-9a-fA-F]|4|) {
          return String.fromCharCode(Number.parseInt(digits, 16));
        }
    )
    { return sequence; }

_ "whitespace"
  = [ \t\n\r]*
