export function parseVersionChanges(versionData) {
    return versionData.map((change) => {
        const oldVal = change.old_value !== "None" ? JSON.parse(change.old_value) : null;
        const newVal = change.new_value !== "None" ? JSON.parse(change.new_value) : null;

        const changes = {
            id: change.id,
            term_id: change.term_id,
            operation: change.operation,
            version_number: change.version_number,
            changed_at: change.changed_at,
            fields: [],
        };

        // Compare fields
        if (oldVal && newVal) {
            Object.keys(newVal).forEach((key) => {
                if (oldVal[key] !== newVal[key]) {
                    changes.fields.push({ field: key, old: oldVal[key], new: newVal[key] });
                }
            });
        } else if (!oldVal && newVal) {
            changes.fields = Object.keys(newVal).map((key) => ({ field: key, old: null, new: newVal[key] }));
        } else if (oldVal && !newVal) {
            changes.fields = Object.keys(oldVal).map((key) => ({ field: key, old: oldVal[key], new: null }));
        }

        return changes;
    });
}
