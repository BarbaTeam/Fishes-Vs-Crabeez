////////////////////////////////////////////////////////////////////////////////
// Imports :
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const Joi = require('joi');


const DB_PATH = "../../../../database";



////////////////////////////////////////////////////////////////////////////////
// Errors :
////////////////////////////////////////////////////////////////////////////////

/**
 * Error thrown when validation against the Joi schema fails.
 */
class ValidationError extends Error {
    /**
     * @param {string} message
     * @param {import('joi').ValidationError} [details]
     */
    constructor(message, details) {
        super(message);
        this.name = 'ValidationError';
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error thrown when an entity with the specified key already exists.
 */
class DuplicateKeyError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);
        this.name = 'DuplicateKeyError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error thrown when an entity with the specified key is not found.
 */
class NotFoundError extends Error {
    /**
     * @param {string} message
     */
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        Error.captureStackTrace(this, this.constructor);
    }
}



////////////////////////////////////////////////////////////////////////////////
// Interfaces (represented as JSDoc typedefs for documentation only) :
////////////////////////////////////////////////////////////////////////////////

/**
 * @template Data
 * @typedef {Object} IDatabaseTable
 * @property {(key: Partial<Data>) => boolean} existsByKey
 * @property {(predicate: (rec: Data) => boolean) => boolean} existsWhere
 * @property {() => Data[]} getAll
 * @property {(key: Partial<Data>) => Data | undefined} getByKey
 * @property {(predicate: (rec: Data) => boolean) => Data[]} getWhere
 * @property {(obj: Omit<Data, keyof Partial<Data>>) => void} create
 * @property {(rec: Data) => void} insert
 * @property {(key: Partial<Data>, update: Partial<Data>) => void} updateByKey
 * @property {(predicate: (rec: Data) => boolean, update: Partial<Data>) => void} updateWhere
 * @property {(key: Partial<Data>) => void} deleteByKey
 * @property {(predicate: (rec: Data) => boolean) => void} removeWhere
 * @property {() => void} reset
 */

/**
 * @template Data
 * @typedef {Object} IDatabaseSingletonTable
 * @property {() => Data} get
 * @property {(update: Partial<Data>) => void} update
 * @property {() => void} reset
 */



////////////////////////////////////////////////////////////////////////////////
// Implementations :
////////////////////////////////////////////////////////////////////////////////

/**
 * @template Data extends Record<string, any>
 * @implements {IDatabaseTable<Data>}
 */
class DatabaseTable {
    /**
     * @param {string} name
     * @param {import('joi').Schema} schema
     * @param {(keyof Data)[]} keyProperties
     * @param {() => Partial<Data>} keyGenerator
     * @param {() => Partial<Data>} initializer
     */
    constructor(name, schema, keyProperties, keyGenerator, initializer) {
        if (!name) throw new Error('Constructor Error: name is required');
        if (!schema) throw new Error('Constructor Error: schema is required');
        if (!keyProperties || keyProperties.length === 0) throw new Error('Constructor Error: at least one key property is required');
        if (!keyGenerator) throw new Error('Constructor Error: keyGenerator is required');
        if (!initializer) throw new Error('Constructor Error: initializer is required');

        this.name = name;
        this.schema = schema;
        this.keyProperties = keyProperties;
        this.keyGenerator = keyGenerator;
        this.initializer = initializer;

        const { error } = this.schema.validate({ ...this.initializer(), ...this.keyGenerator() });
        if (error) {
            throw new ValidationError(`Constructor Error: initializer's return value does not match schema`, error);
        }

        this._filePath = path.resolve(__dirname, `${DB_PATH}/${process.env.DB_FOLDER ?? ''}${this.name.toLowerCase()}.data.json`);

        this._records = [];
        this._load();
    }

