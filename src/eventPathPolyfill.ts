// credits to: https://stackoverflow.com/a/45061945/3951023
function composePath(el) {
  var path = [];
  while (el) {
    path.push(el);
    if (el.tagName === 'HTML') {
      path.push(document);
      path.push(window);
      return path;
    }
    el = el.parentElement;
  }
}

export default function eventPath(event) {
  return event.path || (event.composedPath && event.composedPath()) || composePath(event.target);
}
