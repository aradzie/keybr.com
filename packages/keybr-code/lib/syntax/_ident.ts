// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  "generic_variable_name": {
    "alt": [
      "a",
      "acc",
      "actual",
      "b",
      "buffer",
      "c",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "initial",
                    "new",
                    "bad",
                    "good"
                  ]
                },
                "_"
              ]
            }
          },
          "config"
        ]
      },
      "count",
      "ctx",
      "d",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "initial",
                    "new",
                    "bad",
                    "good",
                    "user"
                  ]
                },
                "_"
              ]
            }
          },
          "data"
        ]
      },
      "expected",
      "f",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "my",
                "_"
              ]
            }
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "data",
                    "config",
                    "image"
                  ]
                },
                "_"
              ]
            }
          },
          "file"
        ]
      },
      "h",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "min",
                    "max"
                  ]
                },
                "_"
              ]
            }
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "inner",
                    "outer"
                  ]
                },
                "_"
              ]
            }
          },
          "height"
        ]
      },
      "i",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "first",
                    "last",
                    "prev",
                    "next",
                    "min",
                    "max"
                  ]
                },
                "_"
              ]
            }
          },
          "idx"
        ]
      },
      "image",
      "img",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "first",
                    "last",
                    "prev",
                    "next",
                    "min",
                    "max"
                  ]
                },
                "_"
              ]
            }
          },
          "index"
        ]
      },
      "input",
      {
        "seq": [
          {
            "alt": [
              "first",
              "last",
              "prev",
              "next"
            ]
          },
          "_",
          "item"
        ]
      },
      "iter",
      {
        "seq": [
          {
            "alt": [
              "input",
              "output"
            ]
          },
          "_",
          "shape"
        ]
      },
      "j",
      "k",
      {
        "seq": [
          {
            "alt": [
              "first",
              "last",
              "prev",
              "next"
            ]
          },
          "_",
          "key"
        ]
      },
      {
        "seq": [
          {
            "alt": [
              "first",
              "last",
              "prev",
              "next",
              "min",
              "max"
            ]
          },
          "_",
          "layer"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "min",
                    "max"
                  ]
                },
                "_"
              ]
            }
          },
          "len"
        ]
      },
      "m",
      "map",
      "mask",
      "n",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "file",
                    "dir",
                    "entry"
                  ]
                },
                "_"
              ]
            }
          },
          "name"
        ]
      },
      {
        "seq": [
          {
            "alt": [
              "first",
              "last",
              "prev",
              "next"
            ]
          },
          "_",
          "node"
        ]
      },
      "op",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "last",
                    "saved"
                  ]
                },
                "_"
              ]
            }
          },
          {
            "alt": [
              "out",
              "output"
            ]
          }
        ]
      },
      "req",
      "res",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "min",
                    "max",
                    "last"
                  ]
                },
                "_"
              ]
            }
          },
          "result"
        ]
      },
      "root",
      "s",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "data",
                    "layer",
                    "image"
                  ]
                },
                "_"
              ]
            }
          },
          "shape"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "min",
                    "max"
                  ]
                },
                "_"
              ]
            }
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "inner",
                    "outer"
                  ]
                },
                "_"
              ]
            }
          },
          "size"
        ]
      },
      "t",
      "u",
      "v",
      {
        "seq": [
          {
            "alt": [
              "first",
              "last",
              "prev",
              "next",
              "min",
              "max"
            ]
          },
          "_",
          "value"
        ]
      },
      "w",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "min",
                    "max"
                  ]
                },
                "_"
              ]
            }
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "inner",
                    "outer"
                  ]
                },
                "_"
              ]
            }
          },
          "width"
        ]
      },
      "x",
      "y",
      "z"
    ]
  },
  "generic_function_name": {
    "alt": [
      {
        "seq": [
          "add",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "value"
                  ]
                }
              ]
            }
          }
        ]
      },
      "append",
      "build",
      "call",
      "configure",
      {
        "seq": [
          "copy",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "create",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      "exec",
      {
        "seq": [
          "find",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      "floor",
      {
        "seq": [
          "get",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "handle",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "req",
                    "request",
                    "res",
                    "response"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "init",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "f": 0.5,
                  "opt": "pre"
                },
                "process",
                "_"
              ]
            }
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                "user"
              ]
            }
          },
          "input"
        ]
      },
      {
        "seq": [
          "insert",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "layer"
                  ]
                }
              ]
            }
          }
        ]
      },
      "len",
      {
        "seq": [
          "load",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      "main",
      {
        "seq": [
          "pop",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "layer"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "process",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "push",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "node",
                    "entry",
                    "layer"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "read",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "remove",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "run",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "job",
                    "task"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "save",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "search",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "item",
                    "value",
                    "entry"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "serialize",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "data",
                    "config",
                    "object"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "alt": [
              "get",
              "set"
            ]
          },
          " ",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "file",
                    "data",
                    "image",
                    "layer"
                  ]
                },
                "_"
              ]
            }
          },
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "min",
                "max"
              ]
            }
          },
          "size"
        ]
      },
      {
        "seq": [
          "store",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          "update",
          {
            "f": 0.5,
            "opt": {
              "seq": [
                "_",
                {
                  "alt": [
                    "state",
                    "item",
                    "node",
                    "entry",
                    "layer",
                    "file",
                    "config"
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "alt": [
                    "function",
                    "class"
                  ]
                },
                "_"
              ]
            }
          },
          "wrapper"
        ]
      }
    ]
  },
  "generic_class_name": {
    "alt": [
      "Buffer",
      "Builder",
      "Cache",
      "Channel",
      "Client",
      "Command",
      "Component",
      "Config",
      "Connection",
      "Context",
      "Controller",
      "Decoder",
      "Descriptor",
      "Dir",
      "Dispatcher",
      "Encoder",
      "Entry",
      "Error",
      "Exception",
      "Factory",
      "File",
      "Filter",
      "Graph",
      "Interval",
      "Item",
      "Job",
      "Kernel",
      "Layer",
      "List",
      "Loader",
      "Matrix",
      "Model",
      "Module",
      "Monitor",
      "Mutex",
      "Observer",
      "Plugin",
      "Point",
      "Pool",
      "Property",
      "Provider",
      "Range",
      "Registry",
      "Renderer",
      "Resolver",
      "Resource",
      "Result",
      "Scanner",
      "Server",
      "Service",
      "Session",
      "Size",
      "State",
      "Status",
      "Store",
      "Table",
      "Task",
      "Texture",
      "Thread",
      "Tracker",
      "Transform",
      "Tree",
      "Vector",
      "Watcher",
      "Worker",
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Buffer",
                "Connection",
                "Error",
                "File",
                "Input",
                "Plugin",
                "Resource",
                "State",
                "Thread"
              ]
            }
          },
          "Manager"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Change",
                "Connection",
                "Event"
              ]
            }
          },
          "Listener"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Client",
                "Server"
              ]
            }
          },
          {
            "alt": [
              "Request",
              "Response",
              "Router"
            ]
          }
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Connection",
                "Error",
                "Event",
                "Input"
              ]
            }
          },
          "Handler"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Custom",
                "Example"
              ]
            }
          },
          "Model"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Data",
                "Request",
                "Response",
                "Message"
              ]
            }
          },
          "Queue"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "File",
                "Data",
                "Input",
                "Output",
                "Memory",
                "Message",
                "Network"
              ]
            }
          },
          "Stream"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "File",
                "Data",
                "Stream",
                "Log",
                "Memory",
                "Message",
                "Network"
              ]
            }
          },
          {
            "alt": [
              "Reader",
              "Writer"
            ]
          }
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "File",
                "State",
                "Config",
                "Default"
              ]
            }
          },
          "Adapter"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Graph",
                "List",
                "Tree"
              ]
            }
          },
          "Node"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Header",
                "Body",
                "Data"
              ]
            }
          },
          "Parser"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Input",
                "Data",
                "User"
              ]
            }
          },
          "Validator"
        ]
      },
      {
        "seq": [
          {
            "f": 0.5,
            "opt": {
              "alt": [
                "Request",
                "Response",
                "Document"
              ]
            }
          },
          {
            "alt": [
              "Body",
              "Header"
            ]
          }
        ]
      }
    ]
  }
} as Rules;
