exports.objectIdToString = (messages, fields) => {
    return messages.map(m => {
        fields.forEach(field => {
            if (m[field]) {
                m[field] = m[field].toString();
            }
        });
        return m;
    });
}