# Google File API Reference Cheatsheet

## Limits & Persistence
- **Raw Files**: Uploaded via `files.upload` are deleted after **48 hours**.
- **File Search Stores**: Data imported into a store persists **indefinitely** until manually deleted.
- **Store Names**: Globally scoped.
- **Document IDs**: Unique within a store.

## Endpoints Summary

### File Search Stores
- **List**: `GET /v1beta/fileSearchStores`
- **Create**: `POST /v1beta/fileSearchStores`
- **Get**: `GET /v1beta/{name=fileSearchStores/*}`
- **Delete**: `DELETE /v1beta/{name=fileSearchStores/*}` (Use `force=true` to cascade delete docs)
- **Upload & Import**: `POST /v1beta/{fileSearchStoreName=fileSearchStores/*}:uploadToFileSearchStore`
- **Import Existing**: `POST /v1beta/{fileSearchStoreName=fileSearchStores/*}:importFile`

### Documents
- **List**: `GET /v1beta/{parent=fileSearchStores/*}/documents`
- **Get**: `GET /v1beta/{name=fileSearchStores/*/documents/*}`
- **Delete**: `DELETE /v1beta/{name=fileSearchStores/*/documents/*}`

## Metadata Filtering
Guidance: [google.aip.dev/160](https://google.aip.dev/160)

Example Filter:
`author = "Robert Graves"`

## Supported MIME Types
Broad support including:
- PDF (`application/pdf`)
- Text (`text/plain`, `text/markdown`, etc.)
- Code (`text/x-python`, `application/json`, etc.)
- Office Docs (`application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

## Models
- `gemini-3-pro-preview`
- `gemini-3-flash-preview`
- `gemini-2.5-pro`
- `gemini-1.5-flash` series
