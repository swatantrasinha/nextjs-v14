import React from 'react'
import {db} from '@/db';
import { redirect } from 'next/navigation';

export default function SnippetCreatePage() {

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

    return (
        <form action={createSnippet}>
            <h3 className='font-bold m-3'>Create a snippet</h3>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <label className='w-12' htmlFor='title'>Title</label>
                    <input id='title' name='title' className='border rounded p-2 w-full' />
                </div>

                <div className="flex gap-4">
                    <label className='w-12' htmlFor='code'>Code</label>
                    <textarea id='code' name='code' className='border rounded p-2 w-full' />
                </div>

                <button type="submit" className='border rounded p-2 bg-blue-200'>Create </button>

            </div>
        </form>
      )
}
