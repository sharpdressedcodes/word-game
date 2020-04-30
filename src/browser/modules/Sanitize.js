import sanitize from 'sanitize';
import sanitizeHtml from 'sanitize-html';

export default function sanitizeString(str) {
    return sanitizeHtml(sanitize().value(str, String), {
        allowedTags: [],
        allowedAttributes: {}
    });
}
