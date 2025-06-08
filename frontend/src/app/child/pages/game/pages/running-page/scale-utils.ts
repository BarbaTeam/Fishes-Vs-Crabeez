export function scaleToCanvas(
    x: number,
    y: number,
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
) {
    const scaleX = canvas.width / 100;
    const scaleY = canvas.height / 100;

    return {
        x: x * scaleX,
        y: y * scaleY,
        width: width * scaleX,
        height: height * scaleY,
    };
}