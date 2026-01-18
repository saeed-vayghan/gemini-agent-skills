# Limits and Quotas

## Persistence Limits

### Raw Files (`File` API)
- **Retention**: Files uploaded via the `files.upload` method (without being imported to a store) are **automatically deleted after 48 hours**.
- **Usage**: These are intended as temporary staging resources. You must import them into a `FileSearchStore` or use them immediately in a prompt.

### File Search Stores
- **Retention**: Data imported into a `FileSearchStore` persists **indefinitely**.
- **Cleanup**: You must explicitly delete stores or documents when they are no longer needed.

## Quotas (General Guidance)

*Note: Quotas are subject to change. Always check the official [Google AI Studio pricing/quota page](https://ai.google.dev/pricing).*

### Free Tier
- **File Storage**: Total storage limits apply (e.g., 20GB total storage).
- **Upload Limit**: Daily upload limits apply to the number of files.
- **Request Limit**: RPM (Requests Per Minute) limits on the `generateContent` API apply regardless of whether File Search is used.

### Ingestion Limits
- **File Size**: Maximum file size limits apply (typically 2GB per file).
- **Total Files**: Maximum number of files per project.

## Cost Structure
- **Storage**: Free of charge (up to limits).
- **Query-time Embedding**: Free of charge.
- **Indexing**: **Paid**. You pay for the token count of the content when it is first indexed/embedded into the store.
- **Inference**: **Paid**. You pay for the input tokens (including the retrieved context) and output tokens during `generateContent` calls.
