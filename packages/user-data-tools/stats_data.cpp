#include "stats_data.hpp"

#include <cinttypes>

namespace keybr {

const std::uint32_t HEADER_SIGNATURE = 0x4b455942;
const std::uint32_t HEADER_VERSION = 2;

stats_data::stats_data(util::buffer &buf) : _buf(buf) {}

bool stats_data::eof() const { return _buf.remaining() == 0; }

bool stats_data::check_signature() {
  _buf.rewind();
  if (_buf.remaining() < 8) {
    return false;
  }
  std::uint32_t signature;
  if (!_buf.get_uint32(signature)) {
    return false;
  }
  if (signature != HEADER_SIGNATURE) {
    return false;
  }
  std::uint32_t version;
  if (!_buf.get_uint32(version)) {
    return false;
  }
  if (version != HEADER_VERSION) {
    return false;
  }
  return true;
}

bool stats_data::read_result(stats_result &result) {
  if (!_buf.get_uint8(result.layout_id)) {
    return false;
  }
  if (!_buf.get_uint8(result.text_type_id)) {
    return false;
  }
  if (!_buf.get_uint32(result.timestamp)) {
    return false;
  }
  if (!_buf.get_vlq_uint32(result.time)) {
    return false;
  }
  if (!_buf.get_vlq_uint32(result.length)) {
    return false;
  }
  if (!_buf.get_vlq_uint32(result.errors)) {
    return false;
  }
  stats_histogram &histogram = result.histogram;
  std::uint32_t sample_count;
  if (!_buf.get_vlq_uint32(sample_count)) {
    return false;
  }
  if (sample_count >= SAMPLE_COUNT) {
    return false;
  }
  histogram.sample_count = sample_count;
  for (std::uint32_t i = 0; i < sample_count; i++) {
    stats_sample &sample = histogram.sample_list[i];
    if (!_buf.get_vlq_uint32(sample.code_point)) {
      return false;
    }
    if (!_buf.get_vlq_uint32(sample.hit_count)) {
      return false;
    }
    if (!_buf.get_vlq_uint32(sample.miss_count)) {
      return false;
    }
    if (!_buf.get_vlq_uint32(sample.time_to_type)) {
      return false;
    }
  }
  return true;
}

} // namespace keybr
