* Database base info

[DB Diagram](./readex_dbd.png "Readex Database Diagram")

When creating GraphQL requests, feel free to use [shema](./schema.graphql) to find names and logic.

* Get data

Either
``` query {} ```
or
``` {} ```

Next is table name (Books, Users, Collections etc.)
``` Books {} ```

And name all fields you want to get
``` id title ``` or ``` id, title ```

*** Example
request:
```
query {
    Books {
        id title
    }
}
```
response:
```
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


* Create, Update, Delete

Create - has no *id* parameter
Update - has *id* parameter

Always ``` mutation {} ```

Next is mutation name and parameters
``` setAchievement (name: "First user" description: "First registered in readex user") {}```
With or without commas

Add fields you want to get in response:
``` id name ```

*** Example *Create*
request:
```
mutation {
  setAchievement(name: "First user" description: "First registered in readex user" ){
    id name
  }
}
```
response:
```
{
  "data": {
    "setAchievement": {
      "id": "1",
      "name": "First user"
    }
  }
}
```

*** Error if creating with already existing name
request:
```
mutation {
  setAchievement(name: "First user" description: "First registered in readex user" ){
    id name
  }
}
```
response:
```
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

*** Example *Update*
request:
```
mutation {
  setAchievement(id: 1 description: "We love you!" ){
    id description
  }
}
```
response:
```
{
  "data": {
    "setAchievement": {
      "id": "1",
      "description": "We love you!"
    }
  }
}
```

*** Example *Delete*
request:
```
mutation {
  delAchievement(id: 2){
    id description
  }
}
```
response (returns deleted values):
```
{
  "data": {
    "delAchievement": {
      "id": "2",
      "description": "First registered in readex user"
    }
  }
}
```

*** Error if delete not existing record
request:
```
mutation {
  delAchievement(id: 2){
    id description
  }
}
```
response (returns deleted values):
```
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

* How to find names and parameters

In file [schema.graphql](./schema.graphql)
For queries (aka *Select*) - from line 103

For mutations (aka *Insert Update Delete*) - from line 129

Required parameters are highlighted with "!" symbol after Type, like
```
setBook(id: Int
    ...
    user: Int!
  ): Books
```
Parameters with square brackets "[Type]" are arrays:
```
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


* Get nested data

Works with one-to-many and one-to-one.
May be some problems with many-to-many.

*** Example *Query*
request:
```
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
```
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

*** Example *Mutation*
request:
```
mutation {
  setCollection(id: 2, title: "Col2") {
    id title books { id title } tests { id title }
  }
}
```
response:
```
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



* Important tips

1) on query *Questions(test user)* must be both
2) same with *Words(color user)* and *Words(word user)*
3) same with *Tests(title user)*
4) same with *Collections(title user)*
5) same with *Highlights(book user)*
6) same with *Book(title user)* and *Book(author user)*
