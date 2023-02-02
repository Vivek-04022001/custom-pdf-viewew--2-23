const pdfUrl = "../Docs/DBMS.pdf";

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
const queueRenderPage = num =>{
    if(pageIsRendering){
        pageNumIsPending = num;
    }
    else{
        renderPage(num);
    }
}


// show Previous page
const showPrevPage = ()=>{
    if(pageNum <=1){
        return;
    }
    pageNum-- ;
    queueRenderPage(pageNum);
}

// show next page
const showNextPage = ()=>{
    if(pageNum >= pdfDoc.numPages){
        return
    }
    pageNum++ ;
    queueRenderPage(pageNum);
}

// get Document
pdfjsLib.getDocument(pdfUrl).promise.then((pdfDoc_) => {
  pdfDoc = pdfDoc_;
  console.log(pdfDoc.numPages);

  document.querySelector("#page-count").textContent = pdfDoc.numPages;

  renderPage(pageNum);
});

// Buttons events

document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
