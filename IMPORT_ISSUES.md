# Keybr.com Import Issues

## Problem Summary
Attempting to import typing data from a JSON export into a local keybr.com instance resulted in corrupted statistics being displayed on the profile page.

## Data Being Imported
- **Source**: JSON export from keybr.com
- **Size**: 2,891 typing results
- **Date range**: October 2025 to February 2025 (127 days)
- **Original statistics**:
  - Total time: ~26:59:19 (26 hours 59 minutes)
  - Average speed: Reasonable (estimated ~200-250 CPM)
  - Max speed: ~76-77 WPM (384 CPM)

## Issues Encountered

### 1. Binary Format Encoding Problems

#### Issue 1.1: Incorrect Header Format
- **Problem**: Initial import used wrong header format ("KRS1" instead of "KEYB")
- **Fix**: Updated to use correct header signature and version

#### Issue 1.2: Version Field Byte Order
- **Problem**: Confusion about big-endian vs little-endian for version field
- **Resolution**: Confirmed both use big-endian (0x00000002)

#### Issue 1.3: Timestamp Byte Order
- **Problem**: Timestamp was encoded as little-endian instead of big-endian
- **Impact**: This would cause all timestamps to be read incorrectly
- **Fix**: Changed from `writeUInt32LE` to `writeUInt32BE` for timestamp

### 2. Layout ID Mapping

#### Issue 2.1: Wrong Layout IDs
- **Problem**: Used sequential IDs starting from 1 (de-de=1, en-us=2)
- **Reality**: Layout IDs are hex values starting from 0x10 (16)
  - de-de = 0x20 (32)
  - en-us = 0x10 (16)
  - fr-fr = 0x30 (48)
- **Fix**: Updated mapping with correct xid values from source code

### 3. Text Type Mapping

#### Issue 3.1: Unknown Text Type
- **Problem**: JSON contained "natural" text type which wasn't in initial mapping
- **Resolution**: Added proper text type mappings:
  - generated = 1
  - natural = 2
  - numbers = 3
  - code = 4

### 4. VLQ Encoding

#### Issue 4.1: Incorrect VLQ Encoding
- **Problem**: Initial implementation had continuation bit on wrong bytes
- **Fix**: Set continuation bit (0x80) on all bytes except the last

### 5. Current Issue (Unresolved)

#### Issue 5.1: Displayed Statistics Are Wrong
- **Expected**:
  - Total time: ~26-28 hours
  - Max speed: ~76-77 WPM
  - File verification confirms correct data

- **Actually displayed on website**:
  - Total time: 760+ hours (way too high)
  - Max speed: 1,715.7 WPM (unrealistic)
  - Speed chart shows extreme values and wrong patterns

- **Binary file verification**: All 2,891 results parse correctly
  - Max speed: 384.0 CPM = 76.8 WPM ✓
  - Total time: 28.27 hours ✓
  - No anomalies found in data

- **Possible causes**:
  1. Browser caching (hard refresh needed)
  2. Server-side caching
  3. Assets not being served correctly (404 errors for JS files)
  4. File being read with wrong byte order in some places
  5. JavaScript error in data processing

#### Issue 5.2: Asset Loading Problems
- **Problem**: Browser console shows 404 errors for:
  - `styles.css`
  - `browser.js`
  - `shared-widget.js`
  - `shared-vendor.js`
  - Font files

- **Impact**: This could cause the page to use old/cached JavaScript code that reads data incorrectly

## Import Script Location
`scripts/import-typing-data.mjs`

## Correct Format Specifications

### Header (8 bytes)
```
Offset 0-3: "KEYB" signature (0x4B455942)
Offset 4-7: Version 2 (big-endian: 0x00000002)
```

### Per-Result Format
```
Offset +0: Layout ID (1 byte)
Offset +1: Text Type ID (1 byte)
Offset +2-5: Timestamp (4 bytes, big-endian, seconds since epoch)
Offset +6: Time (VLQ encoded, milliseconds)
Offset +?: Length (VLQ encoded)
Offset +?: Errors (VLQ encoded)
Offset +?: Histogram size (VLQ encoded)
Offset +?: Histogram entries (repeated N times)
  - CodePoint (VLQ)
  - HitCount (VLQ)
  - MissCount (VLQ)
  - TimeToType (VLQ)
```

### Key Layout IDs (Partial)
```javascript
"de-de": 32,
"en-us": 16,
"en-gb": 17,
"fr-fr": 48,
"es-es": 80,
"it-it": 64,
"pl-pl": 88,
"pt-br": 96,
"ru-ru": 112,
// ... (see full list in script)
```

### Key Text Type IDs
```javascript
"generated": 1,
"natural": 2,
"numbers": 3,
"code": 4,
```

## Verification Steps
1. Parse binary file and verify:
   - Total results count matches JSON (2891)
   - Max speed is reasonable (~76-77 WPM)
   - Total time is reasonable (~26-28 hours)
   - No unexpected values

2. All checks pass ✓

## Next Steps to Resolve
1. **Fix asset loading**: Ensure webpack built files are properly served
2. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
3. **Check for byte order issues**: Verify all multi-byte values use correct endianness
4. **Add debug logging**: Log what values are actually being read by the application
5. **Compare with example file**: Ensure exact byte-for-byte format match

## Files Modified
- `scripts/import-typing-data.mjs` - Import script with corrected format
- `packages/keybr-lesson-ui/lib/StreakList.tsx` - Fixed React key warning

## References
- Binary format: `packages/keybr-result-io/lib/binary.ts`
- Header format: `packages/keybr-result-io/lib/header.ts`
- Layout definitions: `packages/keybr-keyboard/lib/layout.ts`
- Text type definitions: `packages/keybr-result/lib/texttype.ts`
