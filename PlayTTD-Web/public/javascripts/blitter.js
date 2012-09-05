function _playttd_blitter_skipTopPixels(src, skipLineCount) {
  var y;
  var trans;
  var pixels;

  for (y = 0; y < skipLineCount; ++y) {
    while (true) {
      trans = HEAPU8[src++];
      pixels = HEAPU8[src++];

      if (trans == 0 && pixels == 0) {
        break;
      }
      
      src += pixels;
    }
  } 

  return src;
}

function _playttd_blitter_drawLine(dst, src, width, skip_left, mode, bp_remap) {
  var trans;
  var pixels;
  var skipCount;

  var src_next = src;
  
  while (true) {
    src = src_next;
    trans = HEAPU8[src++];
    pixels = HEAPU8[src++];
    src_next = src + pixels;
    
    if (trans == 0 && pixels == 0) {
      break;  
    } 

    if (width <= 0)  {
      continue;
    }

    if (skip_left != 0) {
      if (skip_left < trans) {
        trans -= skip_left;
        skip_left = 0;
      } else {
        skip_left -= trans;
        trans = 0;
      }

      if (skip_left < pixels) {
        src += skip_left;
        pixels -= skip_left;
        skip_left = 0;
      } else {
        src += pixels;
        skip_left -= pixels;
        pixels = 0;
      }
    }
    
    if (skip_left != 0) {
      continue;
    }

    /* Skip transparent pixels */
    dst += trans;
    width -= trans;
    if (width <= 0 || pixels == 0)  {
      continue;
    }

    pixels = Math.min(pixels, width);
    width -= pixels;

    __draw(mode, dst, src, pixels, bp_remap);
    dst += pixels; 
    src += pixels;
  }

  return src;
}

function __draw(mode, dst, src, pixels, bp_remap) {
  switch (mode) {
    case 1/*BM_COLOUR_REMAP*/: {
      __drawWithRemap(dst, src, pixels, bp_remap);
      break;
    }

    case 2/*BM_TRANSPARENT*/: {
      __drawTransparent(dst, src, pixels, bp_remap);
      break;
    }

    default:
      __drawCopy(dst, src, pixels);
      break;
  }
}

function __drawWithRemap(dst, src, pixels, bp_remap) {
  var m;
  while (pixels > 0) {
    m = HEAPU8[bp_remap + HEAPU8[src]];
    
    if (m != 0) {
      HEAPU8[dst] = m;
    }

    ++dst; 
    ++src;
    --pixels;
  }
}

function __drawTransparent(dst, src, pixels, bp_remap) {
  src += pixels;
  
  while (pixels > 0) {
    HEAPU8[dst] = HEAPU8[bp_remap + HEAPU8[dst]];
    ++dst;
    --pixels;
  }
}

function __drawCopy(dst, src, pixels) {
  while (pixels > 0) {
    HEAPU8[dst] = HEAPU8[src];
    ++dst; 
    ++src;
    --pixels;
  }
}