import zlib from "zlib";

function compress(blob: Buffer) {
  return zlib.brotliCompressSync(blob, {
    params: {
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_GENERIC,
      [zlib.constants.BROTLI_PARAM_QUALITY]: 1,
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: blob.length,
    },
  });
}

export { compress };
