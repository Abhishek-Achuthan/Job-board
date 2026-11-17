const list = document.getElementById("jobs");
const search = document.getElementById("search");
const savedList = document.getElementById("saved-jobs");
const availableTab = document.getElementById('available-tab');
const savedTab = document.getElementById('saved-tab');

const availableSection = document.getElementById('available-section');
const savedSection = document.getElementById('saved-section');

async function showJobs(query = "") {
  const res = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`)

  const savedRes = await fetch(`/api/saved`);

  const savedJobs = await savedRes.json();

  const savedJobIds = new Set(savedJobs.map((job)=>job.id));

  const jobs = await res.json();

  list.innerHTML = "";

  for (const job of jobs) {
    const li = document.createElement("li");

    const button = document.createElement('button');

    let isSaved = savedJobIds.has(job.id);

    button.textContent = isSaved?'Saved':'Save';

    button.addEventListener('click',()=> saveJob(job.id))

    li.textContent = `${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.`;

    li.append(button)

    list.append(li);

  }
}

async function showSavedJobs() {

  const res = await fetch('/api/saved');

  const jobs = await res.json();

  savedList.innerHTML = '';

  if(jobs.length === 0) {
    savedList.innerHTML  = '<li class="empty-state">No saved job yet.</li>'
    return;
  }

  for(const job of jobs){

    const li = document.createElement('li');

    const button = document.createElement('button');

    button.textContent = 'Remove';

    button.addEventListener('click',()=>removeSavedJob(job.id));

    li.textContent = `${job.title} at ${job.company}, ${job.location}`;

    li.append(button);

    savedList.append(li);

  }
}

async function saveJob(jobId) {
  const res = await fetch('/api/saved',{
    method:'POST',
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({jobId})
  });

  if(!res.ok){
    throw new Error('Failed to save job')
  }

  await showSavedJobs();

  await showJobs(search.value);
}

async function removeSavedJob(jobId) {
   const res = await fetch(`/api/saved/${jobId}`,{
    method:'DELETE'
   });
   
   if(!res.ok){
    throw new Error('Failed to remove job');
   }

   await showSavedJobs();

   await showJobs(search.value);
}

function switchTab(tab){
  const isAvailable = tab === 'available';

  availableSection.hidden = !isAvailable;

  savedSection.hidden = isAvailable;

  availableTab.classList.toggle('active',isAvailable);

  savedTab.classList.toggle('active',!isAvailable);

}

search.addEventListener("input", () => showJobs(search.value));
availableTab.addEventListener('click',()=> switchTab('available'));
savedTab.addEventListener('click',()=>switchTab('saved'));

showJobs();
showSavedJobs();
