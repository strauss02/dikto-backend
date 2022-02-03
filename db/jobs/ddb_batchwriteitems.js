import {
  DynamoDBClient,
  BatchExecuteStatementCommand,
  BatchWriteItemCommand,
} from '@aws-sdk/client-dynamodb'
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

  // console.dir(putReqTemplate, { depth: null })
  return putReqTemplate
}

const exampleEntry = {
  pos: 'n.',
  synonyms:
    'Detestation; loathing; abhorrence; disgust; aversion; loathsomeness; odiousness. Sir W. Scott.',
  word: 'ABOMINATION',
  definitions: [
    'The feeling of extreme disgust and hatred; abhorrence; detestation; loathing; as, he holds tobacco in abomination.',
    'That which is abominable; anything hateful, wicked, or shamefully vile; an object or state that excites disgust and hatred; a hateful or shameful vice; pollution. Antony, most large in his abominations. Shak.',
    'A cause of pollution or wickedness.',
  ],
}

// console.log(createPutReqObj(exampleEntry))

function checkForDuplicates(arr, obj) {
  if (arr.length < 1) {
    return false
  }

  if (
    arr.some((entry) => {
      // console.dir(entry, { depth: null })
      // console.dir(obj, { depth: null })
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
      console.log('I POOPED')
    } else {
      console.log('I PEED')
      putReqArr.push(putReqObj)
    }
  }

  return putReqArr
}

// console.dir(preparePutReqArr(), { depth: null })

const DBclient = new DynamoDBClient()

async function sendBatchPutReq(startIndex) {
  const params = {
    RequestItems: {
      dictionary: [],
    },
  }

  params.RequestItems.dictionary = preparePutReqArr(startIndex)

  // console.dir(params, { depth: null })

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
