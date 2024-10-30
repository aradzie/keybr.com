Event history recorded on MacOS 12.7.6
======================================

## Safari 17.6

### Dead down, Dead up, character

```
5847    | compositionstart     | -              | -              |
5850    | compositionupdate    | -              | -              | '
5852    | input                | -              | -              | '
5847    | keydown              | Equal          | Dead           | -
6191    | keyup                | Equal          | '              | -
8770    | input                | -              | -              | -
8773    | input                | -              | -              | á
8775    | compositionend       | -              | -              | á
8767    | keydown              | KeyA           | á              | -
9239    | keyup                | KeyA           | a              | -
```

### Dead down, character, Dead up

```
7639    | compositionstart     | -              | -              |
7645    | compositionupdate    | -              | -              | '
7647    | input                | -              | -              | '
7687    | keydown              | Equal          | Dead           | -
7824    | input                | -              | -              | -
7829    | input                | -              | -              | á
7831    | compositionend       | -              | -              | á
7871    | keydown              | KeyA           | á              | -
7967    | keyup                | KeyA           | a              | -
8063    | keyup                | Equal          | Dead           | -
```

## Chrome 130

### Dead down, Dead up, character

```
2447    | keydown              | Equal          | Dead           | -
2453    | compositionstart     | -              | -              |
2454    | compositionupdate    | -              | -              | '
2455    | input                | -              | -              | '
2559    | keyup                | Equal          | Dead           | -
3055    | keydown              | KeyA           | á              | -
3058    | compositionupdate    | -              | -              | á
3059    | input                | -              | -              | á
3059    | compositionend       | -              | -              | á
3191    | keyup                | KeyA           | a              | -
```

### Dead down, character, Dead up

```
5732    | keydown              | Equal          | Dead           | -
5738    | compositionstart     | -              | -              |
5739    | compositionupdate    | -              | -              | '
5740    | input                | -              | -              | '
5964    | keydown              | KeyA           | á              | -
5968    | compositionupdate    | -              | -              | á
5969    | input                | -              | -              | á
5969    | compositionend       | -              | -              | á
6100    | keyup                | KeyA           | a              | -
6228    | keyup                | Equal          | Dead           | -
```

## Firefox 132

### Dead down, Dead up, character

```
6731    | keydown              | Equal          | Dead           | -
6735    | compositionstart     | -              | -              |
6735    | compositionupdate    | -              | -              | '
6746    | input                | -              | -              | '
6995    | keyup                | Equal          | '              | -
9563    | keydown              | KeyA           | á              | -
9566    | compositionupdate    | -              | -              | á
9566    | compositionend       | -              | -              | á
9575    | input                | -              | -              | á
9795    | keyup                | KeyA           | a              | -
```

### Dead down, character, Dead up

```
4043    | keydown              | Equal          | Dead           | -
4048    | compositionstart     | -              | -              |
4048    | compositionupdate    | -              | -              | '
4054    | input                | -              | -              | '
4275    | keydown              | KeyA           | á              | -
4278    | compositionupdate    | -              | -              | á
4278    | compositionend       | -              | -              | á
4286    | input                | -              | -              | á
4427    | keyup                | KeyA           | a              | -
4603    | keyup                | Equal          | Dead           | -
```
