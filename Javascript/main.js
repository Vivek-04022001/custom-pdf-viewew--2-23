const pdfUrl = "../Docs/DBMS.pdf";
const inputPage = document.querySelector("#goToPage");
const goToBtn = document.querySelector("#goToBtn");
const inputPdf = document.querySelector('#inputPdf');


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

inputPdf.addEventListener('change',function(e){
    
})
