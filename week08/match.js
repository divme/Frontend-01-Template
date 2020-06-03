function match(selector, element) {
    if (!selector || !element) return false;

    if (selector.charAt(0) === "#") {
        var attr = element.getAttribute('id');
        return !!(attr && attr === selector.slice(1));
    }
    if (selector.charAt(0) === ".") {
        var classList = element.classList;
        return !!(classList && classList.contains(selector.slice(1)));
    }
    return String(element.nodeName).toLowerCase() === String(selector).toLowerCase()
}