export function createElementWithClass(nodeType, classNames, dataAttributes) {
    const element = document.createElement(nodeType);

    if (classNames) {
        if (Array.isArray(classNames)) {
            classNames.forEach(className => {
                element.classList.add(className);
            });
        } else {
            element.classList.add(classNames);
        }
    }

    if (dataAttributes) {
        Object.entries(dataAttributes).forEach(([attributeName, attributeValue]) => {
            element.dataset[attributeName] = attributeValue;
        });
    }

    return element;
}

export function moveElementOnDom(element, position) {
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
}

export function getElementPositionOnDom(element) {
    const style = getComputedStyle(element);

    return {
        x: parsePosition(element.style.position.left || style.left),
        y: parsePosition(element.style.position.top || style.top),
    };
}

export function getElementDimensions(element) {
    const { width, height } = element.getBoundingClientRect();

    return {
        width,
        height,
    };
}

function parsePosition(position) {
    return parseInt(position.replace('px', ''));
}
