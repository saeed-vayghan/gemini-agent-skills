from google import genai
from google.genai import types
import time

def upload_to_file_search_store():
    """Example of uploading a file directly to a new File Search Store."""
    client = genai.Client()

    # Create a new File Search Store
    file_search_store = client.file_search_stores.create(
        config={'display_name': 'your-fileSearchStore-name'}
    )
    print(f"Created store: {file_search_store.name}")

    # Upload file to the store
    # Note: 'sample.txt' must exist locally
    operation = client.file_search_stores.upload_to_file_search_store(
      file='sample.txt',
      file_search_store_name=file_search_store.name,
      config={
          'display_name' : 'display-file-name',
      }
    )

    # Wait for the operation to complete
    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)
    
    print("Upload complete")
    return file_search_store

def import_existing_file():
    """Example of uploading a file first, then importing it into a store."""
    client = genai.Client()

    # 1. Upload file using Files API
    sample_file = client.files.upload(
        file='sample.txt', 
        config={'name': 'display_file_name'}
    )
    print(f"Uploaded file: {sample_file.name}")

    # 2. Create Store
    file_search_store = client.file_search_stores.create(
        config={'display_name': 'your-fileSearchStore-name'}
    )

    # 3. Import file into Store
    operation = client.file_search_stores.import_file(
        file_search_store_name=file_search_store.name,
        file_name=sample_file.name
    )

    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)
    
    print("Import complete")

def custom_chunking_example(file_search_store_name, file_name):
    """Example of importing a file with custom chunking configuration."""
    client = genai.Client()
    
    operation = client.file_search_stores.upload_to_file_search_store(
        file_search_store_name=file_search_store_name,
        file_name=file_name,
        config={
            'chunking_config': {
              'white_space_config': {
                'max_tokens_per_chunk': 200,
                'max_overlap_tokens': 20
              }
            }
        }
    )
    
    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)
    print("Custom chunking complete.")

def manage_stores():
    """Examples of managing File Search Stores."""
    client = genai.Client()

    # List stores
    for store in client.file_search_stores.list():
        print(store)

    # Get a specific store (replace with actual name)
    # my_store = client.file_search_stores.get(name='fileSearchStores/my-store-123')
    
    # Delete a store
    # client.file_search_stores.delete(name='fileSearchStores/my-store-123', config={'force': True})

def manage_documents(store_name):
    """Examples of managing documents within a store."""
    client = genai.Client()

    # List documents in store
    for document in client.file_search_stores.documents.list(parent=store_name):
      print(document)

    # Get document (replace with actual name)
    # doc = client.file_search_stores.documents.get(name=f'{store_name}/documents/my_doc')
    
    # Delete document
    # client.file_search_stores.documents.delete(name=f'{store_name}/documents/my_doc')

def generate_content_with_rag(store_name, query, metadata_filter=None):
    """Example of generating content using the File Search tool."""
    client = genai.Client()
    
    # Configure tool
    file_search_tool = types.FileSearch(
        file_search_store_names=[store_name]
    )
    
    if metadata_filter:
        file_search_tool.metadata_filter = metadata_filter

    tool = types.Tool(file_search=file_search_tool)

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=query,
        config=types.GenerateContentConfig(
            tools=[tool]
        )
    )

    print(response.text)
    
    # Citations
    if response.candidates and response.candidates[0].grounding_metadata:
        print("\nCitations:", response.candidates[0].grounding_metadata)

def complex_metadata_filter(store_name, query):
    """Example of using complex metadata filters."""
    client = genai.Client()
    
    # Filter syntax guide: https://google.aip.dev/160
    # Examples:
    # - author = "Robert Graves"
    # - year >= 1930 AND year <= 1940
    # - category IN ("History", "Fiction")
    metadata_filter = 'category = "Finance" AND year >= 2023'

    file_search_tool = types.Tool(
        file_search=types.FileSearch(
            file_search_store_names=[store_name],
            metadata_filter=metadata_filter
        )
    )

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=query,
        config=types.GenerateContentConfig(
            tools=[file_search_tool]
        )
    )
    print(response.text)

def structured_output_rag(store_name, query):
    """Example of combining File Search with Structured Output (JSON Schema)."""
    from pydantic import BaseModel, Field
    
    client = genai.Client()

    # Define the desired output structure
    class Answer(BaseModel):
        rating: int = Field(description="A rating from 1-10 based on the content")
        summary: str = Field(description="A concise summary of the retrieved information")
        key_facts: list[str] = Field(description="List of key facts extracted")

    file_search_tool = types.Tool(
        file_search=types.FileSearch(
            file_search_store_names=[store_name]
        )
    )

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=query,
        config=types.GenerateContentConfig(
            tools=[file_search_tool],
            response_mime_type="application/json",
            response_schema=Answer
        )
    )
    
    # Parse the response (verify it matches schema)
    # Note: In production you might want to use a try/except block
    try:
        import json
        print(json.dumps(json.loads(response.text), indent=2))
    except Exception as e:
        print(f"Error parsing structured output: {e}")
        print("Raw response:", response.text)

def import_with_metadata(store_name, file_path):
    """Example of importing a file with custom metadata."""
    client = genai.Client()
    
    # Upload file first (assuming needed for import_file) or use upload_to_file_search_store
    # Here using import_file pattern assuming file is already uploaded or path provided for convenience wrapper
    
    # Note: Simplified for example purposes
    operation = client.file_search_stores.import_file(
        file_search_store_name=store_name,
        file_name=file_path,  # This should be a File API resource name ideally
        custom_metadata=[
            {"key": "author", "string_value": "Robert Graves"},
            {"key": "year", "numeric_value": 1934}
        ]
    )
