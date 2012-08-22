function getImageData(w, h) {
	var data = new Int32Array(w * h * 4);
	for (var i = 0; i < data.length; i = i + 4) {
		data[i] = Math.floor(Math.random() * 256);
		data[i +1] = Math.floor(Math.random() * 256);
		data[i +2] = 0;//Math.floor(Math.random() * 256);
		data[i +3] = 255;
	}
	return data;
}

function toDataURI(buffer) {
	var size = buffer.length;
	var pixs = new Int32Array(1024 * 768);
	for (var i = 0; i < size; i = i + 4) {
		pixs[i/4] = 0xFFFFFF;
	}
	return datauri("image/bmp;", bmp_rgb(1024, 768, pixs));
}


//---

/* jsbmp

Create bitmap files using JavaScript. The use-case this was written
for is to create simple images which can be provided in `data` URIs.

Copyright (c) 2009 Sam Angove <sam [a inna circle] rephrase [period] net>

License: MIT

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
Create the binary contents of a bitmap file.

This is not a public interface and is subject to change.

Arguments:

    width -- width of the bitmap
    height -- height of the bitmap
    palette -- array of 'rrggbb' strings (if appropriate)
    imgdata -- pixel data in faux-binary escaped text
    bpp -- bits per pixel; use in conjunction with compression
    compression -- compression mode (e.g. uncompressed, 8-bit RLE, 4-bit RLE)
*/
function _bmp(width, height, palette, imgdata, bpp, compression) {

    var imgdatasize = imgdata.length;
    var palettelength = palette.length;
    var palettesize = palettelength * 4; // 4 bytes per colour
    var filesize = 64 + palettesize + imgdatasize; // size of file
    var pixeloffset = 54 + palettesize; // pixel data offset
    var data = [
        "BM",                                 // magic number
        _pack(width),      // size of file
        "\x00\x00\x00\x00",               // unused
        _pack(pixeloffset),   // number of bytes until pixel data
        "\x28\x00\x00\x00",               // number of bytes left in the header
        _pack(width),         // width of pixmap
        _pack(height),        // height of pixmap
        "\x01\x00",                         // number of colour planes, must be 1
        _pack(bpp, 2),           // bits per pixel
        _pack(compression),   // compression mode
        _pack(imgdatasize),   // size of raw BMP data (after the header)
        "\x13\x0B\x00\x00",               // # pixels per metre horizontal res.
        "\x13\x0B\x00\x00",               // # pixels per metre vertical res
        _pack(palettelength), // num colours in palette
        "\x00\x00\x00\x00"                // all colours are important

        // END OF HEADER
     ];

    for (var i=0; i<palette.length; ++i) {
        data.push(_pack(parseInt(palette[i], 16)));
    }
    data.push(imgdata);
    return data.join("");
}
/*
Pack JS integer (signed big-endian?) `num` into a little-endian binary string
of length `len`.
*/
function _pack(num, len) {
    var o = [], len = ((typeof len == 'undefined') ? 4 : len);
    for (var i=0; i<len; ++i) {
        o.push(String.fromCharCode((num >> (i * 8)) & 0xff));
    }
    return o.join("");
}


/*
Create an uncompressed Windows bitmap (BI_RGB) given width, height and an
array of pixels.

Pixels should be in BMP order, i.e. starting at the bottom left, going up
one row at a time.

Example:

    var onebluepixel = bmp(1, 1, ['0000ff']);
*/
function bmp_rgb(width, height, pixarray) {
    var rowsize = (width * 3);
    var rowpadding = (rowsize % 4);
    if (rowpadding) rowpadding = Math.abs(4 - rowpadding);
    var imgdatasize = (rowsize + rowpadding) * height;

    var i, j, pix;

    // Based on profiling, it's more than 10x faster to reverse the array
    // and pop items off the end than to shift them of the front. WTF.
    //pixarray.reverse();
    var pixels = [];
    for (i=0; i<height; ++i) {
    	var offset = i * width;
        for (j=0; j<width; ++j) {
            pix = 0xFFFFFFF;//pixarray[offset + j];
            pixels.push(_pack(pix));
        }
        for (j=0; j<rowpadding; ++j) {
            pixels.push("\x00");
        }
    }
    return _bmp(width, height, [], pixels.join(""), 24, 0);
}