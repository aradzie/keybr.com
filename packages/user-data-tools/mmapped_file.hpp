#pragma once

#include <cinttypes>
#include <string>

namespace util {

class mmapped_file {
public:
  enum Hint {
    Normal,
    SequentialScan,
    RandomAccess,
  };

  mmapped_file(const std::string &filename, Hint hint = Normal);

  ~mmapped_file();

  bool is_opened() const;

  bool open();

  void close();

  std::uint64_t file_size() const;

  const unsigned char *data() const;

  unsigned char operator[](std::size_t offset) const;

private:
  mmapped_file(const mmapped_file &);
  mmapped_file &operator=(const mmapped_file &);

  std::string _filename;
  Hint _hint;
  int _file;
  std::uint64_t _file_size;
  void *_data;
};

} // namespace util
