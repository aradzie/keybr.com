#include "buffer.hpp"

namespace util {

buffer::buffer(const unsigned char *data, std::size_t size)
    : _data(data), _size(size), _offset(0) {}

void buffer::rewind() { _offset = 0; }

bool buffer::get_uint8(std::uint8_t &value) {
  if (remaining() < 1) {
    return false;
  }
  value = _data[_offset];
  _offset += 1;
  return true;
}

bool buffer::get_uint16(std::uint16_t &value) {
  if (remaining() < 2) {
    return false;
  }
  std::uint32_t b0 = _data[_offset + 0];
  std::uint32_t b1 = _data[_offset + 1];
  value = (b0 << 8) | (b1 << 0);
  _offset += 2;
  return true;
}

bool buffer::get_uint32(std::uint32_t &value) {
  if (remaining() < 4) {
    return false;
  }
  std::uint32_t b0 = _data[_offset + 0];
  std::uint32_t b1 = _data[_offset + 1];
  std::uint32_t b2 = _data[_offset + 2];
  std::uint32_t b3 = _data[_offset + 3];
  value = (b0 << 24) | (b1 << 16) | (b2 << 8) | (b3 << 0);
  _offset += 4;
  return true;
}

bool buffer::get_vlq_uint32(std::uint32_t &out) {
  std::uint32_t value = 0;

  std::uint8_t b0;
  if (!get_uint8(b0)) {
    return false;
  }
  value = ((value << 7) | (b0 & 0x7f));
  if ((b0 & 0x80) == 0) {
    out = value;
    return true;
  }

  std::uint8_t b1;
  if (!get_uint8(b1)) {
    return false;
  }
  value = ((value << 7) | (b1 & 0x7f));
  if ((b1 & 0x80) == 0) {
    out = value;
    return true;
  }

  std::uint8_t b2;
  if (!get_uint8(b2)) {
    return false;
  }
  value = ((value << 7) | (b2 & 0x7f));
  if ((b2 & 0x80) == 0) {
    out = value;
    return true;
  }

  std::uint8_t b3;
  if (!get_uint8(b3)) {
    return false;
  }
  value = ((value << 7) | (b3 & 0x7f));
  if ((b3 & 0x80) == 0) {
    out = value;
    return true;
  }

  std::uint8_t b4;
  if (!get_uint8(b4)) {
    return false;
  }
  value = ((value << 7) | (b4 & 0x7f));
  if ((b4 & 0x80) == 0) {
    if ((b0 & 0x7f) > 15) {
      return false; // too many leading vlq bits
    }
    out = value;
    return true;
  }

  return false; // too many trailing vlq bits
}

} // namespace util
