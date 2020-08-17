export function printImage (image) {
  let canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  let context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, image.width, image.height);

  let newWindow = window.open();
  newWindow.document.write(`<img src="${canvas.toDataURL('image/png')}" />`);
  newWindow.document.close();

  const _timer = window.setTimeout(() => {
    newWindow.print();
    newWindow.close();
    window.clearTimeout(_timer);
  }, 500);
}
