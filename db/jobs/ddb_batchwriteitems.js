// This batch job was used once in the beginning of the project to fill the DB with information.

import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import dictionary from './../dictionary.json'

const createPutReqObj = (entryObj) => {
  let definitionStr = ''

  const parseDefinitionArr = (definitions) => {
    definitions.forEach((definition) => {
      definitionStr += `${definition} \n`
    })
  }
  parseDefinitionArr(entryObj.definitions)
  const putReqTemplate = {
    PutRequest: {
      Item: {
        Word: { S: entryObj.word },
        Pos: { S: entryObj.pos },
        Definitions: {
          S: definitionStr,
        },
        // if entryObj.synonyms exists, add it as an object property
        ...(entryObj.synonyms && {
          Synonyms: {
            S: entryObj.synonyms,
          },
        }),
      },
    },
  }

  return putReqTemplate
}

function checkForDuplicates(arr, obj) {
  if (arr.length < 1) {
    return false
  }

  if (
    arr.some((entry) => {
      if (
        entry.PutRequest.Item.Word.S === obj.PutRequest.Item.Word.S &&
        entry.PutRequest.Item.Pos.S === obj.PutRequest.Item.Pos.S
      ) {
        // if found duplicate
        return true
      } else {
        return false
      }
    })
  ) {
    return true
  } else {
    return false
  }
}

function preparePutReqArr(startIndex) {
  let putReqArr = []

  for (let i = startIndex; i < startIndex + 25; i++) {
    const putReqObj = createPutReqObj(dictionary[i])
    console.dir(putReqObj, { depth: null })

    // if array contains the freshly made putReqObj, it wouldn't be added
    if (checkForDuplicates(putReqArr, putReqObj)) {
      // loop goes on without adding the duplicate
    } else {
      putReqArr.push(putReqObj)
    }
  }

  return putReqArr
}

const DBclient = new DynamoDBClient()

async function sendBatchPutReq(startIndex) {
  const params = {
    RequestItems: {
      dictionary: [],
    },
  }

  params.RequestItems.dictionary = preparePutReqArr(startIndex)

  try {
    const data = await DBclient.send(new BatchWriteItemCommand(params))
    console.log(
      `Successfully completed batch job!, response: ${JSON.stringify(data)}`
    )
  } catch (err) {
    console.log(`A problem occured during the batch job. ${err}`)
  }
}

//cycle = batch of 25 entries
async function sendConsequtiveReqs(cycles) {
  for (let i = 0; i < cycles; i++) {
    await sendBatchPutReq(25 * i)
  }
}

sendConsequtiveReqs(7000)
