// Generated file, do not edit.

import { type Rules } from "../ast.ts";

export default {
  start: {
    seq: [
      {
        ref: "shell_command",
      },
      ";",
    ],
  },
  shell_command: {
    seq: [
      {
        ref: "command_name",
      },
      " ",
      {
        ref: "arg_list",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              alt: [
                {
                  ref: "redirect_suffix",
                },
                {
                  ref: "pipe_suffix",
                },
              ],
            },
          ],
        },
      },
    ],
  },
  redirect_suffix: {
    seq: [
      {
        alt: [">", ">>"],
      },
      " ",
      {
        ref: "file_name",
      },
    ],
  },
  pipe_suffix: {
    seq: [
      "| ",
      {
        ref: "command_name",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "short_arg",
            },
          ],
        },
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "short_arg",
            },
          ],
        },
      },
    ],
  },
  arg_list: {
    seq: [
      {
        ref: "short_arg",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "short_arg",
            },
          ],
        },
      },
      " ",
      {
        ref: "long_arg",
      },
      {
        f: 0.5,
        opt: {
          seq: [
            " ",
            {
              ref: "long_arg",
            },
          ],
        },
      },
      " ",
      {
        alt: [
          {
            ref: "file_arg",
          },
          {
            ref: "wildcard_arg",
          },
          {
            ref: "var_arg",
          },
          {
            ref: "string_arg",
          },
        ],
      },
    ],
  },
  short_arg: {
    alt: ["-a", "-b", "-c", "-d", "-e", "-f", "-h", "-l", "-v"],
  },
  long_arg: {
    alt: [
      "--color",
      {
        seq: [
          "--conf=",
          {
            ref: "file_name",
          },
        ],
      },
      {
        seq: [
          "--dir=",
          {
            ref: "file_name",
          },
        ],
      },
      {
        seq: [
          "--dump=",
          {
            ref: "file_name",
          },
        ],
      },
      {
        seq: [
          "--file=",
          {
            ref: "file_name",
          },
        ],
      },
      "--help",
      {
        seq: [
          "--home=",
          {
            ref: "file_name",
          },
        ],
      },
      {
        seq: [
          "--in=",
          {
            ref: "file_name",
          },
        ],
      },
      {
        seq: [
          "--list=",
          {
            ref: "file_name",
          },
        ],
      },
      {
        seq: [
          "--log=",
          {
            ref: "file_name",
          },
        ],
      },
      "--null",
      {
        seq: [
          "--out=",
          {
            ref: "file_name",
          },
        ],
      },
      "--quiet",
      "--version",
    ],
  },
  file_arg: {
    ref: "file_name",
  },
  wildcard_arg: {
    seq: [
      "*.",
      {
        alt: [
          {
            ref: "file_ext_name",
          },
          {
            seq: [
              "{",
              {
                ref: "file_ext_name",
              },
              ",",
              {
                ref: "file_ext_name",
              },
              "}",
            ],
          },
        ],
      },
    ],
  },
  var_arg: {
    alt: [
      {
        seq: [
          "${",
          {
            ref: "var_name",
          },
          "}",
        ],
      },
      {
        seq: [
          "$(",
          {
            ref: "command_name",
          },
          " ",
          {
            ref: "file_arg",
          },
          ")",
        ],
      },
      "$(pwd)",
    ],
  },
  string_arg: {
    seq: [
      '"${',
      {
        ref: "var_name",
      },
      '}"',
    ],
  },
  dir_name: {
    alt: [
      "~",
      "/bin",
      "/home",
      "/lib",
      "/mnt",
      "/opt",
      "/tmp",
      "/usr",
      "/usr/bin",
      "/usr/include",
      "/usr/lib",
      "/var",
      "/var/lib",
      "/var/log",
      "/var/tmp",
      "~/.cache",
      "~/.config",
      "~/.local",
      "~/data",
      "~/docs",
      "~/work",
    ],
  },
  file_name: {
    alt: [
      "/dev/null",
      {
        seq: [
          {
            ref: "dir_name",
          },
          "/",
          {
            ref: "file_base_name",
          },
          ".",
          {
            ref: "file_ext_name",
          },
        ],
      },
      ".env",
    ],
  },
  var_name: {
    alt: [
      "a",
      "addr",
      "b",
      "c",
      "date",
      "db",
      "dir",
      "env",
      "ext",
      "file",
      "host",
      "in",
      "job",
      "lang",
      "out",
      "path",
      "root",
      "shell",
      "time",
      "user",
    ],
  },
  file_base_name: {
    alt: [
      "a",
      "b",
      "c",
      "close",
      "config",
      "data",
      "db",
      "delete",
      "file",
      "groups",
      "hosts",
      "index",
      "info",
      "input",
      "list",
      "main",
      "open",
      "output",
      "print",
      "read",
      "receive",
      "scan",
      "send",
      "source",
      "users",
      "write",
    ],
  },
  file_ext_name: {
    alt: [
      "c",
      "bash",
      "bin",
      "cpp",
      "err",
      "h",
      "hpp",
      "java",
      "js",
      "json",
      "lib",
      "log",
      "md",
      "o",
      "out",
      "pdf",
      "ps",
      "py",
      "sh",
      "so",
      "ts",
      "txt",
      "unit",
    ],
  },
  command_name: {
    alt: [
      "cat",
      "cd",
      "chmod",
      "chown",
      "cp",
      "cut",
      "df",
      "docker",
      "du",
      "echo",
      "gcc",
      "git",
      "grep",
      "gunzip",
      "gzip",
      "head",
      "kill",
      "less",
      "ls",
      "make",
      "node",
      "npm",
      "ping",
      "podman",
      "ps",
      "rm",
      "sed",
      "sort",
      "ssh",
      "tail",
      "tar",
      "top",
      "uniq",
      "unzip",
      "vi",
      "wc",
      "zip",
    ],
  },
} as Rules;
