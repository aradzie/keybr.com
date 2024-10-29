Event history recorded on Fedora Linux 40, X11
==============================================

## Firefox 132

### Dead down, Dead up, character

```
3970    | keydown              | Equal          | Dead           | -
3971    | compositionstart     | -              | -              |
3971    | compositionupdate    | -              | -              | ´
3976    | input                | -              | -              | ´
4083    | keyup                | Equal          | Dead           | -
4499    | keydown              | KeyA           | a              | -
4500    | compositionupdate    | -              | -              | á
4500    | compositionend       | -              | -              | á
4502    | input                | -              | -              | á
4644    | keyup                | KeyA           | a              | -
```

### Dead down, character, Dead up

```
2531    | keydown              | Equal          | Dead           | -
2532    | compositionstart     | -              | -              |
2532    | compositionupdate    | -              | -              | ´
2537    | input                | -              | -              | ´
2739    | keydown              | KeyA           | a              | -
2740    | compositionupdate    | -              | -              | á
2740    | compositionend       | -              | -              | á
2742    | input                | -              | -              | á
2876    | keyup                | KeyA           | a              | -
2996    | keyup                | Equal          | Dead           | -
```
