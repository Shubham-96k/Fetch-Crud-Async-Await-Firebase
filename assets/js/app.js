const cl = console.log;

const postContainer = document.getElementById("postContainer");
const postform = document.getElementById("postform");
const addbtn = document.getElementById("addbtn");
const updtbtn = document.getElementById("updtbtn");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");

let baseUrl = `https://js-crud-post-default-rtdb.asia-southeast1.firebasedatabase.app`;
let postUrl = `${baseUrl}/posts.json`;

const makeApicall = async (apiUrl,methodname,bodymsg=null) => {
    try{
        let data = await fetch(apiUrl, {
            method: methodname,
            body: bodymsg,
            headers: {
                'content-type' : 'application/json',
            }
        })
        return data.json();
    }catch{
        alert("something went wrong");
    }
}
const onEdit = async eve => {
    let editId = eve.closest(".card").id;
    localStorage.setItem("editId", editId);
    let editurl = `${baseUrl}/posts/${editId}.json`;
    try{
        let data = await makeApicall(editurl, "GET");
        titleControl.value = data.title,
        bodyControl.value = data.body,
        userIdControl.value = data.userId,
        addbtn.classList.add('d-none');
        updtbtn.classList.remove('d-none'); 
    }catch{
        cl(`something went wrong`)
    }
}
const onupdatepost = async () => {
    let updateId = localStorage.getItem("editId");
    let updturl = `${baseUrl}/posts/${updateId}.json`;
    let updatobj= {
         title : titleControl.value,
         body : bodyControl.value,
         userId : userIdControl.value,
         id : updateId
    }
    try{
        let data = await makeApicall(updturl, "PUT", JSON.stringify(updatobj));
        let card = [...document.getElementById(updateId).children];
        card[0].innerHTML = `<h1>${data.title}</h1>`;
        card[1].innerHTML = `<p>${data.body}</p>`
        addbtn.classList.remove("d-none")
        updtbtn.classList.add('d-none')
        Swal.fire({
            title: "Updated Successfully",
            icon: "success"
          });
          postform.reset();
    }catch{
        alert(`something went wrong`);
    }
}
const onDelete = eve => {
    let deleteid = eve.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteid}.json`;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
            makeApicall(deleteUrl, "DELETE");
            document.getElementById(deleteid).remove();
            updtbtn.classList.add("d-none");
            addbtn.classList.remove("d-none");
            postform.reset();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}
const onCreatepost = async eve => {
    eve.preventDefault();
    let newobj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    try{
        let data = await makeApicall(postUrl, "POST", JSON.stringify(newobj));
            newobj.id = data.name;
            postobjtemplating(newobj);
        Swal.fire({
            title: "Post Added",
            icon: "success"
          });
        eve.target.reset()
    }catch{
        alert('something went wrong');
    }
}
const objtoarr = (obj) => {
    let postarr = []
    for(let key in obj){
        obj[key]["id"] = key;
        postarr.push(obj[key]);
    }
    return postarr;
}
const postobjtemplating = eve => {
    let card = document.createElement('div');
    card.className = 'card mb-2';
    card.id = eve.id;
    card.innerHTML = `
                    <div class="card-header">
                        <h1>${eve.title}</h1>
                    </div>
                    <div class="card-body">
                        <p>${eve.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onClick="onEdit(this)" "id="editbtn">Edit</button>
                        <button class="btn btn-danger" onClick="onDelete(this)" id="deletebtn">Delete</button>
                    </div>
    `
    postContainer.prepend(card);
}
const getalldata = async () => {
    try{
        let data = await makeApicall(postUrl, "GET");
        objtoarr(data).forEach(ele => postobjtemplating(ele));
    }catch{
        alert('something went wrong')
    }
}
getalldata();



postform.addEventListener("submit" , onCreatepost)
updtbtn.addEventListener("click", onupdatepost)