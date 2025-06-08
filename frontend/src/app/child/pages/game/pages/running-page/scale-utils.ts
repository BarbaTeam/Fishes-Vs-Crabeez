export function scaleToCanvas(
    x: number,
    y: number,
    virtualWidth: number,
    virtualHeight: number,
    canvas: HTMLCanvasElement,
    image?: HTMLImageElement 
) {
    const scaleX = canvas.width / 100;
    const scaleY = canvas.height / 100;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    let width = virtualWidth * scaleX;
    let height = virtualHeight * scaleY;
    if (image && image.width > 0 && image.height > 0) {
        const imgRatio = image.width / image.height;
        const canvasRatio = width / height;

        if (imgRatio > canvasRatio) {
            height = width / imgRatio;
        } else {
            width = height * imgRatio;
        }
    }

    return {
        x: scaledX - width / 2,
        y: scaledY - height / 2,
        width,
        height
    };
}
