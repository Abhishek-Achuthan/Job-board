import { readFile, writeFile } from "node:fs/promises"

export async function loadSavedJobs(path = new URL('../saved-jobs.json',import.meta.url)){

    const raw = await readFile(path,'utf-8');

    return JSON.parse(raw);

}


export async function saveJob(id,path = new URL('../saved-jobs.json',import.meta.url)){

   const savedJobs = await loadSavedJobs(path);

   const checkDuplicate = savedJobs.includes(id)

   if(checkDuplicate){
    return;
   }

   savedJobs.push(id);

   const convertedData = JSON.stringify(savedJobs);

   await writeFile(path,convertedData,'utf-8');

}

export async function removeSavedJob(id,path = new URL('../saved-jobs.json',import.meta.url)) {

    const savedJobs = await loadSavedJobs(path);

    const checkDuplicate = savedJobs.includes(id);

    if(!checkDuplicate){
        return;
    }

    const modifiedData = savedJobs.filter((job)=> id !== job);

    const convertedData = JSON.stringify(modifiedData);

    await writeFile(path,convertedData,'utf-8');
    
}
