Event history recorded on Windows 11
====================================

## Firefox 132

### Dead down, Dead up, character

```
6553    | keydown              | Equal          | Dead           | -
6757    | keyup                | Equal          | Dead           | -
8100    | keydown              | KeyA           | á              | -
8108    | input                | -              | -              | á
8303    | keyup                | KeyA           | a              | -
```

### Dead down, character, Dead up

```
3304    | keydown              | Equal          | Dead           | -
3445    | keydown              | KeyA           | á              | -
3453    | input                | -              | -              | á
3570    | keyup                | KeyA           | a              | -
3726    | keyup                | Equal          | ´              | -
```

### Shift down, Dead down, Dead up, Shift up, character

```
2163    | keydown              | ShiftLeft      | Shift          | -
2350    | keydown              | Equal          | Dead           | -
2475    | keyup                | Equal          | Dead           | -
2647    | keyup                | ShiftLeft      | Shift          | -
2975    | keydown              | KeyC           | č              | -
2991    | input                | -              | -              | č
3116    | keyup                | KeyC           | c              | -
```

### Shift down, Dead down, character, Dead up, Shift up

```
9042    | keydown              | ShiftLeft      | Shift          | -
9323    | keydown              | Equal          | Dead           | -
9588    | keydown              | KeyC           | Č              | -
9604    | input                | -              | -              | Č
9760    | keyup                | KeyC           | C              | -
0026    | keyup                | Equal          | ˇ              | -
0307    | keyup                | ShiftLeft      | Shift          | -
```

### Shift down, Dead down, Dead up, Shift up, Shift down, character, Shift up

```
0272    | keydown              | ShiftLeft      | Shift          | -
0632    | keydown              | Equal          | Dead           | -
0882    | keyup                | Equal          | Dead           | -
1257    | keyup                | ShiftLeft      | Shift          | -
2022    | keydown              | ShiftLeft      | Shift          | -
2350    | keydown              | KeyC           | Č              | -
2366    | input                | -              | -              | Č
2569    | keyup                | KeyC           | C              | -
2835    | keyup                | ShiftLeft      | Shift          | -
```

## Chrome 130

### Dead down, Dead up, character

```
6622    | keydown              | Equal          | Dead           | -
6911    | keyup                | Equal          | Dead           | -
8031    | keydown              | KeyA           | á              | -
8033    | input                | -              | -              | á
8351    | keyup                | KeyA           | a              | -
```

### Dead down, character, Dead up

```
2469    | keydown              | Equal          | Dead           | -
2660    | keydown              | KeyA           | á              | -
2662    | input                | -              | -              | á
2828    | keyup                | KeyA           | a              | -
3021    | keyup                | Equal          | Dead           | -
```

### Shift down, Dead down, Dead up, Shift up, character

```
5392    | keydown              | ShiftLeft      | Shift          | -
5776    | keydown              | Equal          | Dead           | -
6031    | keyup                | Equal          | Dead           | -
6439    | keyup                | ShiftLeft      | Shift          | -
7487    | keydown              | KeyC           | č              | -
7492    | input                | -              | -              | č
7615    | keyup                | KeyC           | c              | -
```

### Shift down, Dead down, character, Dead up, Shift up

```
7466    | keydown              | ShiftLeft      | Shift          | -
7658    | keydown              | Equal          | Dead           | -
8018    | keydown              | KeyC           | Č              | -
8019    | input                | -              | -              | Č
8154    | keyup                | KeyC           | C              | -
8378    | keyup                | Equal          | Dead           | -
8682    | keyup                | ShiftLeft      | Shift          | -
```

### Shift down, Dead down, Dead up, Shift up, Shift down, character, Shift up

```
5781    | keydown              | ShiftLeft      | Shift          | -
6093    | keydown              | Equal          | Dead           | -
6309    | keyup                | Equal          | Dead           | -
6629    | keyup                | ShiftLeft      | Shift          | -
7725    | keydown              | ShiftLeft      | Shift          | -
8181    | keydown              | KeyC           | Č              | -
8183    | input                | -              | -              | Č
8365    | keyup                | KeyC           | C              | -
8677    | keyup                | ShiftLeft      | Shift          | -
```
