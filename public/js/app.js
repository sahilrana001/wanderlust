(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // display total tax 

  let checkbox = document.querySelector(".form-check-input")
  checkbox.addEventListener("click" , ()=>{
    let taxSwitch = document.getElementsByClassName("tax-info")
    console.log(taxSwitch);
    for(let single of taxSwitch){
      if(single.style.display != "inline"){
        single.style.display = "inline"

      }else{
        single.style.display = "none"
      }
      
    }
    
  })
