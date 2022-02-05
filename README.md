<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="images/logo.png" alt="Logo" >

  <p align="center">
    the official API of Dikto
    <br />
    <a href="https://0pv5ubqq5l.execute-api.eu-west-1.amazonaws.com/dev">API URL</a>
    ·
    <a href="http://dikto-client.s3-website.eu-west-3.amazonaws.com/">Visit App</a>
    ·
    <a href="https://github.com/strauss02/dikto-frontend/issues">Report Bug</a>
    ·
    <a href="https://github.com/strauss02/dikto-frontend/issues">Request Feature</a>
  </p>
</div>

## About The Project

![Dikto Screen Shot](/images/diagram.png)

This application was built as a project in my coding course. It demonstrates the use of AWS Cloud Services, React and more.  
Dikto is a simple, lightweight dictionary app with some cool little features.  
This is the API for the front end of the app.
It recieves requests directly from the client side.  
The API connects between the DB and the client side. It also includes any necessary logic required for the client to recieve coherent, easily interpretable responses.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

<br>

- AWS S3
- AWS DynamoDB
- AWS Lambda
- Node.js
- Serverless

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Go to [this link](http://dikto-client.s3-website.eu-west-3.amazonaws.com/) to get started with the app.

Go to [this link](https://0pv5ubqq5l.execute-api.eu-west-1.amazonaws.com/dev/) to use the API.

### Prerequisites

A modern browser.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

As explained in the diagram, the API includes several endpoints.

### The word path

The ` /word/:word` endpoint recieves a word as a query parameter. It is used by the client side to request entries that match that word.  
For example, going `/word/banana` would bring up this result in a JSON format:

```
[
{
Pos: "n.",
Word: "BANANA",
Definitions: "A perennial herbaceous plant of almost treelike size (Musa sapientum); also, its edible fruit. See Musa.
"
}
]
```

The front-end will handle the response, regardless of the number of entries returned.

The `/word/:word/:pos` endpoint also recieves a part of speech in addition to the word requested.  
This will return a specific, unique entry. This is because the DB is built in such way that there can only exist one entry with a specific part of speech.  
For example, going `/word/single/n.` would bring up this result in a JSON format:

```
{
Item: {
Pos: "n.",
Word: "SINGLE",
Definitions: "A unit; one; as, to score a single.
The reeled filaments of silk, twisted without doubling to give them firmness.
A handful of gleaned grain. [Prov. Eng. & Scot.]
A game with but one player on each side; -- usually in the plural.
A hit by a batter which enables him to reach first base only.
"
}
}
```

**Note** that the API uses an abbreviated version of the speech part names as the `pos` parameter.

### The _pos_ path

The `/pos/:pos` endpoint recieves a specific part of speech and returns a word that is an example of such. It is used by the client side to handle requests for random examples of parts of speech.  
For example, going `/pos/5` would yield:

```
{
Word: "A-GOOD",
Pos: "adv."
}
```

**Note** that when using the `pos` endpoint an enum is used to specify a certain part of speech.  
That mapping is done on the client side.

You could also specify another query parameter, a letter.  
The API will try to search for a random word that begins with that letter.  
For example, going `/pos/5?letter=b` would yield:

```
{
Word: "BACKWARD; BACKWARDS",
Pos: "adv."
}
```

As you can see, this response does not contain any definition of that word. This is due to the nature of DynamoDB - complex queries can be performed only on secondary global indexes, which contain only 2 columns.  
The client side is aware of that, and uses the random entry returned as a preemptive step before actually looking up the full defintion of a specific word.

<p align="right">(<a href="#top">back to top</a>)</p>
