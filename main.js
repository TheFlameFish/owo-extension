// Only run a certain amount of times
const PROBABILITY = 100; // Probability per word, 1/x

const REPLACEMENT = {
    'r': 'w',   'L': 'W',
    'l': 'w',   'R': 'W',
    'ove': 'uv', 'OVE': 'UV',
    'o': 'owo', 'O': 'OwO',
    '!': '!!!', '?': '???'
}

/**
 * OwO-ify a string. Uses about the same algorithm as :3 in Create: Estrogen (https://github.com/MayaqqDev/Estrogen)
 * @param {string} string 
 */
function owofy(string) {
    let new_string = string;

    for (const [key, value] of Object.entries(REPLACEMENT)) {
        new_string = new_string.replace(key, value);
    }
    const stringLength = new_string.length;

    // Convert to uppercase if string length is divisible by 3
    if (stringLength % 3 === 0) {
        new_string = new_string.toUpperCase();
    }

    if (stringLength % 2 === 0) {
        // Add more letters to the end of words (not numbers)
        new_string = new_string.replace(/([\p{L}])(\b)/gu, '$1$1$1$1$2');
    } else {
        // 50% chance to duplicate the first letter and add '-'
        new_string = new_string.replace(/\b([\p{L}])(\p{L}*)\b/gu, '$1-$1$2');
    }

    return new_string;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", transformTextNodes);
} else {
    transformTextNodes();
}

function transformTextNodes() {
    document.querySelectorAll("*").forEach((node) => {
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            !["STYLE", "SCRIPT"].includes(node.tagName) &&
            !isEditable(node) // Skip editable elements
        ) {
            Array.from(node.childNodes).forEach((child) => {
                if (
                    child.nodeType === Node.TEXT_NODE &&
                    child.textContent.trim().length > 0
                ) {
                    // If this text node hasn't been processed before, add the original content
                    if (!child.hasOwnProperty('originalText')) {
                        child.originalText = child.textContent;
                    }

                    const original = child.originalText;

                    let newContent = "";
                    const words = original.split(/\b/); // Split by word boundaries
                    for (let word of words) {
                        if (/[^a-zA-Z0-9]/.test(word) || Math.floor(Math.random() * PROBABILITY) + 1 !== 1) { // If it's not alphanumeric or random chance fails
                            newContent += word;
                        } else {
                            newContent += owofy(word);
                        }
                    }

                    child.textContent = newContent.trim();
                }
            });
        }
    });
}

function isEditable(node) {
    return (
        node.isContentEditable ||
        node.tagName === "INPUT" ||
        node.tagName === "TEXTAREA"
    );
}
