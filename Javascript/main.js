const inputPage = document.querySelector("#goToPage");
const goToBtn = document.querySelector("#goToBtn");
const inputPdf = document.querySelector("#inputPdf");
let pdfUrl = "../Docs/DBMS.pdf";

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector("#pdf-render");
ctx = canvas.getContext("2d");

//Render the page
const renderPage = (num) => {
  pageIsRendering = true;

  //get Page
  pdfDoc.getPage(num).then((page) => {
    // set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending != null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });
    // output current page
    document.querySelector("#page-num").textContent = num;
  });
};

// check for pages rendering
const queueRenderPage = (num) => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// show Previous page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// show next page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

// key press for right and left

function keyPress(e){
  const key = e.key;

  if (key === "ArrowRight") {
    showNextPage();
  }
  if (key === "ArrowLeft") {
    showPrevPage();
  }
}

// get Document
pdfjsLib
  .getDocument(pdfUrl)
  .promise.then((pdfDoc_) => {
    pdfDoc = pdfDoc_;

    document.querySelector("#page-count").textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch((error) => {
    // display error
    const div = document.createElement("div");
    div.className = "error";
    div.appendChild(document.createTextNode(error.message));
    document.querySelector("body").insertBefore(div, canvas);

    // remove top bar
    document.querySelector(".top-bar").style.display = "none";
  });

// Buttons events

document.querySelector("#prev-page").addEventListener("click", showPrevPage);
document.querySelector("#next-page").addEventListener("click", showNextPage);

inputPage.addEventListener("input", function (e) {
  renderPage(+inputPage.value);
});

// step1: get the file from the input element
inputPdf.addEventListener("change", function (e) {
  const file = e.target.files[0];

  // step2: Read the file using file reader
  const fileReader = new FileReader();

  fileReader.onload = function () {
    // step4: turn array buffer into typed array
    const typedArray = new Uint8Array(this.result);

    // step5: pdfjs should be able to read this
    pdfjsLib
      .getDocument(typedArray)
      .promise.then((pdfDoc_) => {
        pdfDoc = pdfDoc_;

        document.querySelector("#page-count").textContent = pdfDoc.numPages;

        renderPage(pageNum);
      })
      .catch((error) => {
        // display error
        const div = document.createElement("div");
        div.className = "error";
        div.appendChild(document.createTextNode(error.message));
        document.querySelector("body").insertBefore(div, canvas);

        // remove top bar
        document.querySelector(".top-bar").style.display = "none";
      });
  };
  // step 3: read the file as ArrayBuffer
  fileReader.readAsArrayBuffer(file);
});

// key press function called
document.body.addEventListener("keydown", keyPress);


