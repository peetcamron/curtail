'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crop = crop;
exports.convert = convert;
exports.resize = resize;
exports.pad = pad;

var utils = _interopRequireWildcard(require("./utils.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Curtail is a pure JavaScript image manipulation tool.
 */

/**
 * Crop an image to a specified size by providing the start location of the crop and
 * the dimensions that the product should have.
 * 
 * @since 0.1.0
 * 
 * @param {string} path The path to the image to crop.
 * @param {number} x The horizontal location in the original image to begin the crop.
 * @param {number} y The vertical location in the original image to being the crop.
 * @param {number} width The width of the final cropped image.
 * @param {number} height The height of of the final cropped image.
 * @param {Object} [options]
 * @param {boolean} [options.autoDownload=false] Indicates whether the image should download after the cropping is complete or not.
 * @param {string} [options.crossOrigin=null] Sets the cross-origin property of images originating from external sources.
 * 
 * @returns {Promize<HTMLImageElement>} Returns the newly cropped image as an image element.
 */
function crop(path, x, y, width, height) {
  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var _options = Object.assign({
    autoDownload: false,
    crossOrigin: null
  }, options);

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var fileInfo = utils.extractFileInfo(path);
  var originalImage = new Image();
  return new Promise(function (resolve, reject) {
    originalImage.addEventListener('load', function loadImage() {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(originalImage, x, y, width, height, 0, 0, width, height);
      var croppedImage = new Image();
      croppedImage.addEventListener('load', function loadCroppedImage() {
        if (_options.autoDownload) {
          var imageLink = document.createElement('a');
          imageLink.href = croppedImage.src;
          imageLink.download = fileInfo.name + '.' + fileInfo.ext;
          imageLink.click();
        }

        croppedImage.removeEventListener('load', loadCroppedImage);
        resolve(croppedImage);
      });
      croppedImage.addEventListener('error', function loadCroppedImageError(err) {
        croppedImage.removeEventListener('error', loadCroppedImage);
        reject(err);
      });
      croppedImage.src = canvas.toDataURL("image/".concat(fileInfo.ext)).replace("image/".concat(fileInfo.ext), 'image/octet-stream');
    });
    originalImage.addEventListener('error', function loadImageError(err) {
      originalImage.removeEventListener('error', loadImageError);
      reject(err);
    });
    originalImage.src = path;
    if (_options.crossOrigin) originalImage.crossOrigin = _options.crossOrigin;
  });
}
/**
 * Convert an image from one format to another format.
 * 
 * @since 1.0.0
 * 
 * @param {string} path The path to the image to convert to another format.
 * @param {string} format The new format for the image.
 * @param {Object} [options]
 * @param {boolean} [options.autoDownload=false] Indicates whether the image should download after the cropping is complete or not.
 * @param {string} [options.crossOrigin=null] Sets the cross-origin property of images originating from external sources.
 * 
 * @returns {Promise<HTMLImageElement>} Returns the newly formatted image as an image element.
 */


function convert(path, format) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _options = Object.assign({
    autoDownload: false,
    crossOrigin: null
  }, options);

  var nonTransparentFormats = ['jpg', 'jpeg', 'gif', 'bmp'];
  var fileInfo = utils.extractFileInfo(path);
  if (fileInfo.ext === format) return;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var originalImage = new Image();
  return new Promise(function (resolve, reject) {
    originalImage.addEventListener('load', function loadImage() {
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;

      if (nonTransparentFormats.includes(format)) {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(originalImage, 0, 0);
      var convertedImage = new Image();
      convertedImage.addEventListener('load', function loadConvertedImage() {
        if (_options.autoDownload) {
          var imageLink = document.createElement('a');
          imageLink.href = convertedImage.src;
          imageLink.download = fileInfo.name + '.' + format;
          imageLink.click();
        }

        convertedImage.removeEventListener('load', loadConvertedImage);
        resolve(convertedImage);
      });
      convertedImage.addEventListener('error', function loadConvertedImageError(err) {
        convertedImage.removeEventListener('load', loadConvertedImageError);
        reject(err);
      });
      convertedImage.src = canvas.toDataURL("image/".concat(format));
      originalImage.removeEventListener('load', loadImage);
    });
    originalImage.addEventListener('error', function loadImageError(err) {
      originalImage.removeEventListener('load', loadImageError);
      reject(err);
    });
    originalImage.src = path;
    if (_options.crossOrigin) originalImage.crossOrigin = _options.crossOrigin;
  });
}
/**
 * Resize an image to a new dimension.
 * 
 * @since 1.0.0
 * 
 * @param {string} path The path to the image to resize.
 * @param {string} dimension Which dimension to resize, either width or height. Keep in mind that if you're preserving the aspect ratio, the other will resize accordingly.
 * @param {number} size The new size to make the specified dimension.
 * @param {Object} [options]
 * @param {boolean} [options.preserveAspectRatio=true] Indicates whether the width and height will resize together to preserve the aspect ratio of the image.
 * @param {boolean} [options.autoDownload=false] Indicates whether the image should download after the cropping is complete or not.
 * @param {string} [options.crossOrigin=null] Sets the cross-origin property of images originating from external sources.
 * 
 * @returns {Promise<HTMLImageElement>} Returns the newly resized image as an image element.
 */


function resize(path, dimension, size) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var _options = Object.assign({
    preserveAspectRatio: true,
    autoDownload: false,
    crossOrigin: null
  }, options);

  var originalImage = new Image();
  return new Promise(function (resolve, reject) {
    originalImage.addEventListener('load', function loadImage() {
      var aspectRatio = utils.simplify(originalImage.width, originalImage.height);

      if (dimension === 'width') {
        originalImage.width = size;
        if (_options.preserveAspectRatio) originalImage.height = Math.round(aspectRatio.denominator / aspectRatio.numerator * size);
      } else if (dimension === 'height') {
        originalImage.height = size;
        if (_options.preserveAspectRatio) originalImage.width = Math.round(aspectRatio.numerator / aspectRatio.denominator * size);
      }

      originalImage.removeEventListener('load', loadImage);

      if (_options.autoDownload) {
        var imageLink = document.createElement('a');
        imageLink.href = convertedImage.src;
        imageLink.download = fileInfo.name + '.' + format;
        imageLink.click();
      }

      resolve(originalImage);
    });
    originalImage.addEventListener('error', function loadImageError(err) {
      originalImage.removeEventListener('error', loadImageError);
      reject(err);
    });
    originalImage.src = path;
    if (_options.crossOrigin) originalImage.crossOrigin = _options.crossOrigin;
  });
}
/**
 * Adds the specified amount of padding around an image.
 * 
 * Note that the padding will not be even on images that are not square.
 * 
 * @since 2.0.0
 * 
 * @param {string} path The path to the image to add padding to.
 * @param {number} padding The amount of padding to add to the image.
 * @param {Object} [options]
 * @param {string} [options.paddingColor='transparent'] The color that the padding will be. This value can be any valid CSS color value such as white or #FFFFFF.
 * @param {boolean} [options.autoDownload=false] Indicates whether the image should download after the cropping is complete or not.
 * @param {string} [options.crossOrigin=null] Sets the cross-origin property of images originating from external sources.
 * 
 * @returns {Promise<HTMLImageElement>} Returns the newly padded image as an image element.
 */


function pad(path, padding) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _options = Object.assign({
    paddingColor: 'transparent',
    autoDownload: false,
    crossOrigin: null
  }, options);

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var fileInfo = utils.extractFileInfo(path);
  var originalImage = new Image();
  return new Promise(function (resolve, reject) {
    originalImage.addEventListener('load', function loadImage() {
      canvas.width = originalImage.width + padding * 2;
      canvas.height = originalImage.height + padding * 2;

      if (_options.paddingColor !== 'transparent') {
        ctx.fillStyle = _options.paddingColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(originalImage, canvas.width / 2 - originalImage.width / 2, canvas.height / 2 - originalImage.height / 2, originalImage.width, originalImage.height);
      var paddedImage = new Image();
      paddedImage.addEventListener('load', function loadPaddedImage() {
        if (_options.autoDownload) {
          var imageLink = document.createElement('a');
          imageLink.href = paddedImage.src;
          imageLink.download = fileInfo.name + '.' + format;
          imageLink.click();
        }

        paddedImage.removeEventListener('load', loadPaddedImage);
        resolve(paddedImage);
      });
      paddedImage.addEventListener('error', function loadPaddedImageError(err) {
        paddedImage.removeEventListener('load', loadPaddedImageError);
        reject(err);
      });
      paddedImage.src = canvas.toDataURL("image/".concat(fileInfo.ext));
      originalImage.removeEventListener('load', loadImage);
    });
    originalImage.addEventListener('error', function loadImageError(err) {
      originalImage.removeEventListener('error', loadImageError);
      reject(err);
    });
    originalImage.src = path;
    if (_options.crossOrigin) originalImage.crossOrigin = _options.crossOrigin;
  });
}
//# sourceMappingURL=curtail.js.map