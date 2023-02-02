const pdfUrl = '../Docs/DBMS.pdf';


let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;


const scale = 1.5,
    canvas = document.querySelector('#pdf-render');
    ctx = canvas.getContext('2d');


//Render the page
 const renderPage = num => {
    console.log(" ");
 };  


// get Document
pdfjsLib.getDocument(pdfUrl).promise.then(pdfDoc_ =>{
    pdfDoc = pdfDoc_;
    console.log(pdfDoc.numPages);

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
    
}) 