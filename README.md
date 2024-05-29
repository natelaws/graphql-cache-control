
# Apollo Server Cache-Control Testing

This repo provieds a minimal amount of code to test different cache-control response values.

## Running
```
nvm use
npm i
npm start
```

## Tests

----

Testing the basic query we get the expected field falue `"cache-control": "max-age=300, public"`

```
query Test {
  data {
    id
  }
}
```

----

Testing with a field without a cacheControl directive we get the parent types setting `"cache-control": "max-age=500, public"`

query Test {
  data {
    title
  }
}


----

Testing with a union field in the query we get ``"cache-control": "no-store"``

*This is unexpected*

```
query Test1 {
  data {
    id
    unionField {
      ... on SubType1 {
        id
      }
    }
  }
}
```

```
query Test2 {
  data {
    id
    unionField {
      __typename
    }
  }
}

----

Testing when the union field has a @cacheControl directive we get the expected `"cache-control": "max-age=400, public"`.

```
query Test {
  data {
    unionFieldCached {
      __typename
    }
  }
}
```

Or we get the expected value `"cache-control": "max-age=10, private"` when the fields in the union type are queried for.

```
query Test {
  data {
    id
    unionFieldCached {
      ... on SubType1 {
        id
        isFlagged
      }
      ... on SubType2 {
        id
        isFlagged
      }
    }
  }
}
```

