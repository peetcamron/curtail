'use strict'

/**
 * The functions in extract deal with getting information from the
 * src path such as file name or file extension.
 * 
 * @since 1.0.0
 */

/**
 * Extract the file name and extension from the provided src path.
 * 
 * @since 1.0.0
 * 
 * @param {string} src The path to the image file.
 * 
 * @returns {Object} An object containing the file's name and extension.
 */
function getFileInfo(src) {

  let nameIndex = 0;
  let extIndex = 0;

  let fileInfo = {
    name: null,
    ext: null
  };

  if (src.lastIndexOf('/') > -1) nameIndex = src.lastIndexOf('/');

  extIndex = src.lastIndexOf('.');

  fileInfo.name = src.slice(nameIndex + 1, extIndex);
  fileInfo.ext = src.slice(extIndex + 1);

  return fileInfo;

}

/**
 * The functions in math deal with any mathematical operations not
 * supported by native JavaScript.
 * 
 * @since 0.1.0
 */

/**
 * Simplify a fraction using the greatest common divisor.
 * 
 * @since 0.1.0
 * 
 * @param {number} numerator The top number of the original fraction.
 * @param {number} denominator The bottom number of the original fraction.
 * 
 * @returns {Array} An array consisting of the two values representing the numerator and denominator of the simplified fraction.
 */
function simplify(numerator, denominator) {

  const num = gcd(numerator, denominator);

  return [numerator / num, denominator / num];

}

/**
 * Find the greatest common divisor between two numbers.
 * 
 * @since 0.1.0
 * 
 * @param {number} a The first number.
 * @param {number} b The second number.
 * 
 * @returns {number} The GCD between the two numbers.
 */
function gcd(a, b) {

  while (b !== 0) {

    let temp = a;

    a = b;

    b = temp % b;

  }

  return a;

}

/**
 * Curtail is a pure JavaScript in browser canvas-based image manipulation tool.
 * 
 * @since 0.1.0
 */
export class Curtail {

  /**
   * @param {Object} [options] Options used to alter the functionality of Curtail.
   * @param {boolean} [autoDownload=false] Indicates whether the new image will be queued to download automatically after it is transformed.
   * @param {string} [crossOrigin=null] Set a cross-origin property for images loaded from non-local sources.
   */
  constructor(options = {}) {

    /**
     * Combine the user options with the defaults for any options not set.
     * 
     * @prop {Object}
     * @readonly
     */
    this._options = Object.assign({

      /**
       * Indicates whether the image should auto-download after the edit.
       * 
       * @prop {boolean}
       */
      autoDownload: false,

      /**
       * Sets a cross-origin property for the images used.
       * 
       * @prop {string}
       */
      crossOrigin: null

    }, options);

    /**
     * Used when converting an image to another format, it has to be from the
     * following supported formats.
     * 
     * @prop {Object}
     */
    this.FORMAT = {

      PNG: { ext: 'png', transparent: true },

      JPG: { ext: 'jpg', transparent: false },

      GIF: { ext: 'gif', transparent: false },

      BMP: { ext: 'bmp', transparent: false },

      WEBP: { ext: 'webp', transparent: true },

      PDF: { ext: 'pdf', transparent: true },

    };

  }

  /**
   * Crop an image down to a specified size by providing the location to being cropping
   * the image and the dimensions of the new desired image.
   * 
   * @since 0.1.0
   * 
   * @param {string} src The path to the image to crop.
   * @param {number} x The x location in the original image to begin the crop.
   * @param {number} y The y location in the original image to begin the crop.
   * @param {number} width The desired width for the cropped image.
   * @param {number} height The desired height for the cropped image.
   * 
   * @returns {Promise<HTMLImageElement>} The newly cropped image.
   */
  crop(src, x, y, width, height) {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const nameIndex = src.lastIndexOf('/') + 1 || 0;
    const extIndex = src.lastIndexOf('.');

    const srcName = src.slice(nameIndex, extIndex);
    const srcExt = src.slice(extIndex + 1);

    const originalImage = new Image();

    return new Promise((resolve, reject) => {

      originalImage.onload = () => {

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(originalImage, x, y, width, height, 0, 0, width, height);

        const croppedImage = new Image();

        croppedImage.onload = () => {

          if (this._options.autoDownload) {

            let img = document.createElement('a');

            img.href = croppedImage.src;
            img.download = srcName + '.' + srcExt;

            img.click();

          }

          resolve(croppedImage);

        }

        croppedImage.onerror = (err) => reject(err);

        croppedImage.src = canvas.toDataURL(`image/${srcExt}`).replace(`image/${srcExt}`, 'image/octet-stream');

      };

      originalImage.onerror = (err) => reject(err);

      originalImage.src = src;
      if (this._options.crossOrigin) originalImage.crossOrigin = this._options.crossOrigin;

    });

  }

  /**
   * Convert an image from one format to another format, eg png to jpg.
   * 
   * @since 1.0.0
   * 
   * @param {string} src The path to the image to convert.
   * @param {FORMAT} format The format, from the `curtail.FORMAT` object to convert the image to.
   * 
   * @returns {Promise<HTMLImageElement>} The newly converted image.
   */
  convert(src, format) {

    const fileInfo = extract.getFileInfo(src);

    if (fileInfo.ext === format.ext) {

      console.warn('Image is already in desired format.');
      return;

    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const originalImage = new Image();

    return new Promise((resolve, reject) => {

      originalImage.onload = () => {

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        if (!format.transparent) {

          ctx.fillStyle = '#FFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

        }

        ctx.drawImage(originalImage, 0, 0);

        const newImage = new Image();

        newImage.onload = () => {

          if (this._options.autoDownload) {

            let img = document.createElement('a');

            img.href = newImage.src;
            img.download = fileInfo.name + '.' + format.ext;

            img.click();

          }

          resolve(newImage);

        };

        newImage.onerror = (err) => reject(err);

        newImage.src = canvas.toDataURL(`image/${format.ext}`);

      };

      originalImage.onerror = (err) => reject(err);

      originalImage.src = src;
      if (this._options.crossOrigin) originalImage.crossOrigin = this._options.crossOrigin;

    });

  }

  /**
   * Resize an image.
   * 
   * The aspect ratio is automatically preserved when resizing an image unless
   * the `preserveAspectRatio` parameter is set to false.
   * 
   * @since 0.1.0
   * 
   * @param {string} src The path to the image to convert.
   * @param {string} dimsension Whether you want to resize the width or height of the image.
   * @param {number} size The new size to make the specified dimension in pixels.
   * @param {boolean} [preserveAspectRatio=true] Indicates whether the width and height should resize together to preserve the aspect ratio of the image.
   * 
   * @returns {Promise<HTMLImageElement>} The newly resized image.
   */
  resize(src, dimension, size, preserveAspectRatio = true) {

    const image = new Image();

    return new Promise((resolve, reject) => {

      image.onload = () => {

        const aspectRatio = math.simplify(image.width, image.height);

        if (dimension === 'width') {

          image.width = size;

          if (preserveAspectRatio) image.height = Math.round((aspectRatio[1] / aspectRatio[0]) * size);

        }

        else if (dimension === 'height') {

          image.height = size;

          if (preserveAspectRatio) image.width = Math.round((aspectRatio[0] / aspectRatio[1]) * size);

        }

        resolve(image);

      };

      image.onerror = (err) => reject(err);

      image.src = src;
      if (this._options.crossOrigin) image.crossOrigin = this._options.crossOrigin;

    });

  }

}