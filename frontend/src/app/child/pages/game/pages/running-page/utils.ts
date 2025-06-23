export const VIRTUAL_WIDTH = 100;
export const VIRTUAL_HEIGHT = VIRTUAL_WIDTH * 9 / 16;

/**
 * Calcule les coordonnées et dimensions physiques sur le canvas à partir des coordonnées virtuelles.
 * Gère également le redimensionnement optionnel d'une image pour garder ses proportions.
 */
export function scaleToCanvas(
    x: number,
    y: number,
    virtualWidth: number,
    virtualHeight: number,
    canvas: HTMLCanvasElement,
    image?: HTMLImageElement
) {
    const scaleX = canvas.width / VIRTUAL_WIDTH;
    const scaleY = canvas.height / VIRTUAL_HEIGHT;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    let width = virtualWidth * scaleX;
    let height = virtualHeight * scaleY;

    if (image && image.width > 0 && image.height > 0) {
        const imgAspectRatio = image.width / image.height;
        const boxAspectRatio = width / height;

        if (imgAspectRatio > boxAspectRatio) {
            height = width / imgAspectRatio;
        } else {
            width = height * imgAspectRatio;
        }
    }

    return {
        x: scaledX - width / 2,
        y: scaledY - height / 2,
        width,
        height
    };
}
