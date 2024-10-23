generic_variable_name ->
    "a"
  | "acc"
  | "actual"
  | "b"
  | "buffer"
  | "c"
  | [ ( "initial" | "new" | "bad" | "good" ) "_" ] "config"
  | "count"
  | "ctx"
  | "d"
  | [ ( "initial" | "new" | "bad" | "good"| "user" ) "_" ] "data"
  | "expected"
  | "f"
  | [ "my" "_" ] [ ( "data" | "config" | "image" ) "_" ] "file"
  | "h"
  | [ ( "min" | "max" ) "_" ] [ ( "inner" | "outer" ) "_" ] "height"
  | "i"
  | [ ( "first" | "last" | "prev" | "next" | "min" | "max" ) "_" ] "idx"
  | "image"
  | "img"
  | [ ( "first" | "last" | "prev" | "next" | "min" | "max" ) "_" ] "index"
  | "input"
  | ( "first" | "last" | "prev" | "next" ) "_" "item"
  | "iter"
  | ( "input" | "output" ) "_" "shape"
  | "j"
  | "k"
  | ( "first" | "last" | "prev" | "next" ) "_" "key"
  | ( "first" | "last" | "prev" | "next" | "min" | "max" ) "_" "layer"
  | [ ( "min" | "max" ) "_" ] "len"
  | "m"
  | "map"
  | "mask"
  | "n"
  | [ ( "file" | "dir" | "entry" ) "_" ] "name"
  | ( "first" | "last" | "prev" | "next" ) "_" "node"
  | "op"
  | [ ( "last" | "saved" ) "_" ] ( "out" | "output" )
  | "req"
  | "res"
  | [ ( "min" | "max" | "last" ) "_" ] "result"
  | "root"
  | "s"
  | [ ( "data" | "layer" | "image" ) "_" ] "shape"
  | [ ( "min" | "max" ) "_" ] [ ( "inner" | "outer" ) "_" ] "size"
  | "t"
  | "u"
  | "v"
  | ( "first" | "last" | "prev" | "next" | "min" | "max" ) "_" "value"
  | "w"
  | [ ( "min" | "max" ) "_" ] [ ( "inner" | "outer" ) "_" ] "width"
  | "x"
  | "y"
  | "z"
  ;

generic_function_name ->
    "add" [ "_" ( "item" | "node" | "entry" | "value" ) ]
  | "append"
  | "build"
  | "call"
  | "configure"
  | "copy" [ "_" ( "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "create" [ "_" ( "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "exec"
  | "find" [ "_" ( "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "floor"
  | "get" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "handle" [ "_" ( "req" | "request" | "res" | "response" ) ]
  | "init" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | [ [ "pre" ] "process" "_" ] [ "_" "user" ] "input"
  | "insert" [ "_" ( "item" | "node" | "entry" | "layer" ) ]
  | "len"
  | "load" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "main"
  | "pop" [ "_" ( "item" | "node" | "entry" | "layer" ) ]
  | "process" [ "_" ( "item" | "file" | "config" ) ]
  | "push" [ "_" ( "item" | "node" | "entry" | "layer" ) ]
  | "read" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "remove" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "run" [ "_" ( "job" | "task" ) ]
  | "save" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "search" [ "_" ( "item" | "value" | "entry" ) ]
  | "serialize" [ "_" ( "data" | "config" | "object" ) ]
  | ( "get" | "set" ) _ [ ( "file" | "data" | "image" | "layer" ) "_" ] [ "min" | "max" ] "size"
  | "store" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | "update" [ "_" ( "state" | "item" | "node" | "entry" | "layer" | "file" | "config" ) ]
  | [ ( "function" | "class" ) "_" ] "wrapper"
  ;

generic_class_name ->
    "Body"
  | "Buffer"
  | "Builder"
  | "Cache"
  | "Channel"
  | "Client"
  | "Command"
  | "Config"
  | "Connection"
  | "Context"
  | "Controller"
  | "Decoder"
  | "Dir"
  | "Encoder"
  | "Entry"
  | "Error"
  | "File"
  | "Graph"
  | "Handle"
  | "Handler"
  | "Header"
  | "Item"
  | "Layer"
  | "List"
  | "Manager"
  | "Matrix"
  | [ "Custom" | "Example" ] "Model"
  | "Mutex"
  | [ "Tree" | "Graph" | "List" ] "Node"
  | "Parser"
  | "Person"
  | "Point"
  | "Pool"
  | "Property"
  | "Queue"
  | "Request"
  | "Resource"
  | "Response"
  | "Result"
  | "Scanner"
  | "Server"
  | "Size"
  | "State"
  | "Status"
  | "Stream"
  | "Table"
  | "TestSuite"
  | "Tree"
  | "Variable"
  | "Vector"
  | "Worker"
  ;
