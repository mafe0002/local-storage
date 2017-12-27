const KEY = 'Mafe0002';
let contacts = [];

const init = function(){
  if(!localStorage.getItem(KEY)){
      //i.e. localStorage is still empty
      contacts = initialContacts;
      let string = JSON.stringify(contacts);
      localStorage.setItem(KEY, string);
  }else{
      contacts = JSON.parse(localStorage.getItem(KEY));
  }  
    //write contacts on the sreen
    updatedList();
    //add click event listener to FAB
    document.querySelector('.fab').addEventListener('click', displayForm);
    document.querySelector('#button-save').addEventListener('click', addContact);
    document.querySelector('#button-cancel').addEventListener('click', hideForm);
    document.getElementById('save-edit').addEventListener('click', updateEditedContact );
}

const updatedList = function(){
    contacts.sort(function (a, b) {
        let nameA = a.fullname.toUpperCase();
        let nameB = b.fullname.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    let ul = document.querySelector('ul.contacts');
    ul.innerHTML = "";
    let df = new DocumentFragment();
    contacts.forEach((contact)=>{
        df.appendChild(createElement(contact));
    });
    ul.appendChild(df);
}

const createElement = function(contact){
    let li = document.createElement('li');
    li.className = 'contact';
    
    let span1 = document.createElement('span');
    span1.className = 'edit';
    span1.setAttribute('data-key', contact.fullname);
    span1.addEventListener('click', editContact);
    li.appendChild(span1);
    
    let span2 = document.createElement('span');
    span2.className = 'delete';
    span2.setAttribute('data-key', contact.email);
    span2.addEventListener('click', deleteContact);
    li.appendChild(span2);
    
    let h3 = document.createElement('h3')
    h3.textContent = contact.fullname;
    li.appendChild(h3);
    
    let emailp = document.createElement('p');
    emailp.className = 'email';
    emailp.textContent = contact.email;
    li.appendChild(emailp);
    
    let phonep = document.createElement('p');
    phonep.className = 'phone';
    phonep.textContent = contact.phone;
    li.appendChild(phonep);
    
    return li;
}

const editContact = function(ev){
    //make form display information of existing contact, and allow it to be edited.
    ev.preventDefault;
    let Fullname = ev.target.getAttribute('data-key');
    let contactEdit = contacts.filter((contact) => {
        return !(contact.fullname == Fullname); 
    });
    document.getElementById('input-name').value = contactEdit[0].fullname;
    document.getElementById('input-email').value = contactEdit[0].email;
    document.getElementById('input-phone').value = contactEdit[0].phone;
    displayForm(ev);
}

const updateEditedContact = function(ev){
    //add edited contact to obj contacts.
    ev.preventDefault;
    let Fullname = document.getElementById('input-name').value.trim();
    contacts = contacts.filter((contact) => {
        return !(contact.fullname == Fullname);
    });
    addContact(ev);
}

const displayForm = function(ev){
   ev.preventDefault;
    let target = ev.target.className;
    if (target == 'fab') {
        document.querySelector('main').style.opacity = '0';
        document.querySelector('.fab').style.opacity = '0';
        document.querySelector('.contactForm').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
        document.getElementById('button-save').style.display = 'inline';
        document.getElementById('save-edit').style.display = 'none';
    } else if (target == 'edit') {
        document.querySelector('main').style.opacity = '0';
        document.querySelector('.fab').style.opacity = '0';
        document.querySelector('.contactForm').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
        document.getElementById('button-save').style.display = 'none';
        document.getElementById('save-edit').style.display = 'inline';
    }
    setTimeout(function(){
 document.querySelector('.contactForm').classList.add('transition')
    }, 200);
}

const hideForm = function(ev){
    ev.preventDefault();
    setTimeout(function() {
 document.querySelector('.contactForm').classList.remove('transition');
    document.querySelector('main').style.opacity = '1';
    document.querySelector('.fab').style.opacity = '1';
    document.querySelector('.contactForm').style.display = 'none';
    document.querySelector('.overlay').style.display= 'none';
    document.querySelector('.contactForm form').reset();
    }, 400);
        
}

const addContact = function(ev){
    //take from form, save in object, add object to contacts array
    //replace local storage with new contacts array
  ev.preventDefault();
    let obj = {};
    let fullname = document.getElementById('input-name').value.trim();
    let email = document.getElementById('input-email').value.trim();
    let phone = document.getElementById('input-phone').value.trim();
    if (fullname && email && phone){
        obj = {fullname, email, phone};
        //check for duplicates in the contacts array
        contacts.push(obj);
        localStorage.setItem(KEY, JSON.stringify(contacts));
        hideForm(new MouseEvent('click'));
        //reflect changes
        updatedList();
    }else{
        alert ('Form not filled in ');
    }
}

const deleteContact =function(ev){
     //get data-storage
    ev.preventDefault();
    let email = ev.target.getAttribute('data-key');
    console.log(email);
    //find matching email address global contacts and remove that object from the contacts array
    contacts = contacts.filter((contact)=>{
       console.log(contact.email, email);
       return !(contact.email == email);
    });
    console.log(contacts);
    localStorage.setItem(KEY, JSON.stringify(contacts) );
    //reflect changes
    updatedList();
}

document.addEventListener('DOMContentLoaded', init);