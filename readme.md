# Simple CRUD with React, Express, and MySQL

This project demonstrates a simple CRUD (Create, Read, Update, Delete) application built using React for the frontend, Express for the backend, and MySQL for the database.

## Features

-  Create, Read, Update, and Delete records.
-  Responsive user interface using Bulma.
-  RESTful API using Express.
-  Data persistence with MySQL.
-  Frontend routing with React Router.

## Dependencies

### Frontend Dependencies

-  `axios`: Promise-based HTTP client for making API requests.
-  `bulma`: Modern CSS framework based on Flexbox for styling.
-  `react`, `react-dom`: Core libraries for building user interfaces with React.
-  `react-router-dom`: Declarative routing for React applications.

### Backend Dependencies

-  `cors`: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
-  `express`: Fast, unopinionated web framework for Node.js.
-  `mysql2`: MySQL client for Node.js with focus on performance.
-  `sequelize`: Promise-based ORM (Object-Relational Mapping) for Node.js, supporting MySQL among other databases.
-  `crypto`: Node.js module providing cryptographic functionality.

### Cryptography Description

#### Encryption and Decryption

The project utilizes Node.js `crypto` module for encryption and decryption operations. Here’s how it works:

-  **Encryption**: Encrypts sensitive data (e.g., user information) before storing it in the MySQL database. Encryption helps protect data confidentiality by converting plain text into ciphertext using AES-256-CBC encryption algorithm. The encryption key (`SECRET_KEY`) is stored securely and should not be hardcoded in production.

-  **Decryption**: Decrypts encrypted data retrieved from the database. It uses the same AES-256-CBC algorithm and the `SECRET_KEY` to transform the ciphertext back into readable plaintext.

### Example Usage

````javascript
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY; // Ideally stored securely

// Encrypt function
export const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Decrypt function
export const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
````

## Security Considerations

### Keep SECRET_KEY Secure
Store the `SECRET_KEY` securely using environment variables or a secrets management service to prevent unauthorized access. Never hardcode sensitive information in your source code.

### Use HTTPS
Ensure that API communication is encrypted over HTTPS (HyperText Transfer Protocol Secure) to protect data transmitted between the client and server. HTTPS encrypts data to prevent eavesdropping and tampering during transit.

### Regularly Rotate Keys
Consider rotating encryption keys periodically to mitigate the risk of long-term exposure in case of a key compromise. Establish a key rotation policy and automate the process where possible to maintain security.

## Integrating Encryption in CRUD Operations

### Create Operation
Encrypt sensitive data (e.g., user information) before inserting it into the database. Use strong encryption algorithms and securely manage initialization vectors (IVs) to enhance data protection.

### Read Operation
Decrypt encrypted data fetched from the database before displaying it in the frontend application. Ensure decryption keys are securely managed and accessible only to authorized components.

### Update Operation
When updating existing records, re-encrypt data to maintain confidentiality. Avoid storing decrypted data longer than necessary and ensure that encryption keys are updated as per the key rotation policy.

### Delete Operation
Delete records securely without exposing sensitive information. Ensure that deletion operations comply with data protection regulations and securely erase data from both storage and backups.