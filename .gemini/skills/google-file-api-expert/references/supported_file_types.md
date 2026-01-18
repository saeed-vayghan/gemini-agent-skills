# Supported File Types for Google File API

The Google File API supports a wide range of file types for indexing and retrieval.

## Application File Types

- `application/pdf`
- `application/json`
- `application/sql`
- `application/xml`
- `application/zip`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
- `application/vnd.ms-excel`
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX)
- `application/vnd.openxmlformats-officedocument.presentationml.presentation` (PPTX)
- `application/dart`
- `application/ecmascript`
- `application/typescript`
- `application/x-sh`
- `application/x-powershell`
- `application/x-php`
- `application/x-python`
- `application/x-httpd-php`

## Text File Types

- `text/plain`
- `text/html`
- `text/css`
- `text/csv`
- `text/markdown`
- `text/xml`
- `text/javascript`
- `text/x-python`
- `text/x-c`
- `text/x-c++`
- `text/x-java-source`
- `text/x-kotlin`
- `text/x-go`
- `text/x-ruby`
- `text/x-rust`
- `text/x-scala`
- `text/x-swift`
- `text/x-perl`
- `text/x-sql`

## Code & Structured Data

The File Search API is particularly powerful for codebases and structured data:
- **SQL Files**: Can be indexed to allow the model to answer questions about database schemas.
- **JSON/CSV**: Useful for structured data querying, although for very large datasets, BigQuery might be a better fit.
- **Source Code**: Supporting many languages (Python, JS, Go, etc.) allows for "Chat with your Codebase" applications.
