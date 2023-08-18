import {Framework} from '../framework.js';

import {Util} from '../util.js';

export class NiiVue extends Framework {
  
  constructor(instance) {

    super(instance);
    this.name = 'niivue';

    this.flip_on_png = true;

  }

  get_current_image(from_canvas) {

    let element = this.instance.canvas;
    let pixels = null;
    let width = null;
    let height = null;

    // TODO only support from_canvas now
    from_canvas = true;

    if (typeof from_canvas != 'undefined') {

      // TODO this is hacky going through the canvas
      // later should grab the real volume data

      let old_crosshaircolor = this.instance.opts.crosshairColor;
      let old_crosshairwidth = this.instance.opts.crosshairWidth;

      this.instance.setCrosshairColor([0,0,0,0]);
      this.instance.opts.crosshairWidth=0;
      this.instance.updateGLVolume();


      let ctx = this.instance.gl;

      
      width = ctx.drawingBufferWidth;
      height = ctx.drawingBufferHeight;

      pixels = new Uint8Array(width * height * 4);
      ctx.readPixels(
        0, 
        0, 
        width, 
        height, 
        ctx.RGBA, 
        ctx.UNSIGNED_BYTE, 
        pixels);

      // restore crosshairs
      this.instance.setCrosshairColor(old_crosshaircolor);
      this.instance.opts.crosshairWidth = old_crosshairwidth;

      // convert rgba pixels to grayscale
      pixels = Util.rgba_to_grayscale(pixels);


    } else {

      // TODO
      // not easily possible yet
      // we could hack it using 
      // nv.back.get_value(x,y,z)
      // based on the dimensions
      // nv.back.dims.slice(1);
      // but devs promised easy access in the future

    }

    return {'data':pixels, 'width':width, 'height':height};

  }

  set_current_image(new_pixels) {

    // TODO this is hacky since we dont work with the real volume yet
    // create new canvas
    // put pixels on canvas
    // show canvas
    // hide on click

    let originalcanvas = this.instance.canvas;

    let newcanvas = window.document.createElement('canvas');
    newcanvas.width = originalcanvas.width;
    newcanvas.height = originalcanvas.height;

    // put new_pixels down
    let ctx = newcanvas.getContext('2d');

    let new_pixels_rgba = Util.grayscale_to_rgba(new_pixels);
    // let new_pixels_rgba = new_pixels;

    let new_pixels_clamped = new Uint8ClampedArray(new_pixels_rgba);

    let new_image_data = new ImageData(new_pixels_clamped, newcanvas.width, newcanvas.height);
    

    ctx.putImageData(new_image_data, 0, 0);


    newcanvas.onclick = function() {

      // on click, we will restore the nv canvas
      newcanvas.parentNode.replaceChild(originalcanvas, newcanvas);

    }

    // replace nv canvas with new one
    originalcanvas.parentNode.replaceChild(newcanvas, originalcanvas);


  }

}