    /**
     * @private
     */
    _load() {
        try {
            let parsed;
            if (fs.existsSync(this._filePath)) {
                const raw = fs.readFileSync(this._filePath, 'utf8');
                parsed = raw.length ? JSON.parse(raw) : [];
            } else {
                parsed = [];
            }

            parsed.forEach((rec, index) => {
                const { error } = this.schema.validate(rec);
                if (error) {
                    throw new ValidationError(`Load Error: record at index ${index} in table ${this.name} does not match schema`, error);
                }
            });

            this._records = parsed;
        } catch (err) {
            if (err instanceof ValidationError) throw err;
            throw new Error(`Load Error: failed to load data for table ${this.name} - ${err}`);
        }
    }

    /**
     * @private
     */
    _save() {
        try {
            const dir = path.dirname(this._filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this._filePath, JSON.stringify(this._records, null, 2), 'utf8');
        } catch (err) {
            throw new Error(`Save Error: failed to save data for table ${this.name} - ${err}`);
        }
    }

    existsByKey(key) {
        return this._records.some(rec =>
            this.keyProperties.every(k => rec[k] === key[k])
        );
    }

    existsWhere(predicate) {
        return this._records.some(predicate);
    }

    getAll() {
        return [...this._records];
    }

    getByKey(key) {
        const found = this._records.find(rec =>
            this.keyProperties.every(k => rec[k] === key[k])
        );
        return found ? { ...found } : undefined;
    }

    getWhere(predicate) {
        return this._records.filter(predicate).map(rec => ({ ...rec }));
    }

    create(obj) {
        const rec = { ...this.keyGenerator(), ...applyUpdate(this.initializer(), obj) };
        const { error } = this.schema.validate(rec);
        if (error) {
            throw new ValidationError(`Create Error: new object ${JSON.stringify(rec)} does not match schema`, error);
        }
        this._records.push(rec);
        this._save();
    }

    insert(rec) {
        const { error } = this.schema.validate(rec);
        if (error) {
            throw new ValidationError(`Insert Error: object ${JSON.stringify(rec)} does not match schema`, error);
        }
        const keyObj = this.keyProperties.reduce((acc, k) => ({...acc, [k]: rec[k]}), {});
        if (this.existsByKey(keyObj)) {
            throw new DuplicateKeyError(`Insert Error: record with key ${JSON.stringify(keyObj)} already exists`);
        }
        this._records.push(rec);
        this._save();
    }

    updateByKey(key, update) {
        const idx = this._records.findIndex(
            rec => this.keyProperties.every(k => rec[k] === key[k])
        );
        if (idx === -1) {
            console.warn(`[NoopWarning] Update Warning: no record found for key ${JSON.stringify(key)} thus none have been updated`);
            return;
        }
        const updated = applyUpdate(this._records[idx], update);
        const { error } = this.schema.validate(updated);
        if (error) {
            throw new ValidationError(`Update Error: object ${JSON.stringify(updated)} does not match schema`, error);
        }
        this._records[idx] = updated;
        this._save();
    }

    updateWhere(predicate, update) {
        let changed = false;
        this._records = this._records.map(rec => {
            if (predicate(rec)) {
                changed = true;
                const updated = applyUpdate(rec, update)
                const { error } = this.schema.validate(updated);
                if (error) {
                    throw new ValidationError(`Update Error: object ${JSON.stringify(updated)} does not match schema`, error);
                }
                return updated;
            }
            return rec;
        });
        if (!changed) {
            console.warn(`[NoopWarning] Update Warning: no records matched predicate thus none have been updated`);
            return;
        }
        this._save();
    }

    deleteByKey(key) {
        const initialLength = this._records.length;
        this._records = this._records.filter(
            rec => !this.keyProperties.every(k => rec[k] === key[k])
        );
        if (this._records.length === initialLength) {
            console.warn(`[NoopWarning] Delete Warning: no record found for key ${JSON.stringify(key)} thus none have been removed`);
            return;
        }
        this._save();
    }

