import { ActivatedRoute, Router } from '@angular/router';



export function isInHomePage(route: ActivatedRoute,  router: Router): boolean {
    const firstURLSegment = router.url.split('/').filter(s => s)[0];
    return firstURLSegment === 'home';
}

export function isInChildPage(route: ActivatedRoute, router: Router): boolean {
    const firstURLSegment = router.url.split('/').filter(s => s)[0];
    return firstURLSegment === 'child';
}

export function isInErgoPage(route: ActivatedRoute,  router: Router): boolean {
    const firstURLSegment = router.url.split('/').filter(s => s)[0];
    return firstURLSegment === 'ergo';
}
