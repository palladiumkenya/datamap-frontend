export const parseCSV = (csvData) => {
    const rows = csvData.split("\n"); // Split CSV data into rows
    let headers = rows[0].split(","); // Assuming the first row contains headers
    headers = headers.map(h => h.replace(/\r/g, ""));

    const result = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj = {};
        let currentField = '';
        let insideQuotes = false;

        for (let j = 0; j < row.length; j++) {
            const char = row[j];
            const nextChar = row[j + 1];

            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    currentField += '"';
                    j++; // Skip the next quote
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                obj[headers[Object.keys(obj).length]] = currentField.trim();
                currentField = '';
            } else {
                currentField += char;
            }
        }

        // Add the last field to the object
        obj[headers[Object.keys(obj).length]] = currentField.trim();
        result.push(obj);
    }

    // Intentionally discard the trailing element due to an extra comma in the CSV
    return result.slice(0, -1);
};
