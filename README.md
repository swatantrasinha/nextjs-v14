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
<br />
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


```javascript
 <form action={createSnippet}> .....
```

This is the first implementation of Server Action


Note:  why need server action ?
- see earlier working : See => 03-traditional-react-app.png
- what changes in next js: See => 04-nextjs-world.png
- the server action - createSnippet does not execute in user's browser but executes on server
  See => 05-how-server-action-works.png
  We can verify that the console.log :  console.log('snippet ', snippet);
  is printed in terminal only and not on browser


</details>

The basic setup is somewhat complete here- we will now proceed to write components
<br />

# Server Component Vs Client Component 
--------------------------------------
We saw how can we change data using Server Actions, now we will see how we can fetch and display data
<br />
Below are the steps: 
1. Create a server component - a component that does not have 'use Client' at top
2. Mark component as async
3. make an HTTP request or directly access DB to get the data
4. render data directly or pass to child component

<br />
<details>
  <summary> Difference Between Server and Client Components </summary>
  
Server component: 
When we work with Next JS some of our code runs on server and some on the client
<br />
So Next JS is composed of Server Component + Client Components
<br />

Server Components: 
- differs from traditional component gives better perforamce + UX
- closely integrated with Next JS
- all components by default in Next JS are server components
- can use async/await directly, no need to useState or useEffect for data fetching
- have few limitations- can't use any kind of hook
- cannot assign any event handler
  <br />
Note: As much as possbile we should prefer using Server components


<br />

Client Component
- same kind of React components we are usig earlier
- 'use client' at the top of file
- can use hooks and event handler
- generally cannot directly show a server component (some exception possible
  <br />
Note : use client component if need to use hook or event handler

Whenever browser make request to Next Server we need to send some HTML immediately <br />

See 06-ServerComp-and-ClientComp.png

### First request
In this case, Server Component (Parent) and Client Component(Child) is rendered in HTML file and send to user's browser
<br />
this HTML file has some plain HTML content inside it <br />
and a script tag inside it that tries to download JS from next server<br />

### Second request
The HTML files in client side browser makes request to next server and next server looks at all client components 
and extract JS from client component and send the extracted JS into browser
Note : even though client component is named "client", it gets rendered one time on server when user first make request


Now we will follow all the 4 steps mentioned above: 
1. Creating Server component
    In src- app - page.tsx
   <br />
since use client is not there its a server component only

2. mark component async

3. make an HTTP request or directly access DB to get the data
   <br />
   In this case we have to acccess DB

4. Render data directly or pass to child component
in this case we will render list of snippets

the comlete code for : src -> app -> page.tsx is below
```javascript
import {db} from '@/db';

export default async function Home() {
  const snippets= await db.snippet.findMany();
  const renderedSnippets= snippets.map((snippet) => {
    return (<div key={snippet.id}>
      {snippet.title}
    </div>)

  })
  return (
    <div>
      {renderedSnippets}
    </div>
  );
}
```

to test - http://localhost:3000/snippets/new
<br />
</details>


<details>
  <summary> Adding Dynamic Paths </summary>
Till now we saw:  <br/> 
- creating snippet
- fetching snippets
<br />
We will see how to view/edit/delete snippet <br />
<details>
<summary> View Snippet </summary>
  
To view snippet - we will make sure page url is /snippets/{snippedId}
<br />
inside src -> app -> snippets
<br />
create a new folder- [id] and then new file page.tsx
<br />

```javascript
import { notFound } from "next/navigation";
import { db } from "@/db"

interface SnippetShowPageProps {
    params: {
        id: string;
    }
}

export default async function SnippetShowPage(props:SnippetShowPageProps) {
    const snippet= await db.snippet.findFirst({
        where: {id: parseInt(props.params.id)}
    })
    console.log('SnippetShowPage => props: ', props)
    if(!snippet) {
        return notFound();
    }

    return(<div>{snippet.title}</div>)
}
```

To test : 
- http://localhost:3000/snippets/1 - will display snippet title
- http://localhost:3000/snippets/172 - will display not found page

</details>


<details>
<summary>Not Found Page </summary>
In the above code inside function SnippetShowPage , we saw below code :
<br />

> import { notFound } from "next/navigation";

This is from next - we can create our own Custom Not Found Page
<br />  
<ins> Note:   </ins>  **Please see screenshot 07-special-name-for-pages.png in docs folder**

path : snippets/src/app/snippets/[id] -> create a new file not-found.tsx
<br />

not-found.tsx
-------------
```javascript
export default function SnippetNotFoud() {
    return (
    <div>
        <h1 className='text-xl bold'> 
            Sorry, we could not find that particular snippet
        </h1>
    </div>
)}
```
<br />
To test : http://localhost:3000/snippets/172 : it wil show custom not found page
<br />


</details>

<details>
<summary>Loading Snippers </summary>

</details>
</details>

