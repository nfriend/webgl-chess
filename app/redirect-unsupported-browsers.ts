require('script!./third-party/modernizr-custom.js');

if (!(Modernizr.webworkers && Modernizr.webgl && Modernizr.requestanimationframe && Modernizr.canvas)) {
    window.location.href = './unsupported-browser.html';
    throw 'Unsupported browser detected!  Redirecting to an informational page.';
}