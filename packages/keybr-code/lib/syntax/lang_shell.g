start -> shell_command ";" ;

shell_command -> command_name _ arg_list [ _ ( redirect_suffix | pipe_suffix ) ] ;

redirect_suffix -> ( ">" | ">>" ) _ file_name ;

pipe_suffix -> "|" _ command_name [ _ short_arg ] [ _ short_arg ] ;

arg_list -> short_arg [ _ short_arg ] _ long_arg [ _ long_arg ] _ ( file_arg | wildcard_arg | var_arg | string_arg ) ;

short_arg ->
    "-a"
  | "-b"
  | "-c"
  | "-d"
  | "-e"
  | "-f"
  | "-h"
  | "-l"
  | "-v"
  ;

long_arg ->
    "--color"
  | "--conf" "=" file_name
  | "--dir" "=" file_name
  | "--dump" "=" file_name
  | "--file" "=" file_name
  | "--help"
  | "--home" "=" file_name
  | "--in" "=" file_name
  | "--list" "=" file_name
  | "--log" "=" file_name
  | "--null"
  | "--out" "=" file_name
  | "--quiet"
  | "--version"
  ;

file_arg -> file_name ;

wildcard_arg -> "*" "." ( file_ext_name | "{" file_ext_name "," file_ext_name "}" ) ;

var_arg ->
    ( "$" "{" var_name "}" )
  | ( "$" "(" command_name _ file_arg ")" )
  | ( "$" "(" "pwd" ")" )
;

string_arg -> "\"" "$" "{" var_name "}" "\"" ;

dir_name ->
    "~"
  | "/bin"
  | "/home"
  | "/lib"
  | "/mnt"
  | "/opt"
  | "/tmp"
  | "/usr"
  | "/usr/bin"
  | "/usr/include"
  | "/usr/lib"
  | "/var"
  | "/var/lib"
  | "/var/log"
  | "/var/tmp"
  | "~/.cache"
  | "~/.config"
  | "~/.local"
  | "~/data"
  | "~/docs"
  | "~/work"
  ;

file_name ->
    "/dev/null"
  | ( dir_name "/" ( file_base_name "." file_ext_name ) | ".env" )
  ;

var_name ->
    "a"
  | "addr"
  | "b"
  | "c"
  | "date"
  | "db"
  | "dir"
  | "env"
  | "ext"
  | "file"
  | "host"
  | "in"
  | "job"
  | "lang"
  | "out"
  | "path"
  | "root"
  | "shell"
  | "time"
  | "user"
  ;

file_base_name ->
    "a"
  | "b"
  | "c"
  | "close"
  | "config"
  | "data"
  | "db"
  | "delete"
  | "file"
  | "groups"
  | "hosts"
  | "index"
  | "info"
  | "input"
  | "list"
  | "main"
  | "open"
  | "output"
  | "print"
  | "read"
  | "receive"
  | "scan"
  | "send"
  | "source"
  | "users"
  | "write"
  ;

file_ext_name ->
    "c"
  | "bash"
  | "bin"
  | "cpp"
  | "err"
  | "h"
  | "hpp"
  | "java"
  | "js"
  | "json"
  | "lib"
  | "log"
  | "md"
  | "o"
  | "out"
  | "pdf"
  | "ps"
  | "py"
  | "sh"
  | "so"
  | "ts"
  | "txt"
  | "unit"
  ;

command_name ->
    "cat"
  | "cd"
  | "chmod"
  | "chown"
  | "cp"
  | "cut"
  | "df"
  | "docker"
  | "du"
  | "echo"
  | "gcc"
  | "git"
  | "grep"
  | "gunzip"
  | "gzip"
  | "head"
  | "kill"
  | "less"
  | "ls"
  | "make"
  | "node"
  | "npm"
  | "ping"
  | "podman"
  | "ps"
  | "rm"
  | "sed"
  | "sort"
  | "ssh"
  | "tail"
  | "tar"
  | "top"
  | "uniq"
  | "unzip"
  | "vi"
  | "wc"
  | "zip"
  ;
