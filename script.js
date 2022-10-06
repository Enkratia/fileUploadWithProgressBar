const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadArea = document.querySelector(".upload-area");

form.addEventListener("click", () => {
  fileInput.click();
})

fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    let fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 11) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  }
}

function uploadFile(name) {
  let xhr = new XMLHttpRequest;
  xhr.open("POST", "php/upload.php");
  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor(loaded / total * 100);
    let fileTotal = Math.floor(total / 1024);

    let filesize;
    (fileTotal < 1024) ? filesize = fileTotal + " KB" : filesize = (total / (1024 * 1024)).toFixed(2) + " MB";


    let progressHTML = `
                      <li class="row">
                          <i class="fas fa-file-alt"></i>

                          <div class="content">
                            <div class="details">
                              <span class="name">${name} · Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>

                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded === total) {
      progressArea.innerHTML = "";
      let uploadedHTML = `
                       <li class= "row" >
                          <div class="content">
                            <i class="fas fa-file-alt"></i>
  
                            <div class="details">
                              <span class="name">${name} · Uploading</span>
                              <span class="size">${filesize}</span>
                            </div>
                          </div>
                          <i class="fas fa-check"></i>
                        </li > `;

      uploadArea.classList.remove("onprogress");
      uploadArea.insertAdjacentHTML("afterbegin", uploadedHTML);
    }
  });
  let formData = new FormData(form);
  xhr.send(formData);
}