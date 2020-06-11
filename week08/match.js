// 就先随便写给匹配 id class tag的吧，老不做作业，难受；补浏览器作业的时候再细看
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
