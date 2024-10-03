#include <cstddef>

namespace keybr {

template <class T, std::size_t N> class circ_buffer {
private:
  T buffer[N];
  std::size_t head = 0;
  std::size_t tail = 0;

public:
  void enqueue(T item) {
    buffer[tail] = item;
    tail = (tail + 1) % N;
  }

  T dequeue() {
    T item = buffer[head];
    head = (head + 1) % N;
    return item;
  }

  T front() { return buffer[head]; }

  bool empty() { return head == tail; }

  bool full() { return tail == (head - 1) % N; }

  std::size_t size() {
    if (tail >= head) {
      return tail - head;
    } else {
      return N - head - tail;
    }
  }
};

} // namespace keybr
