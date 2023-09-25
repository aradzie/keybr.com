#pragma once

#include <cinttypes>

namespace util {

class buffer {
public:
  buffer(const unsigned char *data, std::size_t size);

  inline std::size_t size() const { return _size; }

  inline std::size_t offset() const { return _offset; }

  inline std::size_t remaining() const { return _size - _offset; }

  inline unsigned char operator[](std::size_t offset) const {
    return _data[_offset + offset];
  }

  void rewind();

  bool get_uint8(std::uint8_t &value);

  bool get_uint16(std::uint16_t &value);

  bool get_uint32(std::uint32_t &value);

  bool get_vlq_uint32(std::uint32_t &value);

private:
  const unsigned char *_data;
  std::size_t _size;
  std::size_t _offset;
};

} // namespace util
