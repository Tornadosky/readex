# Table of contents

1. [DB info](#dbi)
2. [Get pdf](#gpdf)
3. [General rules of gathering data](#grogd)
4. [Data mutating](#dm)
5. [How to use GraphQL schema](#gqlh)
6. [Getting nested data - general](#gnd)
  6.1. [Getting nested data from *Highlights* and *Collections*](#ghac) 
7. [How to add Books and Tests to Collections](#wwc1)
  7.1. [How to remove them](#wwc2)
8. [Tips](#tips)


# Database base info <a name="dbi"></a>

[DB Diagram](./readex_dbd.png "Readex Database Diagram")

When creating GraphQL requests, feel free to use [shema](./schema.graphql) to find names and logic.

# Get pdf <a name="gpdf"></a>

POST request on ``` /getbook ```
with body ``` { "document": "__data_from_db__"} ```
or ``` { "id": id } ```
where ```__data_from_db__``` is field from response on achieving the book and ``` id ``` is scalar.

### Example
request:
```graphql
{
    "document": "./uploads/1/aaBook1.pdf"
}
```
response:
* on success:
application/pdf data
* on error:
```js
{
	"error": "Error: file not found: ./uploads/1/aaBook1.pdf"
}
```



# Get data <a name="grogd"></a>

Either
``` query {} ```
or
``` {} ```

Next is table name (Books, Users, Collections etc.)
``` Books {} ```

And name all fields you want to get
``` id title ``` or ``` id, title ```

### Example
request:
```graphql
query {
    Books {
        id title
    }
}
```
response:
```js
{
  "data": {
    "Books": [
      {
        "id": "1",
        "title": "Book1.pdf"
      }
    ]
  }
}
```


# Create, Update, Delete <a name="dm"></a>

* Create - has no *id* parameter
* Update - has *id* parameter

Always ``` mutation {} ```

Next is mutation name and parameters
``` setAchievement (name: "First user" description: "First registered in readex user") {}```
With or without commas

Add fields you want to get in response:
``` id name ```

### Example ***Create***
request:
```graphql
mutation {
  setAchievement(name: "First user" description: "First registered in readex user" ){
    id name
  }
}
```
response:
```js
{
  "data": {
    "setAchievement": {
      "id": "1",
      "name": "First user"
    }
  }
}
```

### Error if creating with already existing name
request:
```graphql
mutation {
  setAchievement(name: "First user" description: "First registered in readex user" ){
    id name
  }
}
```
response:
```js
{
  "errors": [
    {
      "message": "\nInvalid `prisma.Achievements.create()` invocation in\n.../resolver.js:451:48\n\n  448         description: args.description\n  449     }\n  450 };\n→ 451 answer = await prisma.Achievements.create(\nUnique constraint failed on the fields: (`name`)",
      "locations": [
        {
          "line": 8,
          "column": 3
        }
      ],
      "path": [
        "setAchievement"
      ]
    }
  ],
  "data": {
    "setAchievement": null
  }
}
```

### Example ***Update***
request:
```graphql
mutation {
  setAchievement(id: 1 description: "We love you!" ){
    id description
  }
}
```
response:
```js
{
  "data": {
    "setAchievement": {
      "id": "1",
      "description": "We love you!"
    }
  }
}
```

### Example ***Delete***
request:
```graphql
mutation {
  delAchievement(id: 2){
    id description
  }
}
```
response (returns deleted values):
```js
{
  "data": {
    "delAchievement": {
      "id": "2",
      "description": "First registered in readex user"
    }
  }
}
```

### Error if delete not existing record
request:
```graphql
mutation {
  delAchievement(id: 2){
    id description
  }
}
```
response (returns deleted values):
```js
{
  "errors": [
    {
      "message": "\nInvalid `prisma.Achievements.delete()` invocation in\n.../resolver.js:766:54\n\n  763     return answer;\n  764 },\n  765 delAchievement: async (args, context) => {\n→ 766     let answer = await prisma.Achievements.delete(\nAn operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.",
      "locations": [
        {
          "line": 20,
          "column": 3
        }
      ],
      "path": [
        "delAchievement"
      ]
    }
  ],
  "data": {
    "delAchievement": null
  }
}
```

# How to find names and parameters <a name="gqlh"></a>

In file [schema.graphql](./schema.graphql)
For queries (aka *Select*) - from line 103

For mutations (aka *Insert Update Delete*) - from line 129

Required parameters are highlighted with "!" symbol after Type, like
```graphql
setBook(id: Int
    ...
    user: Int!
  ): Books
```
Parameters with square brackets "[Type]" are arrays:
```graphql
setCollection(
    ...
    books: [Int]
    tests: [Int]
  ): Collections
```

General syntax is
```
Name(Parameter: Type): Returning_Table
```


# Get nested data <a name="gnd"></a>

Works with one-to-many and one-to-one.
May be some problems with many-to-many.

### Example ***Query***
request:
```graphql
{ Highlights {
    id
    book {
        title
    }
    user {
        login
    }
    from {
        line page symbol
    }
    to {
        id
    }
    title
    text
}}
```
response:
```js
{
  "data": {
    "Highlights": [
      {
        "id": "1",
        "book": {
          "title": "aaBook1.pdf"
        },
        "user": {
          "login": "u1"
        },
        "from": {
          "line": 1,
          "page": 1,
          "symbol": 8
        },
        "to": {
          "id": "1"
        },
        "title": "New arrival",
        "text": "Qqqqwertyuiocn vknf rbu imnjhg"
      }
    ]
  }
}
```

### Example ***Mutation***
request:
```graphql
mutation {
  setCollection(id: 2, title: "Col2") {
    id title books { id title } tests { id title }
  }
}
```
response:
```js
{
  "data": {
    "setCollection": {
      "id": "2",
      "title": "Col2",
      "books": [],
      "tests": []
    }
  }
}
```

# Getting nested data from *Highlights* and *Collections*  <a name="ghac"></a>

The only difference is dublicating names in many-to-many relations.
Correct request:
```graphql
{
  Highlights {
    boundingRect {
      id width height
    }
    rects {
      rects {
        id x1 y1
      }
    }
  }
}
```
Response:
```js
{
  "data": {
    "Highlights": [
      {
        "boundingRect": {
          "id": "4",
          "width": 15,
          "height": 56
        },
        "rects": [
          {
            "rects": {
              "id": "2",
              "x1": 2,
              "y1": 2
            }
          },
          {
            "rects": {
              "id": "3",
              "x1": 1,
              "y1": 1
            }
          }
        ]
      }
    ]
  }
}
```


# How to add Books and Tests to Collections <a name="wwc1"></a>

To connect a test (``` id: 2```) to a collection (``` id: 2 ```) send mutation ``` setCollection (id: X, tests: Y) ```, where ```id``` is collection id, ```tests``` is test id (```X``` and ```Y``` are integer):
```graphql
mutation {
  setCollection (id: 2 tests: 2) {
    id
    tests {
      tests {
        id
      }
    }
  }
}
```
Likewise with books:
```graphql
mutation {
  setCollection (id: 2 books: 2) {
    id
    books {
      books {
        id
      }
    }
  }
}
```


# How to remove them <a name="wwc2"></a>

To remove connected books and tests there are 2 mutations:
```graphql
mutation {
  unlinkTest (collectionid: X testid: Y)
}
```
and
```graphql
mutation {
  unlinkBook (collectionid: X bookid: Y)
}
```
If removement is successful, response will be:
```js
{
  "data": {
    "unlinkTest": 1
  }
}
```

# Important tips <a name="tips"></a>

1) on query *Questions(test user)* must be both
2) same with *Words(color user)* and *Words(word user)*
3) same with *Tests(title user)*
4) same with *Collections(title user)*
5) same with *Highlights(book user)*
6) same with *Book(title user)* and *Book(author user)*
