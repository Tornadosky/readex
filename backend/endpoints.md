# Endpoints

| PATH | METHOD | DESCRIPTION | TYPE |
| :--- | :----: | :---------- | :---: |
| /test | GET | Check if server online | text/html |
| /login | GET | Show html with button for ``` [POST] /login ``` | text/html |
| /login | POST | Check user data and add data to session | application/json |
| /logout | POST | Clear session data | application/json |
| /resource | GET | Check if user is logged in | text/html (OK) / application/json (ERROR) |
| /register | POST | If no such user, creates temporary user object and sends email for verification | application/json |
| /verify/:token | GET | Verifies user with provided token | application/json |
| /graphql | GET | GraphQL sandbox - GraphiQL | text/html (auto) |
| /graphql | POST | Resolves GraphQL request | application/json |
| /getbook | POST | Returns file (book in PDF format) by ID or Path | application/pdf (OK) / application/json (ERROR) |