    deleteWhere(predicate) {
        const initialLength = this._records.length;
        this._records = this._records.filter(rec => !predicate(rec));
        if (this._records.length === initialLength) {
            console.warn(`[NoopWarning] Delete Warning: no records matched predicate thus none have been removed`);
            return;
        }
        this._save();
    }

    reset() {
        this._records = [];
        this._save();
    }
}



/**
 * @template Data extends Record<string, any>
 * @implements {IDatabaseSingletonTable<Data>}
 */
class DatabaseSingletonTable {
    /**
     * @param {string} name
     * @param {import('joi').Schema} schema
     * @param {() => Data} initializer
     */
    constructor(name, schema, initializer) {
        if (!name) throw new Error('Constructor Error: name is required');
        if (!schema) throw new Error('Constructor Error: schema is required');
        if (!initializer) throw new Error('Constructor Error: initializer is required');

        this.name = name;
        this.schema = schema;
        this.initializer = initializer;

        this._filePath = path.resolve(__dirname, `${DB_PATH}/${process.env.DB_FOLDER ?? ''}${this.name.toLowerCase()}.data.json`);

        this._record = this.initializer();
        const { error } = this.schema.validate(this._record);
        if (error) {
            throw new ValidationError(`Constructor Error: initializer's return value does not match schema`, error);
        }

        this._load();
    }

    /**
     * @private
     */
    _load() {
        try {
            let parsed;
            if (fs.existsSync(this._filePath)) {
                const raw = fs.readFileSync(this._filePath, 'utf8');
                parsed = raw.length !== 0 ? JSON.parse(raw) : this.initializer();
            } else {
                parsed = this.initializer();
            }

            const { error } = this.schema.validate(parsed);
            if (error) {
                throw new ValidationError(`Load Error: data in ${this._filePath} does not match schema`, error);
            }

            this._record = parsed;
        } catch (err) {
            if (err instanceof ValidationError) throw err;
            throw new Error(`Load Error: failed to load data for table ${this.name} — ${err}`);
        }
    }

    /**
     * @private
     */
    _save() {
        try {
            const dir = path.dirname(this._filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this._filePath, JSON.stringify(this._record, null, 2), 'utf8');
        } catch (err) {
            throw new Error(`Save Error: failed to save data for table ${this.name} - ${err}`);
        }
    }

    get() {
        return { ...this._record };
    }

    update(update) {
        const updated = { ...this._record, ...update };
        const { error } = this.schema.validate(updated);
        if (error) {
            throw new ValidationError(`Update Error: object ${JSON.stringify(updated)} does not match schema`, error);
        }
        this._record = updated;
        this._save();
    }

    reset() {
        this._record = this.initializer();
        this._save();
    }
}

////////////////////////////////////////////////////////////////////////////////
// Utils :

/**
 * Apply a deep update to an object.
 * @param {Object} obj - The object to update.
 * @param {Partial<Object>} update - The update to apply.
 * @returns {Object} - The updated object.
 */
function applyUpdate(obj, update) {
    const ret = { ...obj };

    for (const key in update) {
        if (!Object.prototype.hasOwnProperty.call(update, key)) continue;

        const updatedValue = update[key];
        const currentValue = ret[key];

        if (Array.isArray(updatedValue)) {
            ret[key] = updatedValue;
        } else if (
            updatedValue !== undefined
            && typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)
            && typeof updatedValue === 'object' && updatedValue !== null && !Array.isArray(updatedValue)
        ) {
            // Recursive Merge :
            ret[key] = applyUpdate(currentValue, updatedValue);
        } else if (updatedValue !== undefined) {
            ret[key] = updatedValue;
        }
    }

    return ret;
}


////////////////////////////////////////////////////////////////////////////////
// Exports :
////////////////////////////////////////////////////////////////////////////////

module.exports = {
    ValidationError,
    DuplicateKeyError,
    NotFoundError,
    DatabaseTable,
    DatabaseSingletonTable
};
