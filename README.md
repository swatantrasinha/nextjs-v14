# Project Setup
---------------
<details>
  <summary> Create Project- snippets </summary>
> npx create-next-app@latest


project name: snippets
<br />
all options yes but only last one no ==>  change default import alias : No

> cd snippets
</details>

<details>
  <summary> SetUp for Prisma </summary>
## prisma setup

> npm install prisma
> npx prisma init --datasource-provider sqlite  
<br />

(new folder prisma created parallel to src folder)

see in docs screenshot => prisma-setup.png

the newly created primsa folder has file schema.prisma it has below content

```javascript
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

We will update this file and add below: 

```javascript
model Snippet {
  id Int @id @default(autoincrement())
  title String
  code String
}
```

We need to tell Prisma we want to use this defintion for SQlLite DB
so in terminal
 > npx prisma migrate dev

It will ask for "Enter a name for the new migration"
lets give this as -  add snippets
See in docs screenshot - sqlLite-db-name.png

</details>

<details>
  <summary> Creating Records</summary>
## Below are the steps for creating a record: 

1. Create Prisma Client to access DB
2. Create Form in SnipperCreatePage
3. Define a server action : this is a function that will be called when form is submitted
4. In Server action, validate the user's input and then create a new snippet
5. Redirects the user to homepage which lists all the snippets

<hr/>
<details>
  <summary> Step1: For creating prisma client  </summary>

in src folder - parallel to folder app => create a new folder db <br />
and inside that create a new file - index.ts <br />
add the below code :

index.ts(src -> db)
-------------------
```javascript
import { PrismaClient } from "@prisma/client";

export const db= new PrismaClient();
```
</details>

Step2: Create form in SnipperCreatePage
see file snippets -> src -> app -> snippets -> new -> page.tsx


Step3: Define a server action
We need to take information from form and need to create new record in DB

- Server Action - preferred way to change data in Next App
- it has close integration with HTML forms
- these are functions that will be called with values that a user entered into form

In SnippetCreatePage, we will import db at top and  before returning JSX we will create a async function


```javascript
 async function createSnippet(formData: FormData){
        // this needs to be a server action 
            'use server'; // next js will treat as server action

        // Check the user's inputs and make sure they are valid
            const title= formData.get('title') as string;
            const code= formData.get('code') as string;

        // create new record in DB
            const snippet= await db.snippet.create({
                data: {
                    title,
                    code
                }
            });
            console.log('snippet ', snippet);
            
        // redirect user back to the root route
        redirect('/');
    }
```

Also we will add this function createSnippet in form action


> ** <form action={createSnippet}> .....

Note:  why need server action ?
- see earlier working : See => 03-traditional-react-app.png
- what changes in next js: See => 04-nextjs-world.png
- the server action - createSnippet does not execute in user's browser but executes on server
  See => 05-how-server-action-works.png
  We can verify that the console.log :  console.log('snippet ', snippet);
  is printed in terminal only and not on browser


</details>
