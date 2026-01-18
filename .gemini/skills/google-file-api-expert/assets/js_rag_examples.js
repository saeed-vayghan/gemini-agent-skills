const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

async function uploadToFileSearchStore() {
    // File name will be visible in citations
    const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: 'your-fileSearchStore-name' }
    });

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: 'file.txt',
        fileSearchStoreName: fileSearchStore.name,
        config: {
            displayName: 'file-name',
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation });
    }

    return fileSearchStore;
}

async function importExistingFile() {
    // 1. Upload file
    const sampleFile = await ai.files.upload({
        file: 'sample.txt',
        config: { name: 'file-name' }
    });

    // 2. Create Store
    const fileSearchStore = await ai.fileSearchStores.create({
        config: { displayName: 'your-fileSearchStore-name' }
    });

    // 3. Import
    let operation = await ai.fileSearchStores.importFile({
        fileSearchStoreName: fileSearchStore.name,
        fileName: sampleFile.name
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation: operation });
    }
}

async function customChunking(fileSearchStoreName) {
    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: 'file.txt',
        fileSearchStoreName: fileSearchStoreName,
        config: {
            displayName: 'file-name',
            chunkingConfig: {
                whiteSpaceConfig: {
                    maxTokensPerChunk: 200,
                    maxOverlapTokens: 20
                }
            }
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.get({ operation });
    }
}

async function manageStores() {
    // List
    const fileSearchStores = await ai.fileSearchStores.list();
    for await (const store of fileSearchStores) {
        console.log(store);
    }

    // Get
    // const myStore = await ai.fileSearchStores.get({ name: 'fileSearchStores/my-store-123' });

    // Delete
    // await ai.fileSearchStores.delete({
    //   name: 'fileSearchStores/my-store-123',
    //   config: { force: true }
    // });
}

async function manageDocuments(storeName) {
    const documents = await ai.fileSearchStores.documents.list({
        parent: storeName
    });
    for await (const doc of documents) {
        console.log(doc);
    }

    // Get
    // const doc = await ai.fileSearchStores.documents.get({
    //   name: `${storeName}/documents/my_doc`
    // });

    // Delete
    // await ai.fileSearchStores.documents.delete({
    //   name: `${storeName}/documents/my_doc`
    // });
}

async function generateWithRAG(storeName, query, metadataFilter) {
    const fileSearchTool = {
        fileSearchStoreNames: [storeName]
    };

    if (metadataFilter) {
        fileSearchTool.metadataFilter = metadataFilter;
    }

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
            tools: [
                {
                    fileSearch: fileSearchTool
                }
            ]
        }
    });

    console.log(response.text);
    console.log(JSON.stringify(response.candidates?.[0]?.groundingMetadata, null, 2));
}



async function complexMetadataFilter(storeName, query) {
    // Filter examples:
    // - author = "Robert Graves"
    // - year >= 1930 AND year <= 1940
    // - category IN ("History", "Fiction")
    const metadataFilter = 'category = "Finance" AND year >= 2023';

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
            tools: [{
                fileSearch: {
                    fileSearchStoreNames: [storeName],
                    metadataFilter: metadataFilter
                }
            }]
        }
    });

    console.log(response.text);
}

async function structuredOutputRag(storeName, query) {
    // Define schema for structured output
    const schema = {
        type: "object",
        properties: {
            rating: { type: "integer", description: "Rating from 1-10" },
            summary: { type: "string", description: "Summary of retrieved info" },
            keyFacts: {
                type: "array",
                items: { type: "string" },
                description: "List of key facts"
            }
        },
        required: ["rating", "summary", "keyFacts"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
            tools: [{
                fileSearch: {
                    fileSearchStoreNames: [storeName]
                }
            }],
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    console.log(response.text);
}

async function importWithMetadata(storeName, fileName) {
    let operation = await ai.fileSearchStores.importFile({
        fileSearchStoreName: storeName,
        fileName: fileName,
        config: {
            customMetadata: [
                { key: "author", stringValue: "Robert Graves" },
                { key: "year", numericValue: 1934 }
            ]
        }
    });
}
