import {SIMILARITY_MATCH_COUNT, EMBEDDING_MODEL_NAME, ANSWERING_MODEL} from "./constants.js"
import {openai, supabase} from "./config.js"
import {getRagPrompt, combineDocuments} from "./utils.js"


/*
  Challenge: Build a basic retrieval system
    1. Use OpenAI embeddings to embed the query.
    2. Create the supabase rpc logic to retrieve relevant documents based on the embeddings.
    3. Construct the prompt based on the query and retrieved documents as context.
    4. Send the prompt to the model to generate a final response.
 */

const query = "How many houses were damaged during the great fire of london?"


async function main(){

  //retrieve docs that contain content relevant to the query
  const retrievedDocs = await retrieveSimilarDocs(query)
  console.log(retrievedDocs)

  const contextString = combineDocuments(retrievedDocs);

  /* create a prompt using `getRagPrompt` including contextString */
  const prompt = getRagPrompt(contextString, query)


  /* Implement logic to send the prompt to model to generate response and log the `output_text` */
  const aiResponse = await openai.responses.create({
    model: ANSWERING_MODEL,
    input: prompt
  })

  console.log(aiResponse.output_text);
}

main()




export async function retrieveSimilarDocs(query){

  /* 1. Create openai vector embeddings based on the query */
  const embeddingResponse = await openai.embeddings.create({
    model: EMBEDDING_MODEL_NAME,
    input: query,
  });

  const embedding = embeddingResponse.data[0].embedding;


  /* 2. Retrieve relevant documents based on embeddings from supabase */
  const {data: documents, error: matchError } = await supabase.rpc(
    'match_documents',
    {
      query_embedding: embedding,
      match_count: SIMILARITY_MATCH_COUNT,
    }
  );


  /* 3. Return the retrieved documents */

  return documents
}

