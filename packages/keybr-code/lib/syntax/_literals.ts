// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  "numeric_literal": {
    "alt": [
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_dec_literal"
      },
      {
        "ref": "integer_hex_literal_2"
      },
      {
        "ref": "integer_hex_literal_4"
      },
      {
        "ref": "float_dec_literal"
      },
      {
        "ref": "float_dec_literal"
      },
      {
        "ref": "float_dec_literal"
      },
      {
        "ref": "float_dec_literal"
      },
      {
        "ref": "float_sci_literal"
      }
    ]
  },
  "integer_bin_literal": {
    "seq": [
      "0b",
      {
        "ref": "bin_digit"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "bin_digit"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  {
                    "ref": "bin_digit"
                  },
                  {
                    "f": 0.5,
                    "opt": {
                      "ref": "bin_digit"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "integer_bin_literal_4": {
    "seq": [
      "0b",
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      }
    ]
  },
  "integer_bin_literal_8": {
    "seq": [
      "0b",
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      },
      {
        "ref": "bin_digit"
      }
    ]
  },
  "integer_oct_literal": {
    "seq": [
      "0o",
      {
        "ref": "oct_digit"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "oct_digit"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  {
                    "ref": "oct_digit"
                  },
                  {
                    "f": 0.5,
                    "opt": {
                      "seq": [
                        {
                          "ref": "oct_digit"
                        },
                        {
                          "f": 0.5,
                          "opt": {
                            "ref": "oct_digit"
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "integer_oct_literal_3": {
    "seq": [
      "0o",
      {
        "ref": "oct_digit"
      },
      {
        "ref": "oct_digit"
      },
      {
        "ref": "oct_digit"
      }
    ]
  },
  "integer_hex_literal": {
    "seq": [
      "0x",
      {
        "ref": "hex_digit"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "hex_digit"
            },
            {
              "f": 0.5,
              "opt": {
                "seq": [
                  {
                    "ref": "hex_digit"
                  },
                  {
                    "f": 0.5,
                    "opt": {
                      "ref": "hex_digit"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "integer_hex_literal_2": {
    "seq": [
      "0x",
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      }
    ]
  },
  "integer_hex_literal_4": {
    "seq": [
      "0x",
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      }
    ]
  },
  "integer_hex_literal_8": {
    "seq": [
      "0x",
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      },
      {
        "ref": "hex_digit"
      }
    ]
  },
  "integer_dec_literal": {
    "alt": [
      "0",
      {
        "seq": [
          {
            "ref": "dec_start"
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "dec_digit"
                },
                {
                  "f": 0.5,
                  "opt": {
                    "ref": "dec_digit"
                  }
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "ref": "dec_start"
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "dec_digit"
                },
                {
                  "f": 0.5,
                  "opt": {
                    "ref": "dec_digit"
                  }
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "ref": "dec_start"
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "dec_digit"
                },
                {
                  "f": 0.5,
                  "opt": {
                    "ref": "dec_digit"
                  }
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "ref": "dec_start"
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "dec_digit"
                },
                {
                  "f": 0.5,
                  "opt": {
                    "ref": "dec_digit"
                  }
                }
              ]
            }
          }
        ]
      },
      {
        "seq": [
          {
            "ref": "dec_start"
          },
          {
            "f": 0.5,
            "opt": {
              "seq": [
                {
                  "ref": "dec_digit"
                },
                {
                  "f": 0.5,
                  "opt": {
                    "ref": "dec_digit"
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "integer_dec_literal_3": {
    "seq": [
      {
        "ref": "dec_start"
      },
      {
        "ref": "dec_digit"
      },
      {
        "ref": "dec_digit"
      }
    ]
  },
  "integer_dec_literal_6": {
    "seq": [
      {
        "ref": "dec_start"
      },
      {
        "ref": "dec_digit"
      },
      {
        "ref": "dec_digit"
      },
      {
        "ref": "dec_digit"
      },
      {
        "ref": "dec_digit"
      },
      {
        "ref": "dec_digit"
      }
    ]
  },
  "float_dec_literal": {
    "seq": [
      {
        "ref": "integer_dec_literal"
      },
      ".",
      {
        "ref": "dec_digit"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "dec_digit"
            },
            {
              "f": 0.5,
              "opt": {
                "ref": "dec_digit"
              }
            }
          ]
        }
      }
    ]
  },
  "float_sci_literal": {
    "seq": [
      {
        "ref": "float_dec_literal"
      },
      "e",
      {
        "f": 0.5,
        "opt": {
          "alt": [
            "+",
            "-"
          ]
        }
      },
      {
        "ref": "dec_digit"
      },
      {
        "f": 0.5,
        "opt": {
          "seq": [
            {
              "ref": "dec_digit"
            },
            {
              "f": 0.5,
              "opt": {
                "ref": "dec_digit"
              }
            }
          ]
        }
      }
    ]
  },
  "bin_digit": {
    "alt": [
      "0",
      "1"
    ]
  },
  "oct_digit": {
    "alt": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7"
    ]
  },
  "hex_digit": {
    "alt": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f"
    ]
  },
  "dec_digit": {
    "alt": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  },
  "dec_start": {
    "alt": [
      "1",
      "1",
      "1",
      "1",
      "1",
      "2",
      "2",
      "2",
      "3",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ]
  }
} as Rules;
