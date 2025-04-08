# UUIDv7 implementation
# This code is based on the uuid6-python library
# https://github.com/oittaa/uuid6-python/tree/main


# MIT License
#
# Copyright (c) 2021 oittaa
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


import secrets
import time
import uuid
from typing import Optional, Tuple


class UUID(uuid.UUID):
    r"""Instances of the UUID class represent UUIDs as specified in RFC 9562."""

    __slots__ = ()

    def __init__(
        self,
        hex: Optional[str] = None,
        bytes: Optional[bytes] = None,
        bytes_le: Optional[bytes] = None,
        fields: Optional[Tuple[int, int, int, int, int, int]] = None,
        int: Optional[int] = None,
        version: Optional[int] = None,
        *,
        is_safe: uuid.SafeUUID = uuid.SafeUUID.unknown,
    ) -> None:
        r"""Create a UUID."""

        if int is None or [hex, bytes, bytes_le, fields].count(None) != 4:
            return super().__init__(
                hex=hex,
                bytes=bytes,
                bytes_le=bytes_le,
                fields=fields,
                int=int,
                version=version,
                is_safe=is_safe,
            )
        if not 0 <= int < 1 << 128:
            raise ValueError("int is out of range (need a 128-bit value)")
        if version is not None:
            if not 6 <= version <= 8:
                raise ValueError("illegal version number")
            # Set the variant to RFC 4122.
            int &= ~(0xC000 << 48)
            int |= 0x8000 << 48
            # Set the version number.
            int &= ~(0xF000 << 64)
            int |= version << 76
        super().__init__(int=int, is_safe=is_safe)

    @property
    def subsec(self) -> int:
        return ((self.int >> 64) & 0x0FFF) << 8 | ((self.int >> 54) & 0xFF)

    @property
    def time(self) -> int:
        if self.version == 6:
            return (
                (self.time_low << 28)
                | (self.time_mid << 12)
                | (self.time_hi_version & 0x0FFF)
            )
        if self.version == 7:
            return self.int >> 80
        if self.version == 8:
            return (self.int >> 80) * 10**6 + _subsec_decode(self.subsec)
        return super().time


def _subsec_decode(value: int) -> int:
    return -(-value * 10**6 // 2**20)


_last_v7_timestamp = None


def uuid7() -> UUID:
    r"""UUID version 7 features a time-ordered value field derived from the
    widely implemented and well known Unix Epoch timestamp source, the
    number of milliseconds since midnight 1 Jan 1970 UTC, leap seconds
    excluded. As well as improved entropy characteristics over versions
    1 or 6.

    Implementations SHOULD utilize UUID version 7 over UUID version 1 and
    6 if possible."""

    global _last_v7_timestamp

    nanoseconds = time.time_ns()
    timestamp_ms = nanoseconds // 10**6
    if _last_v7_timestamp is not None and timestamp_ms <= _last_v7_timestamp:
        timestamp_ms = _last_v7_timestamp + 1
    _last_v7_timestamp = timestamp_ms
    uuid_int = (timestamp_ms & 0xFFFFFFFFFFFF) << 80
    uuid_int |= secrets.randbits(76)
    return UUID(int=uuid_int, version=7)
